package com.portfolio.demo_backend.marketdata.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PriceEvent(
        @NotBlank String type,
        @NotBlank String symbol,
        @NotNull Double price,
        Double percentChange,
        @NotNull Long ts) {
    public static PriceEvent price(String symbol, double price, Double percentChange) {
        return new PriceEvent("price", symbol, price, percentChange, System.currentTimeMillis());
    }

    public static PriceEvent heartbeat() {
        return new PriceEvent("heartbeat", "", 0.0, null, System.currentTimeMillis());
    }
}