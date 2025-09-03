package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.config.FinnhubProperties;
import okhttp3.*;
import okio.ByteString;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
public class FinnhubStreamService {

    public interface PriceListener {
        void onPrice(String symbol, double price);
    }

    private final OkHttpClient client = new OkHttpClient();
    private final Map<String, List<PriceListener>> listeners = new ConcurrentHashMap<>();
    private final FinnhubProperties props;
    private WebSocket ws;
    private final ObjectMapper mapper = new ObjectMapper();
    private final AtomicInteger reconnectAttempts = new AtomicInteger(0);
    private final Random jitter = new Random();

    public FinnhubStreamService(FinnhubProperties props) {
        this.props = props;
    }

    @PostConstruct
    public void connect() {
        if (!props.isEnabled() || props.getToken() == null || props.getToken().isBlank()) {
            log.info("Finnhub streaming disabled (enabled={} tokenPresent={})",
                    props.isEnabled(), props.getToken() != null && !props.getToken().isBlank());
            return;
        }

        String url = props.getWsUrl() + "?token=" + props.getToken();
        Request req = new Request.Builder().url(url).build();
        ws = client.newWebSocket(req, new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
                reconnectAttempts.set(0);
                try {
                    for (String sym : listeners.keySet()) {
                        String msg = "{\"type\":\"subscribe\",\"symbol\":\"" + sym + "\"}";
                        webSocket.send(msg);
                    }
                } catch (Exception ex) {
                    log.warn("Error while re-subscribing on open", ex);
                }
            }

            @Override
            public void onMessage(WebSocket webSocket, String text) {
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
    public void shutdown() {
        if (ws != null)
            ws.close(1000, "shutdown");
        client.dispatcher().executorService().shutdown();
    }

    public void subscribe(String symbol) {
        listeners.computeIfAbsent(symbol, k -> new CopyOnWriteArrayList<>());
        if (ws != null) {
            String msg = "{\"type\":\"subscribe\",\"symbol\":\"" + symbol + "\"}";
            ws.send(msg);
        }
    }

    public void unsubscribe(String symbol, PriceListener l) {
        List<PriceListener> ls = listeners.get(symbol);
        if (ls != null) {
            ls.remove(l);
            if (ls.isEmpty()) {
                listeners.remove(symbol);
                if (ws != null) {
                    String msg = "{\"type\":\"unsubscribe\",\"symbol\":\"" + symbol + "\"}";
                    ws.send(msg);
                }
            }
        }
    }

    public void addListener(String symbol, PriceListener l) {
        listeners.computeIfAbsent(symbol, k -> new CopyOnWriteArrayList<>()).add(l);
        subscribe(symbol);
    }

    private void handle(String json) {
        try {
            JsonNode root = mapper.readTree(json);
            if (!root.has("type") || !"trade".equals(root.get("type").asText()))
                return;
            JsonNode data = root.get("data");
            if (data == null || !data.isArray())
                return;
            for (JsonNode item : data) {
                JsonNode s = item.get("s");
                JsonNode p = item.get("p");
                if (s == null || p == null)
                    continue;
                String sym = s.asText();
                double price;
                try {
                    price = p.asDouble();
                } catch (Exception e) {
                    continue;
                }
                var ls = listeners.get(sym);
                if (ls != null)
                    ls.forEach(l -> l.onPrice(sym, price));
            }
        } catch (Exception ex) {
            log.debug("Failed to parse Finnhub WS message: {}", ex.getMessage());
        }
    }
}
