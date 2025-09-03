package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.config.FinnhubProperties;
import okhttp3.WebSocket;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

class FinnhubStreamServiceListenersTest {

    @Test
    void addListener_multipleCalled() throws Exception {
        FinnhubProperties props = new FinnhubProperties();
        FinnhubStreamService svc = new FinnhubStreamService(props);

        AtomicInteger calls = new AtomicInteger(0);
        svc.addListener("TSLA", (s, p) -> calls.incrementAndGet());
        svc.addListener("TSLA", (s, p) -> calls.incrementAndGet());

        java.lang.reflect.Method m = FinnhubStreamService.class.getDeclaredMethod("handle", String.class);
        m.setAccessible(true);
        m.invoke(svc, "{\"type\":\"trade\",\"data\":[{\"s\":\"TSLA\",\"p\":420.0}]}");

        assertThat(calls.get()).isEqualTo(2);
    }

    @Test
    void subscribe_sendsMessage_whenWebSocketPresent() throws Exception {
        FinnhubProperties props = new FinnhubProperties();
        FinnhubStreamService svc = new FinnhubStreamService(props);

        class DummyWS implements WebSocket {
            String last;

            @Override
            public boolean send(String text) {
                last = text;
                return true;
            }

            @Override
            public boolean send(okio.ByteString bytes) {
                last = bytes.utf8();
                return true;
            }

            @Override
            public void cancel() {
            }

            @Override
            public boolean close(int code, String reason) {
                return true;
            }

            @Override
            public okhttp3.Request request() {
                return null;
            }

            @Override
            public long queueSize() {
                return 0L;
            }
        }

        DummyWS d = new DummyWS();
        Field f = FinnhubStreamService.class.getDeclaredField("ws");
        f.setAccessible(true);
        f.set(svc, d);

        svc.subscribe("NFLX");

        assertThat(d.last).contains("\"symbol\":\"NFLX\"");
    }

    @Test
    void unsubscribe_sendsUnsubscribe_whenLastListenerRemoved() throws Exception {
        FinnhubProperties props = new FinnhubProperties();
        FinnhubStreamService svc = new FinnhubStreamService(props);

        class DummyWS implements WebSocket {
            String last;

            @Override
            public boolean send(String text) {
                last = text;
                return true;
            }

            @Override
            public boolean send(okio.ByteString bytes) {
                last = bytes.utf8();
                return true;
            }

            @Override
            public void cancel() {
            }

            @Override
            public boolean close(int code, String reason) {
                return true;
            }

            @Override
            public okhttp3.Request request() {
                return null;
            }

            @Override
            public long queueSize() {
                return 0L;
            }
        }

        DummyWS d = new DummyWS();
        java.lang.reflect.Field f = FinnhubStreamService.class.getDeclaredField("ws");
        f.setAccessible(true);
        f.set(svc, d);

        FinnhubStreamService.PriceListener listener = (s, p) -> {
        };
        svc.addListener("IBM", listener);

        d.last = null;
        svc.unsubscribe("IBM", listener);

        assertThat(d.last).contains("\"type\":\"unsubscribe\"");
        assertThat(d.last).contains("\"symbol\":\"IBM\"");
    }

    @Test
    void unsubscribe_doesNotSend_whenOtherListenersRemain() throws Exception {
        FinnhubProperties props = new FinnhubProperties();
        FinnhubStreamService svc = new FinnhubStreamService(props);

        class DummyWS implements WebSocket {
            String last;

            @Override
            public boolean send(String text) {
                last = text;
                return true;
            }

            @Override
            public boolean send(okio.ByteString bytes) {
                last = bytes.utf8();
                return true;
            }

            @Override
            public void cancel() {
            }

            @Override
            public boolean close(int code, String reason) {
                return true;
            }

            @Override
            public okhttp3.Request request() {
                return null;
            }

            @Override
            public long queueSize() {
                return 0L;
            }
        }

        DummyWS d = new DummyWS();
        java.lang.reflect.Field f = FinnhubStreamService.class.getDeclaredField("ws");
        f.setAccessible(true);
        f.set(svc, d);

        FinnhubStreamService.PriceListener l1 = (s, p) -> {
        };
        FinnhubStreamService.PriceListener l2 = (s, p) -> {
        };
        svc.addListener("MSFT", l1);
        svc.addListener("MSFT", l2);

        d.last = null;
        svc.unsubscribe("MSFT", l1);

        assertThat(d.last).isNull();
    }

    @Test
    void connect_skipsWhenDisabled_orNoToken() throws Exception {
        FinnhubProperties props = new FinnhubProperties();
        props.setEnabled(false);
        props.setToken(null);
        FinnhubStreamService svc = new FinnhubStreamService(props);

        java.lang.reflect.Method m = FinnhubStreamService.class.getDeclaredMethod("connect");
        m.setAccessible(true);
        m.invoke(svc);

        java.lang.reflect.Field f = FinnhubStreamService.class.getDeclaredField("ws");
        f.setAccessible(true);
        Object ws = f.get(svc);

        assertThat(ws).isNull();
    }
}
