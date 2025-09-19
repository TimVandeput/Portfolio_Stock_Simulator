package com.portfolio.demo_backend.exception.symbol;

public class SymbolNotFoundException extends RuntimeException {
    public SymbolNotFoundException(String symbol) {
        super("Symbol not found: " + symbol);
    }
}
