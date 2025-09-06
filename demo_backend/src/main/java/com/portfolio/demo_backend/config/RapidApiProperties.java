package com.portfolio.demo_backend.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.rapidapi")
public class RapidApiProperties {
    private String key;
    private String host;
    private String baseUrl;
}
