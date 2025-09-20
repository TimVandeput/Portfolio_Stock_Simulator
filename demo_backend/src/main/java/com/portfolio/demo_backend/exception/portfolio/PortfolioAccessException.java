package com.portfolio.demo_backend.exception.portfolio;

public class PortfolioAccessException extends RuntimeException {
    public PortfolioAccessException(Long userId, String message) {
        super("Portfolio access denied for user ID: " + userId + ". " + message);
    }

    public PortfolioAccessException(String message) {
        super("Portfolio access denied: " + message);
    }
}
