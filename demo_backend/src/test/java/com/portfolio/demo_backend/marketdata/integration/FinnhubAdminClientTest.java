package com.portfolio.demo_backend.marketdata.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.demo_backend.config.FinnhubProperties;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class FinnhubAdminClientTest {

    private MockWebServer server;
    private FinnhubAdminClient client;

    @BeforeEach
    void setup() throws IOException {
        server = new MockWebServer();
        server.start();

        FinnhubProperties props = new FinnhubProperties();
        props.setApiBase(server.url("/").toString());
        props.setToken("TEST_TOKEN");

        client = new FinnhubAdminClient(props);
    }

    @AfterEach
    void tearDown() throws IOException {
        server.shutdown();
    }

    @Test
    void getIndexConstituents_returnsSymbols() throws Exception {
        String body = new ObjectMapper().writeValueAsString(
                new FinnhubAdminClient.ConstituentsResponse() {
                    {
                        constituents = List.of("AAPL", "MSFT");
                    }
                });

        server.enqueue(new MockResponse().setBody(body).setResponseCode(200));

        List<String> result = client.getIndexConstituents("NDX");

        assertThat(result).containsExactly("AAPL", "MSFT");
    }

    @Test
    void getProfile2_returnsProfile() throws Exception {
        String body = """
                {
                  "name": "Apple Inc",
                  "exchange": "XNAS",
                  "ticker": "AAPL",
                  "currency": "USD",
                  "mic": "XNAS"
                }
                """;

        server.enqueue(new MockResponse().setBody(body).setResponseCode(200));

        FinnhubAdminClient.Profile2 profile = client.getProfile2("AAPL");

        assertThat(profile.name).isEqualTo("Apple Inc");
        assertThat(profile.ticker).isEqualTo("AAPL");
    }

    @Test
    void listSymbolsByExchange_returnsList() throws Exception {
        String body = """
                [
                  {"symbol":"AAPL","description":"Apple","currency":"USD","mic":"XNAS","type":"Common Stock"},
                  {"symbol":"MSFT","description":"Microsoft","currency":"USD","mic":"XNAS","type":"Common Stock"}
                ]
                """;

        server.enqueue(new MockResponse().setBody(body).setResponseCode(200));

        List<FinnhubAdminClient.SymbolItem> items = client.listSymbolsByExchange("US");

        assertThat(items).hasSize(2);
        assertThat(items.get(0).symbol).isEqualTo("AAPL");
        assertThat(items.get(1).symbol).isEqualTo("MSFT");
    }
}
