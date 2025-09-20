package com.portfolio.demo_backend.exception.trading;

public class InsufficientSharesException extends RuntimeException {
    public InsufficientSharesException(String symbol, int available, int requested) {
        super(String.format("Insufficient shares for symbol '%s'. Available: %d, Requested: %d", 
              symbol, available, requested));
    }
}
