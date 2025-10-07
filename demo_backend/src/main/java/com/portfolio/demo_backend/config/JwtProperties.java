package com.portfolio.demo_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Data;

/**
 * JWT configuration bound from properties with prefix {@code jwt}.
 * <p>
 * Typical entries:
 * <ul>
 * <li>{@code jwt.secret} – HMAC secret used to sign tokens</li>
 * <li>{@code jwt.expiration} – access token validity in milliseconds</li>
 * <li>{@code jwt.refresh-expiration} – refresh token validity in
 * milliseconds</li>
 * </ul>
 * Consumed by the security layer to mint and validate JWTs.
 */
@Data
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
    private long expiration;
    private long refreshExpiration;
}