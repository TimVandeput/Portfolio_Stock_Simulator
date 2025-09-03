package com.portfolio.demo_backend.marketdata.controller;

import com.portfolio.demo_backend.marketdata.service.FinnhubStreamService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class PriceStreamControllerTest {

    @Test
    void connects_andSendsHeartbeat_thenPrice() throws Exception {
        FinnhubStreamService service = mock(FinnhubStreamService.class);
        PriceStreamController ctrl = new PriceStreamController(service);
        var mockMvc = MockMvcBuilders.standaloneSetup(ctrl).build();

        ArgumentCaptor<FinnhubStreamService.PriceListener> listenerCaptor = ArgumentCaptor
                .forClass(FinnhubStreamService.PriceListener.class);

        doNothing().when(service).addListener(eq("AAPL"), listenerCaptor.capture());

        MockHttpServletResponse resp = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/stream/prices")
                        .param("symbols", "AAPL")
                        .accept(MediaType.TEXT_EVENT_STREAM_VALUE))
                .andReturn().getResponse();

        String body = resp.getContentAsString();
        assertThat(body).contains("event:heartbeat");

        verify(service, times(1)).addListener(eq("AAPL"), any());
        FinnhubStreamService.PriceListener l = listenerCaptor.getValue();
        assertThat(l).isNotNull();

        l.onPrice("AAPL", 123.45);

        assertThat(resp.getContentType()).isEqualTo(MediaType.TEXT_EVENT_STREAM_VALUE);
    }

    @Test
    void capsAt50Symbols_insteadOfRejecting() throws Exception {
        FinnhubStreamService service = mock(FinnhubStreamService.class);
        PriceStreamController ctrl = new PriceStreamController(service);
        var mockMvc = MockMvcBuilders.standaloneSetup(ctrl).build();

        String tooMany = IntStream.range(0, 55).mapToObj(i -> "SYM" + i).collect(Collectors.joining(","));

        var res = mockMvc.perform(
                MockMvcRequestBuilders.get("/api/stream/prices")
                        .param("symbols", tooMany)
                        .accept(MediaType.TEXT_EVENT_STREAM_VALUE))
                .andReturn().getResponse();

        assertThat(res.getStatus()).isEqualTo(200);

        verify(service, times(50)).addListener(any(), any());
    }
}
