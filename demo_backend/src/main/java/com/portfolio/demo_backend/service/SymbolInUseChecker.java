package com.portfolio.demo_backend.service;

import org.springframework.stereotype.Component;

@Component
public class SymbolInUseChecker {
    public boolean isInUse(String symbol) {
        return false;
    }
}
