package com.portfolio.demo_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;

@Data
@ConfigurationProperties(prefix = "app.marketdata.finnhub")
public class FinnhubProperties {
    private String wsUrl;
    private String token;
    private String apiBase = "https://finnhub.io/api/v1";
}