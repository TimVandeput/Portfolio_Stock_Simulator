package com.portfolio.demo_backend.exception.trading;

public class SymbolNotFoundException extends RuntimeException {
    public SymbolNotFoundException(String symbol) {
        super("Symbol not found: " + symbol);
    }
}
