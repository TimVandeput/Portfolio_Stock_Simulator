package com.portfolio.demo_backend.exception.marketdata;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Indicates the market data provider is temporarily unavailable or an IO error occurred.
 */
@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class MarketDataUnavailableException extends RuntimeException {
    private final String provider;

    public MarketDataUnavailableException(String provider) {
        super("Market data temporarily unavailable from " + provider);
        this.provider = provider;
    }

    public MarketDataUnavailableException(String provider, String message) {
        super(message);
        this.provider = provider;
    }

    public MarketDataUnavailableException(String provider, Throwable cause) {
        super("Market data temporarily unavailable from " + provider, cause);
        this.provider = provider;
    }

    public String getProvider() {
        return provider;
    }
}
