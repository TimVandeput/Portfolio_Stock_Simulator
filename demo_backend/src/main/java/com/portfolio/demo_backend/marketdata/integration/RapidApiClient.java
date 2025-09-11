package com.portfolio.demo_backend.marketdata.integration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.demo_backend.config.RapidApiProperties;
import com.portfolio.demo_backend.exception.marketdata.ApiRateLimitException;
import com.portfolio.demo_backend.exception.marketdata.MarketDataUnavailableException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Component
@Slf4j
@RequiredArgsConstructor
public class RapidApiClient {

    private final RapidApiProperties props;
    private final OkHttpClient http = new OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .writeTimeout(10, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();
    private final ObjectMapper mapper = new ObjectMapper();

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Quote {
        @JsonProperty("symbol")
        public String symbol;

        @JsonProperty("regularMarketPrice")
        public Double price;

        @JsonProperty("regularMarketChange")
        public Double change;

        @JsonProperty("regularMarketChangePercent")
        public Double changePercent;

        @JsonProperty("regularMarketDayHigh")
        public Double dayHigh;

        @JsonProperty("regularMarketDayLow")
        public Double dayLow;

        @JsonProperty("regularMarketOpen")
        public Double openPrice;

        @JsonProperty("regularMarketPreviousClose")
        public Double previousClose;
    }

    public List<Quote> getQuotes(List<String> symbols) throws IOException {
        if (symbols == null || symbols.isEmpty()) {
            return List.of();
        }

        List<Quote> allQuotes = new ArrayList<>();

        for (int i = 0; i < symbols.size(); i += 50) {
            int endIndex = Math.min(i + 50, symbols.size());
            List<String> batch = symbols.subList(i, endIndex);
            String symbolsParam = String.join(",", batch);

            String url = props.getBaseUrl() + "/market/v2/get-quotes?region=US&symbols=" + symbolsParam;

            Request req = new Request.Builder()
                    .url(url)
                    .header("x-rapidapi-key", props.getKey())
                    .header("x-rapidapi-host", props.getHost())
                    .header("User-Agent", "Portfolio-Backend/1.0")
                    .build();

            try (Response resp = http.newCall(req).execute()) {
                if (!resp.isSuccessful()) {
                    String responseBody = resp.body() != null ? resp.body().string() : "No response body";
                    log.error("RapidAPI request failed for symbols {}: {} - {}", symbolsParam, resp.code(),
                            responseBody);

                    if (resp.code() == 403) {
                        throw new IOException(
                                "RapidAPI authentication/authorization failed - 403 Forbidden. Check your subscription.");
                    }
                    if (resp.code() == 429) {
                        throw new ApiRateLimitException("RapidAPI Yahoo Finance");
                    }
                    if (resp.code() == 401) {
                        throw new IOException("RapidAPI authentication failed - check key");
                    }
                    if (resp.code() >= 500) {
                        throw new MarketDataUnavailableException("RapidAPI Yahoo Finance",
                                "Server error: " + resp.code());
                    }

                    throw new IOException("RapidAPI request failed: " + resp.code());
                }

                String responseBody = resp.body().string();
                log.debug("RapidAPI response for {}: {}", symbolsParam, responseBody);

                var response = mapper.readTree(responseBody);
                var quoteResponse = response.get("quoteResponse");
                var results = quoteResponse.get("result");

                if (results != null && results.isArray()) {
                    for (var result : results) {
                        Quote quote = new Quote();
                        quote.symbol = result.has("symbol") ? result.get("symbol").asText() : null;
                        quote.price = result.has("regularMarketPrice") ? result.get("regularMarketPrice").asDouble()
                                : null;
                        quote.change = result.has("regularMarketChange") ? result.get("regularMarketChange").asDouble()
                                : null;
                        quote.changePercent = result.has("regularMarketChangePercent")
                                ? result.get("regularMarketChangePercent").asDouble()
                                : null;
                        quote.dayHigh = result.has("regularMarketDayHigh")
                                ? result.get("regularMarketDayHigh").asDouble()
                                : null;
                        quote.dayLow = result.has("regularMarketDayLow") ? result.get("regularMarketDayLow").asDouble()
                                : null;
                        quote.openPrice = result.has("regularMarketOpen") ? result.get("regularMarketOpen").asDouble()
                                : null;
                        quote.previousClose = result.has("regularMarketPreviousClose")
                                ? result.get("regularMarketPreviousClose").asDouble()
                                : null;

                        if (quote.symbol != null && quote.price != null && quote.price > 0) {
                            allQuotes.add(quote);
                            log.debug("Successfully parsed quote for {}: ${}", quote.symbol, quote.price);
                        }
                    }
                }

                Thread.sleep(250);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } catch (ApiRateLimitException | MarketDataUnavailableException e) {
                throw e;
            } catch (Exception e) {
                log.error("Error fetching quotes for batch {}: {}", symbolsParam, e.getMessage(), e);
                throw new IOException("Failed to fetch quotes: " + e.getMessage(), e);
            }
        }

        log.info("Successfully fetched {} quotes from RapidAPI out of {} requested", allQuotes.size(), symbols.size());
        return allQuotes;
    }

    public Quote getQuote(String symbol) throws IOException {
        List<Quote> quotes = getQuotes(List.of(symbol));
        return quotes.isEmpty() ? null : quotes.get(0);
    }
}
