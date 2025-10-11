package com.portfolio.demo_backend.exception.symbol;

/**
 * Thrown when a symbol/ticker is not present in the system or allowed list.
 */
public class SymbolNotFoundException extends RuntimeException {
    public SymbolNotFoundException(String symbol) {
        super("Symbol not found: " + symbol);
    }
}
