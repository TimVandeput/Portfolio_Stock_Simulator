package com.portfolio.demo_backend.exception.symbol;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class SymbolInUseException extends RuntimeException {
    private final String symbol;

    public SymbolInUseException(String symbol) {
        super("Cannot disable; users hold positions or have open orders.");
        this.symbol = symbol;
    }

    public String getSymbol() {
        return symbol;
    }
}
