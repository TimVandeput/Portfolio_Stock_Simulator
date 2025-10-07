package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.config.FinnhubProperties;
import okhttp3.*;
import okio.ByteString;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * WebSocket streaming client for Finnhub trades.
 * <p>
 * Responsibilities:
 * - Manage WebSocket connection lifecycle with exponential backoff retries
 * - Maintain last price and percent change snapshots per symbol
 * - Allow dynamic subscribe/unsubscribe and listener callbacks per symbol
 * <p>
 * Thread-safety:
 * - Listener collections and price maps are {@link java.util.concurrent.ConcurrentHashMap}
 *   backed and safe for concurrent access from the WS thread and application threads.
 * - Public methods are designed to be called concurrently; internal state is guarded
 *   via concurrent collections.
 * <p>
 * Lifecycle:
 * - {@link #connect()} is invoked at startup (@PostConstruct) when streaming is enabled and
 *   a token is present; reconnect is automatic on failures.
 * - {@link #shutdown()} is invoked at container shutdown (@PreDestroy) to close resources.
 */
@Slf4j
@Service
public class FinnhubStreamService {

    /** Listener for price updates per symbol. */
    public interface PriceListener {
        /**
         * Called on each price update. Percent change may be null if open price
         * unknown.
         */
        void onPrice(String symbol, double price, Double percentChange);
    }

    private final OkHttpClient client = new OkHttpClient();
    private final Map<String, List<PriceListener>> listeners = new ConcurrentHashMap<>();
    private final FinnhubProperties props;
    private WebSocket ws;
    private final ObjectMapper mapper = new ObjectMapper();
    private final AtomicInteger reconnectAttempts = new AtomicInteger(0);
    private final Random jitter = new Random();
    private final Map<String, Double> lastPrices = new ConcurrentHashMap<>();
    private final Map<String, Double> dailyOpenPrices = new ConcurrentHashMap<>();

    /**
     * Constructs the Finnhub streaming service with the provided properties.
     *
     * @param props configuration containing API token, WS URL and enabled flag
     */
    public FinnhubStreamService(FinnhubProperties props) {
        this.props = props;
        log.info("FinnhubStreamService constructor called with enabled={} token={}",
                props.isEnabled(), props.getToken() != null ? "***TOKEN***" : "null");
    }

    @PostConstruct
    /**
     * Opens the WebSocket connection if streaming is enabled and a token is configured.
     * On successful (re)connect, automatically re-subscribes to all symbols previously
     * added via {@link #subscribe(String)} or {@link #addListener(String, PriceListener)}.
     *
     * Error handling:
     * - Connection failures schedule a retry using exponential backoff with jitter.
     * - Any failures are logged; callers do not receive exceptions.
     */
    public void connect() {
        log.info("FinnhubStreamService @PostConstruct connect() method called");
        if (!props.isEnabled() || !StringUtils.hasText(props.getToken())) {
            log.info("Finnhub streaming disabled (enabled={} tokenPresent={})",
                    props.isEnabled(), StringUtils.hasText(props.getToken()));
            return;
        }

        String url = props.getWsUrl() + "?token=" + props.getToken();
        Request req = new Request.Builder().url(url).build();
        ws = client.newWebSocket(req, new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                log.info("Finnhub WebSocket opened successfully");
                reconnectAttempts.set(0);
                try {
                    for (String sym : listeners.keySet()) {
                        String msg = "{\"type\":\"subscribe\",\"symbol\":\"" + sym + "\"}";
                        log.debug("Subscribing to symbol: {}", sym);
                        webSocket.send(msg);
                    }
                    log.info("Subscribed to {} symbols", listeners.size());
                } catch (Exception ex) {
                    log.warn("Error while re-subscribing on open", ex);
                }
            }

            @Override
            public void onMessage(WebSocket webSocket, String text) {
                log.debug("Received WebSocket message: {}", text);
                handle(text);
            }

            @Override
            public void onMessage(WebSocket webSocket, ByteString bytes) {
                handle(bytes.utf8());
            }

            @Override
            public void onFailure(WebSocket webSocket, Throwable t, Response r) {
                if (r != null) {
                    log.error("Finnhub WS failure: HTTP {} - {}", r.code(), r.message());
                }
                if (t != null) {
                    log.error("Finnhub WS error", t);
                }

                try {
                    webSocket.close(1001, "closing due to failure");
                } catch (Exception ignored) {
                }

                int attempt = reconnectAttempts.getAndIncrement();
                long base = 1000L;
                long delay = Math.min(60000L, base * (1L << Math.min(attempt, 10)));
                delay += jitter.nextInt(1000);

                new java.util.Timer().schedule(new java.util.TimerTask() {
                    @Override
                    public void run() {
                        log.info("Retrying Finnhub WS connection... attempt {}", attempt + 1);
                        connect();
                    }
                }, delay);
            }

        });
    }

    @PreDestroy
    /**
     * Gracefully closes the WebSocket and shuts down the HTTP client's executor.
     * Safe to call multiple times; subsequent calls are no-ops.
     */
    public void shutdown() {
        if (!ObjectUtils.isEmpty(ws))
            ws.close(1000, "shutdown");
        client.dispatcher().executorService().shutdown();
    }

    /**
     * Subscribes to price updates for a symbol.
     * <p>
     * If the WebSocket is not yet connected, the symbol is tracked and will be
     * (re)subscribed automatically on the next successful connection.
     *
     * @param symbol ticker symbol (e.g., AAPL)
     */
    public void subscribe(String symbol) {
        log.debug("Adding subscription for symbol: {}", symbol);
        listeners.computeIfAbsent(symbol, k -> new CopyOnWriteArrayList<>());
        if (!ObjectUtils.isEmpty(ws)) {
            String msg = "{\"type\":\"subscribe\",\"symbol\":\"" + symbol + "\"}";
            log.debug("Sending subscribe message: {}", msg);
            ws.send(msg);
        } else {
            log.warn("WebSocket is null when trying to subscribe to {}", symbol);
        }
    }

    /**
     * Unsubscribes a listener from a symbol. If no listeners remain for the symbol,
     * a WS-level unsubscribe message is sent and the local subscription is removed.
     * Missing listeners or symbols are ignored.
     *
     * @param symbol ticker symbol
     * @param l      listener to remove
     */
    public void unsubscribe(String symbol, PriceListener l) {
        List<PriceListener> ls = listeners.get(symbol);
        if (!ObjectUtils.isEmpty(ls)) {
            ls.remove(l);
            if (ls.isEmpty()) {
                listeners.remove(symbol);
                if (!ObjectUtils.isEmpty(ws)) {
                    String msg = "{\"type\":\"unsubscribe\",\"symbol\":\"" + symbol + "\"}";
                    ws.send(msg);
                }
            }
        }
    }

    /**
     * Adds a price listener for the given symbol and ensures a subscription exists.
     * If the WS is connected, a subscribe message is sent immediately; otherwise the
     * subscription will be established on the next reconnect.
     *
     * @param symbol ticker symbol
     * @param l      listener callback
     */
    public void addListener(String symbol, PriceListener l) {
        listeners.computeIfAbsent(symbol, k -> new CopyOnWriteArrayList<>()).add(l);
        subscribe(symbol);
    }

    /**
     * Returns the last observed price for a symbol.
     *
     * @param symbol ticker symbol
     * @return last price, or {@code null} if no trades have been observed yet
     */
    public Double getLastPrice(String symbol) {
        return lastPrices.get(symbol);
    }

    /**
     * Computes percent change based on last price vs the first observed price of the day
     * (treated as an "open" price). If there is insufficient data, returns {@code null}.
     *
     * @param symbol ticker symbol
     * @return percent change, or {@code null} if open/current price is unavailable
     */
    public Double getPercentChange(String symbol) {
        Double current = lastPrices.get(symbol);
        Double open = dailyOpenPrices.get(symbol);
        if (!ObjectUtils.isEmpty(current) && !ObjectUtils.isEmpty(open) && open != 0) {
            return ((current - open) / open) * 100.0;
        }
        return null;
    }

    /**
     * Handles a raw WebSocket JSON message. Parses trade updates and updates internal
     * price snapshots, then notifies registered listeners for the affected symbols.
     * Non-trade messages or malformed payloads are ignored.
     *
     * @param json raw JSON message payload from Finnhub WS
     */
    private void handle(String json) {
        try {
            JsonNode root = mapper.readTree(json);
            if (!root.has("type") || !"trade".equals(root.get("type").asText()))
                return;
            JsonNode data = root.get("data");
            if (ObjectUtils.isEmpty(data) || !data.isArray())
                return;
            for (JsonNode item : data) {
                JsonNode s = item.get("s");
                JsonNode p = item.get("p");
                if (ObjectUtils.isEmpty(s) || ObjectUtils.isEmpty(p))
                    continue;
                String sym = s.asText();
                double price;
                try {
                    price = p.asDouble();
                } catch (Exception e) {
                    continue;
                }

                dailyOpenPrices.computeIfAbsent(sym, k -> price);

                lastPrices.put(sym, price);

                Double percentChange = getPercentChange(sym);

                log.debug("Price update for {}: {} ({}%)", sym, price, percentChange);

                var ls = listeners.get(sym);
                if (!ObjectUtils.isEmpty(ls))
                    ls.forEach(l -> l.onPrice(sym, price, percentChange));
            }
        } catch (Exception ex) {
            log.debug("Failed to parse Finnhub WS message: {}", ex.getMessage());
        }
    }
}