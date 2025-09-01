package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.config.FinnhubProperties;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class QuoteServiceErrorIntegrationTest {

    MockWebServer server;

    @BeforeEach
    void start() throws Exception {
        server = new MockWebServer();
        server.start();
    }

    @AfterEach
    void stop() throws Exception {
        server.shutdown();
    }

    @Test
    void getLastQuote_nonSuccessful_throwsIOException() throws Exception {
        server.enqueue(new MockResponse().setResponseCode(500).setBody("{\"error\":\"boom\"}"));

        FinnhubProperties props = new FinnhubProperties();
        props.setToken("T");
        props.setApiBase(server.url("").toString().replaceAll("/$", ""));

        QuoteService svc = new QuoteService(props);

        assertThatThrownBy(() -> svc.getLastQuote("AAPL")).isInstanceOf(IOException.class);
    }
}
