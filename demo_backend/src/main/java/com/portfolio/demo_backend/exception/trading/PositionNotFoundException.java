package com.portfolio.demo_backend.exception.trading;

/**
 * Raised when an expected holding/position for a symbol does not exist.
 */
public class PositionNotFoundException extends RuntimeException {
    public PositionNotFoundException(String symbol) {
        super("No position found for symbol: " + symbol);
    }
}
