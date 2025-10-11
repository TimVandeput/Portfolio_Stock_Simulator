package com.portfolio.demo_backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuration holder for RapidAPI-backed Yahoo Finance integration.
 *
 * Prefix: {@code app.rapidapi}
 *
 * Properties:
 * - {@code key}: RapidAPI key
 * - {@code host}: target API host (defaults may be defined in
 * application.properties)
 * - {@code baseUrl}: base URL for requests
 *
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
