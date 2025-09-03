package com.portfolio.demo_backend.marketdata.dto;

public record PriceEvent(String type, String symbol, double price, long ts) {
    public static PriceEvent price(String symbol, double price) {
        return new PriceEvent("price", symbol, price, System.currentTimeMillis());
    }

    public static PriceEvent heartbeat() {
        return new PriceEvent("heartbeat", "", 0.0, System.currentTimeMillis());
    }
}
