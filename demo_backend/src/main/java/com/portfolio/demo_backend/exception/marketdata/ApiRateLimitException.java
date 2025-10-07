package com.portfolio.demo_backend.exception.marketdata;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Thrown when a market data provider rejects requests due to rate limiting (HTTP 429).
 */
@ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
public class ApiRateLimitException extends RuntimeException {
    private final String provider;

    public ApiRateLimitException(String provider) {
        super("Rate limit exceeded for " + provider + " API");
        this.provider = provider;
    }

    public ApiRateLimitException(String provider, String message) {
        super(message);
        this.provider = provider;
    }

    public String getProvider() {
        return provider;
    }
}
