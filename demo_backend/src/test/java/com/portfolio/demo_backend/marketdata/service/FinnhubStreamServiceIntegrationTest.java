package com.portfolio.demo_backend.marketdata.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class FinnhubStreamServiceIntegrationTest {

    @Autowired
    private FinnhubStreamService finnhubStreamService;

    @Test
    void contextLoads() {
        assertThat(finnhubStreamService).isNotNull();
    }

    @Test
    void getLastPrice_returnsNullForUnknownSymbol() {
        Double price = finnhubStreamService.getLastPrice("UNKNOWN_SYMBOL");

        assertThat(price).isNull();
    }

    @Test
    void getPercentChange_returnsNullForUnknownSymbol() {
        Double change = finnhubStreamService.getPercentChange("UNKNOWN_SYMBOL");

        assertThat(change).isNull();
    }

    @Test
    void addListener_doesNotThrowException() {
        FinnhubStreamService.PriceListener listener = (symbol, price, percentChange) -> {
        };

        assertThatCode(() -> {
            finnhubStreamService.addListener("AAPL", listener);
            finnhubStreamService.unsubscribe("AAPL", listener);
        }).doesNotThrowAnyException();
    }
}
