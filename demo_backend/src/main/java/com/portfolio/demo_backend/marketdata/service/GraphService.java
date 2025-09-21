package com.portfolio.demo_backend.marketdata.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.portfolio.demo_backend.config.RapidApiProperties;
import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class GraphService {

    private final PortfolioRepository portfolioRepository;
    private final RapidApiProperties rapidApiProperties;
    private final OkHttpClient http = new OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .writeTimeout(10, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build();
    private final ObjectMapper mapper = new ObjectMapper();

    public List<Map<String, Object>> getCharts(Long userId, String range) {
        log.info("Getting chart data for user portfolio: userId={}, range={}", userId, range);

        List<Portfolio> portfolios = portfolioRepository.findActivePositionsByUserId(userId);

        if (portfolios.isEmpty()) {
            log.info("No active positions found for user {}", userId);
            return new ArrayList<>();
        }

        List<String> symbols = portfolios.stream()
                .map(portfolio -> portfolio.getSymbol().getSymbol())
                .distinct()
                .toList();

        log.info("Found {} unique symbols for user {} with range {}: {}", symbols.size(), userId, range, symbols);

        List<Map<String, Object>> allCharts = new ArrayList<>();

        for (String symbol : symbols) {
            try {
                Map<String, Object> chartData = getChartForSymbol(symbol, range);
                if (chartData != null) {
                    allCharts.add(chartData);
                    log.debug("Successfully fetched chart data for symbol: {} with range: {}", symbol, range);
                } else {
                    log.warn("No chart data returned for symbol: {} with range: {}", symbol, range);
                }
            } catch (Exception e) {
                log.error("Failed to fetch chart data for symbol {} with range {}: {}", symbol, range, e.getMessage(),
                        e);
            }
        }

        log.info("Successfully retrieved chart data for {} out of {} symbols for user {} with range {}",
                allCharts.size(), symbols.size(), userId, range);

        return allCharts;
    }

    private Map<String, Object> getChartForSymbol(String symbol, String range) throws IOException {
        log.debug("Fetching chart data for symbol: {} with range: {}", symbol, range);

        String interval = getIntervalForRange(range);

        String url = rapidApiProperties.getBaseUrl() + "/stock/v3/get-chart?interval=" + interval + "&symbol=" + symbol
                + "&range=" + range
                + "&region=US&includePrePost=false&useYfid=true&includeAdjustedClose=true&events=capitalGain%2Cdiv%2Csplit";

        Request request = new Request.Builder()
                .url(url)
                .header("x-rapidapi-key", rapidApiProperties.getKey())
                .header("x-rapidapi-host", rapidApiProperties.getHost())
                .header("User-Agent", "Portfolio-Backend/1.0")
                .build();

        try (Response response = http.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String responseBody = response.body() != null ? response.body().string() : "No response body";
                log.error("RapidAPI chart request failed for symbol {} with range {}: {} - {}", symbol, range,
                        response.code(),
                        responseBody);

                if (response.code() == 403) {
                    throw new IOException(
                            "RapidAPI authentication/authorization failed - 403 Forbidden. Check your subscription.");
                }
                if (response.code() == 429) {
                    throw new IOException("Rate limit exceeded");
                }
                if (response.code() == 401) {
                    throw new IOException("RapidAPI authentication failed - check key");
                }
                if (response.code() >= 500) {
                    throw new IOException("Server error: " + response.code());
                }

                throw new IOException("RapidAPI chart request failed: " + response.code());
            }

            String responseBody = response.body().string();
            log.debug("RapidAPI chart response for symbol {} with range {}: {}", symbol, range,
                    responseBody.substring(0, Math.min(200, responseBody.length())) + "...");

            @SuppressWarnings("unchecked")
            Map<String, Object> chartData = mapper.readValue(responseBody, Map.class);

            chartData.put("symbol", symbol);

            return chartData;
        }
    }

    private String getIntervalForRange(String range) {
        return switch (range) {
            case "1mo" -> "1d";
            case "2y", "5y" -> "1wk";
            default -> "1d";
        };
    }
}