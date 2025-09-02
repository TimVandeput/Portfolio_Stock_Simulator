package com.portfolio.demo_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.demo_backend.config.FinnhubProperties;
import com.portfolio.demo_backend.integration.finnhub.FinnhubQuoteRaw;
import com.portfolio.demo_backend.dto.QuoteDTO;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;

class QuoteServiceIntegrationTest {

    MockWebServer server;

    @BeforeEach
    void start() throws IOException {
        server = new MockWebServer();
        server.start();
    }

    @AfterEach
    void stop() throws IOException {
        server.shutdown();
    }

    @Test
    void getLastQuote_endToEnd() throws Exception {
        FinnhubQuoteRaw raw = new FinnhubQuoteRaw();
        raw.setC(200.0);
        raw.setH(210.0);
        raw.setL(190.0);
        raw.setO(195.0);
        raw.setPc(198.0);
        raw.setD(2.0);
        raw.setDp(1.0);
        raw.setT(1620000000L);

        ObjectMapper m = new ObjectMapper();
        server.enqueue(new MockResponse().setBody(m.writeValueAsString(raw)).setResponseCode(200));

        FinnhubProperties props = new FinnhubProperties();
        props.setToken("TEST");
        props.setApiBase(server.url("").toString().replaceAll("/$", ""));

        QuoteService svc = new QuoteService(props);
        QuoteDTO q = svc.getLastQuote("AAPL");

        assertThat(q).isNotNull();
        assertThat(q.getCurrent()).isEqualTo(200.0);
        assertThat(q.getHigh()).isEqualTo(210.0);
        assertThat(q.getLow()).isEqualTo(190.0);
    }
}
