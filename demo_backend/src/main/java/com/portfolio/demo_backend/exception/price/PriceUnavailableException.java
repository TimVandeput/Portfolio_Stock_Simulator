package com.portfolio.demo_backend.exception.price;

/**
 * Indicates that the current price for the requested symbol could not be
 * retrieved from the upstream provider.
 */
public class PriceUnavailableException extends RuntimeException {
    public PriceUnavailableException(String symbol) {
        super("Price unavailable for symbol: " + symbol);
    }

    public PriceUnavailableException(String symbol, Throwable cause) {
        super("Unable to get current price for symbol: " + symbol, cause);
    }
}
