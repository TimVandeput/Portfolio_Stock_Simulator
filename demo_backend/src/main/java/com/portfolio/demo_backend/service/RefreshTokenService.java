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

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtProperties jwtProperties;

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

    public RefreshToken create(User user) {
        return create(user, Role.ROLE_USER);
    }

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

    public void setAuthenticatedAs(String token, Role role) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setAuthenticatedAs(role);
            refreshTokenRepository.save(rt);
        });
    }

    public RefreshToken validateUsable(String token) {
        RefreshToken rt = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
        if (rt.isRevoked() || rt.getExpiresAt().isBefore(Instant.now())) {
            throw new IllegalArgumentException("Expired or revoked refresh token");
        }
        return rt;
    }

    public void revoke(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    private static String randomToken() {
        byte[] bytes = new byte[64];
        new SecureRandom().nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
