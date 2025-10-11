package com.portfolio.demo_backend.marketdata.service.data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

/**
 * Time-series chart payload holding raw provider response plus normalized axis
 * arrays when available.
 */
public record ChartData(
        @NotBlank String symbol,
        @NotBlank String range,
        @NotBlank String interval,
        @NotNull Map<String, Object> chartResponse,
        List<String> timestamps,
        List<Double> prices) {
    public static ChartData of(String symbol, String range, String interval, Map<String, Object> chartResponse) {
        return new ChartData(symbol, range, interval, chartResponse, null, null);
    }
}
