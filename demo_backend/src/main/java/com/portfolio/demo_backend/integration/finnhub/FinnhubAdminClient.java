package com.portfolio.demo_backend.integration.finnhub;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.demo_backend.config.FinnhubProperties;
import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class FinnhubAdminClient {

    private final FinnhubProperties props;
    private final OkHttpClient http = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ConstituentsResponse {
        public List<String> constituents;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Profile2 {
        public String name;
        public String exchange;
        public String ticker;
        public String currency;
        public String mic;
    }

    public List<String> getIndexConstituents(String indexSymbol) throws IOException {
        HttpUrl url = HttpUrl.parse(props.getApiBase() + "/index/constituents")
                .newBuilder()
                .addQueryParameter("symbol", indexSymbol)
                .addQueryParameter("token", props.getToken())
                .build();
        Request req = new Request.Builder().url(url).get().build();
        try (Response resp = http.newCall(req).execute()) {
            if (!resp.isSuccessful())
                throw new IOException("Finnhub constituents " + resp.code());
            ConstituentsResponse cr = mapper.readValue(resp.body().string(), ConstituentsResponse.class);
            return cr.constituents != null ? cr.constituents : List.of();
        }
    }

    public Profile2 getProfile2(String ticker) throws IOException {
        HttpUrl url = HttpUrl.parse(props.getApiBase() + "/stock/profile2")
                .newBuilder()
                .addQueryParameter("symbol", ticker)
                .addQueryParameter("token", props.getToken())
                .build();
        Request req = new Request.Builder().url(url).get().build();
        try (Response resp = http.newCall(req).execute()) {
            if (!resp.isSuccessful())
                throw new IOException("Finnhub profile2 " + resp.code());
            return mapper.readValue(resp.body().string(), Profile2.class);
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
