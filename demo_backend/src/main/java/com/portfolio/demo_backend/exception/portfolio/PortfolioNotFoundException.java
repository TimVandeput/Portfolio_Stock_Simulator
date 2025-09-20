package com.portfolio.demo_backend.exception.portfolio;

public class PortfolioNotFoundException extends RuntimeException {
    public PortfolioNotFoundException(Long userId) {
        super("Portfolio not found for user ID: " + userId);
    }

    public PortfolioNotFoundException(Long userId, String symbol) {
        super("Portfolio holding not found for user ID: " + userId + " and symbol: " + symbol);
    }
}
