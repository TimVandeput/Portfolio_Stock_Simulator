package com.portfolio.demo_backend.marketdata.dto;

public record PriceEvent(String type, String symbol, double price, Double percentChange, long ts) {
    public static PriceEvent price(String symbol, double price, Double percentChange) {
        return new PriceEvent("price", symbol, price, percentChange, System.currentTimeMillis());
    }

    public static PriceEvent heartbeat() {
        return new PriceEvent("heartbeat", "", 0.0, null, System.currentTimeMillis());
    }
}