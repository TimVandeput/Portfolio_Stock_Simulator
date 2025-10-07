package com.portfolio.demo_backend.exception.portfolio;

/**
 * Generic portfolio aggregation/lookup error wrapper for unexpected conditions
 * encountered while building portfolio views.
 */
public class PortfolioDataException extends RuntimeException {
    public PortfolioDataException(String message) {
        super("Portfolio data error: " + message);
    }

    public PortfolioDataException(String message, Throwable cause) {
        super("Portfolio data error: " + message, cause);
    }
}
