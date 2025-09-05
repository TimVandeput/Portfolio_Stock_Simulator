package com.portfolio.demo_backend.marketdata.integration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.demo_backend.config.RapidApiProperties;
import com.portfolio.demo_backend.marketdata.SymbolConstants;
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

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SymbolInfo {
        @JsonProperty("symbol")
        public String symbol;

        @JsonProperty("longName")
        public String name;

        @JsonProperty("exchange")
        public String exchange;

        @JsonProperty("currency")
        public String currency = "USD";

        public String mic;

        @JsonProperty("exchange")
        public void setExchange(String exchange) {
            this.exchange = exchange;
            if ("NASDAQ".equalsIgnoreCase(exchange) || "NMS".equalsIgnoreCase(exchange)) {
                this.mic = "XNAS";
            } else if ("NYSE".equalsIgnoreCase(exchange) || "NYQ".equalsIgnoreCase(exchange)) {
                this.mic = "XNYS";
            } else {
                this.mic = exchange;
            }
        }
    }

    public List<Quote> getQuotes(List<String> symbols) throws IOException {
        if (symbols == null || symbols.isEmpty()) {
            return List.of();
        }

        List<Quote> allQuotes = new ArrayList<>();

        for (int i = 0; i < symbols.size(); i += 10) {
            int endIndex = Math.min(i + 10, symbols.size());
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
                        log.warn("Rate limit hit, sleeping for 1 second...");
                        Thread.sleep(1000);
                        continue;
                    }
                    if (resp.code() == 401) {
                        throw new IOException("RapidAPI authentication failed - check key");
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

    public List<SymbolInfo> getTopSymbols(String universe, int limit) throws IOException {
        log.info("Fetching top {} symbols for universe: {}", limit, universe);

        List<String> coreSymbols = getCoreSymbolsForUniverse(universe);
        List<SymbolInfo> result = new ArrayList<>();

        for (int i = 0; i < Math.min(coreSymbols.size(), limit); i += 10) {
            int endIndex = Math.min(i + 10, Math.min(coreSymbols.size(), limit));
            List<String> batch = coreSymbols.subList(i, endIndex);

            List<SymbolInfo> batchInfo = getSymbolDetails(batch);
            result.addAll(batchInfo);

            if (result.size() >= limit) {
                break;
            }
        }

        log.info("Successfully fetched {} symbols for universe {} ",
                result.size(), universe);
        return result;
    }

    private List<String> getCoreSymbolsForUniverse(String universe) {
        if ("NDX".equalsIgnoreCase(universe) || "NASDAQ".equalsIgnoreCase(universe)) {
            return SymbolConstants.NASDAQ_CORE_SYMBOLS;
        } else {
            return SymbolConstants.SP500_CORE_SYMBOLS;
        }
    }

    private List<SymbolInfo> getSymbolDetails(List<String> symbols) throws IOException {
        if (symbols.isEmpty()) {
            return List.of();
        }

        String symbolsParam = String.join(",", symbols);
        String url = props.getBaseUrl() + "/market/v2/get-quotes?region=US&symbols=" + symbolsParam;

        Request req = new Request.Builder()
                .url(url)
                .addHeader("X-RapidAPI-Key", props.getKey())
                .addHeader("X-RapidAPI-Host", props.getHost())
                .build();

        try (Response resp = http.newCall(req).execute()) {
            if (!resp.isSuccessful()) {
                log.error("Symbol details API failed: {} - {}", resp.code(),
                        resp.body() != null ? resp.body().string() : "No response body");
                throw new IOException("Symbol details API failed: " + resp.code());
            }

            String body = resp.body().string();
            JsonNode root = mapper.readTree(body);

            log.info("Yahoo Finance API response for symbol details: {}", body);

            List<SymbolInfo> result = new ArrayList<>();

            if (root.has("quoteResponse") && root.get("quoteResponse").has("result")) {
                JsonNode results = root.get("quoteResponse").get("result");
                log.info("Processing {} results from Yahoo Finance API", results.size());

                for (JsonNode item : results) {
                    String symbol = item.path("symbol").asText();
                    String longName = item.path("longName").asText(null);
                    String shortName = item.path("shortName").asText(null);
                    String fullExchange = item.path("fullExchangeName").asText(null);
                    String exchange = item.path("exchange").asText(null);
                    String currency = item.path("currency").asText(null);

                    log.info("Symbol: {}, LongName: {}, ShortName: {}, FullExchange: {}, Exchange: {}, Currency: {}",
                            symbol, longName, shortName, fullExchange, exchange, currency);

                    if (symbol == null || symbol.isBlank() ||
                            (longName == null || longName.isBlank()) && (shortName == null || shortName.isBlank())) {
                        log.warn("Skipping symbol {} - missing symbol or name", symbol);
                        continue;
                    }

                    SymbolInfo symbolInfo = new SymbolInfo();
                    symbolInfo.symbol = symbol;
                    symbolInfo.name = longName != null && !longName.isBlank() ? longName : shortName;
                    symbolInfo.exchange = fullExchange != null && !fullExchange.isBlank() ? fullExchange
                            : exchange != null && !exchange.isBlank() ? exchange : "NASDAQ";
                    symbolInfo.currency = currency != null && !currency.isBlank() ? currency : "USD";

                    String exchangeLower = symbolInfo.exchange.toLowerCase();
                    if (exchangeLower.contains("nasdaq")) {
                        symbolInfo.mic = "XNAS";
                    } else if (exchangeLower.contains("nyse") || exchangeLower.contains("new york")) {
                        symbolInfo.mic = "XNYS";
                    } else {
                        symbolInfo.mic = "XNAS";
                    }

                    result.add(symbolInfo);
                    log.info("Added symbol: {} - {}", symbolInfo.symbol, symbolInfo.name);
                }
            } else {
                log.error("No quoteResponse or result found in API response. Full response: {}", body);
            }

            log.info("Successfully processed {} symbols from Yahoo Finance", result.size());
            return result;
        }
    }
}
