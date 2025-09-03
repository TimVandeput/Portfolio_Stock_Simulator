package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.config.FinnhubProperties;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.WebSocketListener;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

class FinnhubStreamServiceIntegrationTest {

    @Test
    void websocket_integration_receivesTrade() throws Exception {
        try (MockWebServer server = new MockWebServer()) {
            server.start();
            MockResponse upgrade = new MockResponse().withWebSocketUpgrade(new WebSocketListener() {
                @Override
                public void onOpen(WebSocket webSocket, Response response) {
                    webSocket.send("{\"type\":\"trade\",\"data\":[{\"s\":\"AAPL\",\"p\":123.45}]}\n");
                }
            });

            server.enqueue(upgrade);

            String wsUrl = server.url("/").toString().replaceFirst("^http", "ws");

            FinnhubProperties props = new FinnhubProperties();
            props.setWsUrl(wsUrl);
            props.setToken("TOK");
            props.setEnabled(true);

            FinnhubStreamService svc = new FinnhubStreamService(props);

            CountDownLatch latch = new CountDownLatch(1);
            svc.addListener("AAPL", (s, p, pc) -> {
                if ("AAPL".equals(s) && p == 123.45) {
                    latch.countDown();
                }
            });

            svc.connect();

            boolean received = latch.await(3, TimeUnit.SECONDS);
            assertThat(received).isTrue();
        }
    }
}
