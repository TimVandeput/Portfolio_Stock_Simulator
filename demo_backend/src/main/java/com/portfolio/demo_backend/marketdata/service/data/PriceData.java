package com.portfolio.demo_backend.marketdata.service.data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PriceData(
        @NotBlank String symbol,
        @NotNull Double price,
        Double change,
        Double changePercent,
        Double previousClose,
        Double dayHigh,
        Double dayLow,
        String currency,
        @NotNull Long timestamp) {
    public static PriceData of(String symbol, Double price, Double change, Double changePercent,
            Double previousClose, Double dayHigh, Double dayLow) {
        return new PriceData(symbol, price, change, changePercent, previousClose, dayHigh, dayLow, "USD",
                System.currentTimeMillis());
    }
}
