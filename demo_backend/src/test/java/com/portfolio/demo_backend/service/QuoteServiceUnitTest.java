package com.portfolio.demo_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.demo_backend.config.FinnhubProperties;
import com.portfolio.demo_backend.dto.QuoteDTO;
import com.portfolio.demo_backend.marketdata.dto.FinnhubQuoteRaw;

import okhttp3.Call;
import okhttp3.MediaType;
import okhttp3.Protocol;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuoteServiceUnitTest {

    @Mock
    FinnhubProperties props;

    @InjectMocks
    QuoteService quoteService;

    @Test
    void getLastQuote_parsesAndMaps() throws Exception {
        when(props.getToken()).thenReturn("TESTTOKEN");
        when(props.getApiBase()).thenReturn("http://test");

        QuoteService svc = Mockito.spy(new QuoteService(props));

        FinnhubQuoteRaw raw = new FinnhubQuoteRaw();
        raw.setC(123.45);
        raw.setD(1.0);
        raw.setDp(0.8);
        raw.setH(130.0);
        raw.setL(120.0);
        raw.setO(122.0);
        raw.setPc(122.5);
        raw.setT(1617187200L);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(raw);

        Call call = mock(Call.class);
        okhttp3.Response resp = new Response.Builder()
                .request(new Request.Builder().url("http://test").build())
                .protocol(Protocol.HTTP_1_1)
                .code(200)
                .message("OK")
                .body(ResponseBody.create(json, MediaType.get("application/json")))
                .build();

        doReturn(call).when(svc).newCall(any());
        when(call.execute()).thenReturn(resp);

        QuoteDTO q = svc.getLastQuote("AAPL");

        assertThat(q).isNotNull();
        assertThat(q.getCurrent()).isEqualTo(123.45);
        assertThat(q.getHigh()).isEqualTo(130.0);
        assertThat(q.getLow()).isEqualTo(120.0);
    }
}
