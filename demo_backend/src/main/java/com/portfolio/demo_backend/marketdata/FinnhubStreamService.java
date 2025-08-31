package com.portfolio.demo_backend.marketdata;

import com.portfolio.demo_backend.config.FinnhubProperties;
import okhttp3.*;
import okio.ByteString;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

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

    public FinnhubStreamService(FinnhubProperties props) {
        this.props = props;
    }

    @PostConstruct
    public void connect() {
        String url = props.getWsUrl() + "?token=" + props.getToken();
        Request req = new Request.Builder().url(url).build();
        ws = client.newWebSocket(req, new WebSocketListener() {
            @Override
            public void onOpen(WebSocket webSocket, Response response) {
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

                new java.util.Timer().schedule(new java.util.TimerTask() {
                    @Override
                    public void run() {
                        log.info("Retrying Finnhub WS connection...");
                        connect();
                    }
                }, 5000);
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

    public void addListener(String symbol, PriceListener l) {
        listeners.computeIfAbsent(symbol, k -> new CopyOnWriteArrayList<>()).add(l);
        subscribe(symbol);
    }

    private void handle(String json) {
        if (!json.contains("\"type\":\"trade\""))
            return;
        String[] parts = json.split("\\{");
        for (String part : parts) {
            if (part.contains("\"s\":\"") && part.contains("\"p\":")) {
                String sym = part.split("\"s\":\"")[1].split("\"")[0];
                String pStr = part.split("\"p\":")[1].split("[,}]")[0];
                try {
                    double price = Double.parseDouble(pStr);
                    var ls = listeners.get(sym);
                    if (ls != null)
                        ls.forEach(l -> l.onPrice(sym, price));
                } catch (NumberFormatException ignored) {
                }
            }
        }
    }
}
