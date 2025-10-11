package com.portfolio.demo_backend.exception.trading;

/**
 * Thrown when a sell operation requests more shares than the user currently
 * holds for the given symbol.
 */
public class InsufficientSharesException extends RuntimeException {
    public InsufficientSharesException(String symbol, int available, int requested) {
        super(String.format("Insufficient shares for symbol '%s'. Available: %d, Requested: %d",
                symbol, available, requested));
    }
}
