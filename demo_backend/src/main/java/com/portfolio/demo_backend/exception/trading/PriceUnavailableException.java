package com.portfolio.demo_backend.exception.trading;

public class PriceUnavailableException extends RuntimeException {
    public PriceUnavailableException(String symbol) {
        super("Price unavailable for symbol: " + symbol);
    }

    public PriceUnavailableException(String symbol, Throwable cause) {
        super("Unable to get current price for symbol: " + symbol, cause);
    }
}
