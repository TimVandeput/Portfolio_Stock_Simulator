package com.portfolio.demo_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.demo_backend.config.FinnhubProperties;
import com.portfolio.demo_backend.dto.QuoteDTO;
import com.portfolio.demo_backend.integration.finnhub.FinnhubQuoteRaw;
import com.portfolio.demo_backend.mapper.QuoteMapper;
import okhttp3.Call;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class QuoteService {

    private final FinnhubProperties props;
    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public QuoteService(FinnhubProperties props) {
        this.props = props;
    }

    public QuoteDTO getLastQuote(String symbol) throws IOException {
        String url = props.getApiBase() + "/quote?symbol=" + symbol + "&token=" + props.getToken();

        Request request = new Request.Builder().url(url).get().build();
        try (Response response = newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response.code() + " - " + response.message());
            }
            String body = response.body().string();
            FinnhubQuoteRaw raw = mapper.readValue(body, FinnhubQuoteRaw.class);
            return QuoteMapper.toDTO(raw);
        }
    }

    protected Call newCall(Request request) {
        return client.newCall(request);
    }
}
