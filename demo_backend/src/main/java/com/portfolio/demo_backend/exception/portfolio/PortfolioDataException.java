package com.portfolio.demo_backend.exception.portfolio;

public class PortfolioDataException extends RuntimeException {
    public PortfolioDataException(String message) {
        super("Portfolio data error: " + message);
    }

    public PortfolioDataException(String message, Throwable cause) {
        super("Portfolio data error: " + message, cause);
    }
}
