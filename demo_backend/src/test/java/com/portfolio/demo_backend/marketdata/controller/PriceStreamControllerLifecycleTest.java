package com.portfolio.demo_backend.marketdata.controller;

import com.portfolio.demo_backend.marketdata.service.FinnhubStreamService;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class PriceStreamControllerLifecycleTest {

    @Test
    void heartbeat_and_price_present() throws Exception {
        FinnhubStreamService svc = mock(FinnhubStreamService.class);
        var ctrl = new PriceStreamController(svc);
        var mvc = MockMvcBuilders.standaloneSetup(ctrl).build();

        doAnswer(inv -> {
            String sym = inv.getArgument(0);
            FinnhubStreamService.PriceListener l = inv.getArgument(1);
            l.onPrice(sym, 123.45, 2.5);
            return null;
        }).when(svc).addListener(eq("AAPL"), any());

        MockHttpServletResponse res = mvc.perform(
                MockMvcRequestBuilders.get("/api/stream/prices")
                        .param("symbols", "AAPL")
                        .accept(MediaType.TEXT_EVENT_STREAM_VALUE))
                .andReturn().getResponse();

        String body = res.getContentAsString();
        assertThat(body).contains("event:heartbeat");
        assertThat(body).contains("event:price");
        assertThat(body).contains("\"symbol\":\"AAPL\"");
        assertThat(body).contains("\"price\":123.45");
    }

    @Test
    void caps_at_50() throws Exception {
        FinnhubStreamService svc = mock(FinnhubStreamService.class);
        var ctrl = new PriceStreamController(svc);
        var mvc = MockMvcBuilders.standaloneSetup(ctrl).build();

        String csv = IntStream.range(0, 55).mapToObj(i -> "S" + i).collect(Collectors.joining(","));

        mvc.perform(
                MockMvcRequestBuilders.get("/api/stream/prices")
                        .param("symbols", csv)
                        .accept(MediaType.TEXT_EVENT_STREAM_VALUE))
                .andReturn();

        verify(svc, times(50)).addListener(anyString(), any());
        verify(svc, atMost(50)).addListener(anyString(), any());
    }
}
