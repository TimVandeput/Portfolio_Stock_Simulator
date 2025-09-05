package com.portfolio.demo_backend.marketdata.service;

import org.springframework.stereotype.Component;

@Component
public class SymbolInUseChecker {
    public boolean isInUse(String symbol) {
        return false;
    }
}
