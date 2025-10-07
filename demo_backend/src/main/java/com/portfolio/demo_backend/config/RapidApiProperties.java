package com.portfolio.demo_backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration holder for RapidAPI-backed Yahoo Finance integration.
 * <p>
 * Binds {@code app.rapidapi.*} properties:
 * <ul>
 * <li>{@code app.rapidapi.key} – RapidAPI key</li>
 * <li>{@code app.rapidapi.host} – target API host (defaults set in
 * application.properties)</li>
 * <li>{@code app.rapidapi.base-url} – base URL for requests</li>
 * </ul>
 * Inject into HTTP clients to sign and route outbound requests.
 */
@Data
@Component
@ConfigurationProperties(prefix = "app.rapidapi")
public class RapidApiProperties {
    private String key;
    private String host;
    private String baseUrl;
}
