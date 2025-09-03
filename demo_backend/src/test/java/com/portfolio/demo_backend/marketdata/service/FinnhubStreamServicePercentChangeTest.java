package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.config.FinnhubProperties;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;

class FinnhubStreamServicePercentChangeTest {

    @Test
    void calculatePercentChange_firstPriceBecomesOpen() throws Exception {
        FinnhubProperties props = new FinnhubProperties();
        FinnhubStreamService svc = new FinnhubStreamService(props);

        AtomicReference<Double> receivedPrice = new AtomicReference<>();
        AtomicReference<Double> receivedPercentChange = new AtomicReference<>();

        svc.addListener("TSLA", (symbol, price, percentChange) -> {
            receivedPrice.set(price);
            receivedPercentChange.set(percentChange);
        });

        String firstMsg = "{\"type\":\"trade\",\"data\":[{\"s\":\"TSLA\",\"p\":100.0}]}";
        invokeHandle(svc, firstMsg);

        assertThat(receivedPrice.get()).isEqualTo(100.0);
        assertThat(receivedPercentChange.get()).isEqualTo(0.0);

        String secondMsg = "{\"type\":\"trade\",\"data\":[{\"s\":\"TSLA\",\"p\":105.0}]}";
        invokeHandle(svc, secondMsg);

        assertThat(receivedPrice.get()).isEqualTo(105.0);
        assertThat(receivedPercentChange.get()).isEqualTo(5.0);

        String thirdMsg = "{\"type\":\"trade\",\"data\":[{\"s\":\"TSLA\",\"p\":95.0}]}";
        invokeHandle(svc, thirdMsg);

        assertThat(receivedPrice.get()).isEqualTo(95.0);
        assertThat(receivedPercentChange.get()).isEqualTo(-5.0);
    }

    @Test
    void getPercentChange_returnsNullWhenNoData() {
        FinnhubProperties props = new FinnhubProperties();
        FinnhubStreamService svc = new FinnhubStreamService(props);

        Double percentChange = svc.getPercentChange("UNKNOWN");
        assertThat(percentChange).isNull();
    }

    @Test
    void getLastPrice_returnsNullWhenNoData() {
        FinnhubProperties props = new FinnhubProperties();
        FinnhubStreamService svc = new FinnhubStreamService(props);

        Double price = svc.getLastPrice("UNKNOWN");
        assertThat(price).isNull();
    }

    private void invokeHandle(FinnhubStreamService svc, String message) throws Exception {
        Method handleMethod = FinnhubStreamService.class.getDeclaredMethod("handle", String.class);
        handleMethod.setAccessible(true);
        handleMethod.invoke(svc, message);
    }
}
