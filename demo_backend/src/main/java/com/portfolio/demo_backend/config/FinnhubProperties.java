package com.portfolio.demo_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;

/**
 * Strongly-typed configuration for Finnhub market data integration.
 *
 * Prefix: {@code app.marketdata.finnhub}
 *
 * Properties:
 * - {@code wsUrl}: WebSocket endpoint (for example wss://ws.finnhub.io)
 * - {@code token}: API token
 * - {@code apiBase}: REST base URL (default https://finnhub.io/api/v1)
 * - {@code enabled}: feature flag to enable or disable integration
 *
 * Used by services that publish/subscribe to real-time quotes and call Finnhub
 * REST.
 */
@Data
@ConfigurationProperties(prefix = "app.marketdata.finnhub")
public class FinnhubProperties {
    private String wsUrl;
    private String token;
    private String apiBase = "https://finnhub.io/api/v1";
    private boolean enabled = false;
}