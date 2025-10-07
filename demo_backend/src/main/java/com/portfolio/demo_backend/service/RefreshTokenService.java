package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.config.JwtProperties;
import com.portfolio.demo_backend.model.RefreshToken;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

/**
 * Service managing refresh token lifecycle.
 * <p>
 * Responsibilities:
 * - Create, rotate, validate and revoke tokens backed by persistence
 * - Maintain the authenticated role for downstream access token issuance
 * <p>
 * Rotation policy:
 * - If a token has > 25% lifetime remaining, {@link #rotate(RefreshToken)} returns the same token.
 * - Otherwise, the old token is revoked and a new one is created (with the same authenticated role).
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;

    /**
     * Creates and persists a refresh token for the given user.
     *
     * @param user            the user
     * @param authenticatedAs role used when issuing access tokens from this refresh token
     * @return persisted refresh token
     */
    public RefreshToken create(User user, Role authenticatedAs) {
        String token = randomToken();
        Instant expires = Instant.now().plusMillis(jwtProperties.getRefreshExpiration());
        RefreshToken rt = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiresAt(expires)
                .revoked(false)
                .authenticatedAs(authenticatedAs)
                .build();
        return refreshTokenRepository.save(rt);
    }

    /**
     * Creates a refresh token with default role {@link Role#ROLE_USER}.
     *
     * @param user the user
     * @return persisted refresh token
     */
    public RefreshToken create(User user) {
        return create(user, Role.ROLE_USER);
    }

    /**
     * Rotates the supplied refresh token depending on remaining lifetime.
     * If remaining lifetime is greater than 25% of its total configured lifetime, the same token is returned.
     * Otherwise the old token is revoked and a new token is issued.
     *
     * @param old existing token (assumed to be valid and non-revoked)
     * @return the token to use going forward (new or same instance)
     */
    public RefreshToken rotate(RefreshToken old) {

        long timeUntilExpiry = old.getExpiresAt().toEpochMilli() - Instant.now().toEpochMilli();
        long totalLifetime = jwtProperties.getRefreshExpiration();
        double remainingPercentage = (double) timeUntilExpiry / totalLifetime;

        if (remainingPercentage > 0.25) {
            return old;
        }

        old.setRevoked(true);
        refreshTokenRepository.save(old);
        Role auth = old.getAuthenticatedAs();
        return create(old.getUser(), auth != null ? auth : Role.ROLE_USER);
    }

    /**
     * Updates the authenticated-as role stored with a refresh token.
     * No-op if the token cannot be found.
     *
     * @param token token string
     * @param role  role to store
     */
    public void setAuthenticatedAs(String token, Role role) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setAuthenticatedAs(role);
            refreshTokenRepository.save(rt);
        });
    }

    /**
     * Validates that the token exists, is not revoked and not expired.
     *
     * @param token the token string
     * @return the entity if valid
     * @throws IllegalArgumentException if invalid/expired/revoked
     */
    public RefreshToken validateUsable(String token) {
        RefreshToken rt = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        if (rt.isRevoked() || rt.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Expired or revoked refresh token");
        }
        return rt;
    }

    /**
     * Revokes the token if found. Idempotent.
     *
     * @param token token string
     */
    public void revoke(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    /**
     * Generates a URL-safe, base64-encoded 512-bit random token string without padding.
     *
     * @return new random token string
     */
    private static String randomToken() {
        byte[] bytes = new byte[64];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
