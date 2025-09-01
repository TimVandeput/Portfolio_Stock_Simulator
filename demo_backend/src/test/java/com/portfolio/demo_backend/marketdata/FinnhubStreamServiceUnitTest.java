package com.portfolio.demo_backend.marketdata;

import com.portfolio.demo_backend.config.FinnhubProperties;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Method;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.assertj.core.api.Assertions.assertThat;

class FinnhubStreamServiceUnitTest {

    @Test
    void handle_parsesTrade_andNotifiesListener() throws Exception {
        FinnhubProperties props = new FinnhubProperties();
        props.setWsUrl("wss://test");
        props.setToken("TOK");

        FinnhubStreamService svc = new FinnhubStreamService(props);

        AtomicBoolean called = new AtomicBoolean(false);
        svc.addListener("AAPL", (s, p) -> {
            if (s.equals("AAPL") && p == 123.45)
                called.set(true);
        });

        String msg = "{\"type\":\"trade\",\"data\":[{\"s\":\"AAPL\",\"p\":123.45}]}";

        Method m = FinnhubStreamService.class.getDeclaredMethod("handle", String.class);
        m.setAccessible(true);
        m.invoke(svc, msg);

        assertThat(called.get()).isTrue();
    }
}
