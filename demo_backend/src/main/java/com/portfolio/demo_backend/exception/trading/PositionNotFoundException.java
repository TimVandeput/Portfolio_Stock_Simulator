package com.portfolio.demo_backend.exception.trading;

public class PositionNotFoundException extends RuntimeException {
    public PositionNotFoundException(String symbol) {
        super("No position found for symbol: " + symbol);
    }
}
