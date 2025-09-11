package com.portfolio.demo_backend.marketdata.integration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.demo_backend.config.FinnhubProperties;
import com.portfolio.demo_backend.exception.marketdata.ApiRateLimitException;
import com.portfolio.demo_backend.exception.marketdata.MarketDataUnavailableException;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FinnhubClient {

    private final FinnhubProperties props;
    private final OkHttpClient http = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ConstituentsResponse {
        public List<String> constituents;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SymbolItem {
        public String symbol;
        public String description;
        public String currency;
        public String mic;
        public String type;
    }

    public List<String> getIndexConstituents(String indexSymbol) throws IOException {
        HttpUrl url = HttpUrl.parse(props.getApiBase() + "/index/constituents")
                .newBuilder()
                .addQueryParameter("symbol", indexSymbol)
                .addQueryParameter("token", props.getToken())
                .build();
        Request req = new Request.Builder().url(url).get().build();
        try (Response resp = http.newCall(req).execute()) {
            if (!resp.isSuccessful()) {
                if (resp.code() == 429) {
                    throw new ApiRateLimitException("Finnhub");
                } else if (resp.code() >= 500) {
                    throw new MarketDataUnavailableException("Finnhub", "Server error: " + resp.code());
                } else {
                    throw new IOException("Finnhub constituents " + resp.code());
                }
            }
            ConstituentsResponse cr = mapper.readValue(resp.body().string(), ConstituentsResponse.class);
            return cr.constituents != null ? cr.constituents : List.of();
        }
    }

    public List<SymbolItem> listSymbolsByExchange(String exchange) throws IOException {
        HttpUrl url = HttpUrl.parse(props.getApiBase() + "/stock/symbol")
                .newBuilder()
                .addQueryParameter("exchange", exchange)
                .addQueryParameter("token", props.getToken())
                .build();
        Request req = new Request.Builder().url(url).get().build();
        try (Response resp = http.newCall(req).execute()) {
            if (!resp.isSuccessful()) {
                if (resp.code() == 429) {
                    throw new ApiRateLimitException("Finnhub");
                } else if (resp.code() >= 500) {
                    throw new MarketDataUnavailableException("Finnhub", "Server error: " + resp.code());
                } else {
                    throw new IOException("Finnhub stock/symbol " + resp.code());
                }
            }
            SymbolItem[] arr = mapper.readValue(resp.body().string(), SymbolItem[].class);
            return arr != null ? List.of(arr) : List.of();
        }
    }

    public <T> T throttled(CallSupplier<T> supplier) throws IOException {
        try {
            Thread.sleep(1600L);
        } catch (InterruptedException ignored) {
        }
        return supplier.get();
    }

    @FunctionalInterface
    public interface CallSupplier<T> {
        T get() throws IOException;
    }
}
