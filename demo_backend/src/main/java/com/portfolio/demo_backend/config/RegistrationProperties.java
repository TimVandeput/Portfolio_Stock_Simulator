package com.portfolio.demo_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;

@Data
@ConfigurationProperties(prefix = "app.reg")
public class RegistrationProperties {
    private String passcode;
}
