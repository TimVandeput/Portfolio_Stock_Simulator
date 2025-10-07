package com.portfolio.demo_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;

/**
 * Strongly-typed configuration for Finnhub market data integration.
 * <p>
 * Binds properties with prefix {@code app.marketdata.finnhub} from
 * {@code application.properties} or environment variables.
 * Typical entries:
 * <ul>
 * <li>{@code app.marketdata.finnhub.wsUrl} – WebSocket endpoint (e.g.,
 * wss://ws.finnhub.io)</li>
 * <li>{@code app.marketdata.finnhub.token} – API token</li>
 * <li>{@code app.marketdata.finnhub.apiBase} – REST base URL (defaults to
 * https://finnhub.io/api/v1)</li>
 * <li>{@code app.marketdata.finnhub.enabled} – feature flag to enable/disable
 * integration</li>
 * </ul>
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