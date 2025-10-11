package com.portfolio.demo_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;

/**
 * JWT configuration bound from properties with prefix {@code jwt}.
 *
 * Properties:
 * - {@code jwt.secret}: HMAC secret used to sign tokens
 * - {@code jwt.expiration}: access token validity in milliseconds
 * - {@code jwt.refresh-expiration}: refresh token validity in milliseconds
 *
 * Consumed by the security layer to mint and validate JWTs.
 */
@Data
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
    private long expiration;
    private long refreshExpiration;
}