package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.RefreshToken;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.repository.RefreshTokenRepository;
import com.portfolio.demo_backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;

/**
 * Integration tests for {@link RefreshTokenService} verifying repository state
 * changes.
 */
@SpringBootTest
@ActiveProfiles("test")
class RefreshTokenServiceIntegrationTest {

    @Autowired
    RefreshTokenService refreshTokenService;
    @Autowired
    RefreshTokenRepository refreshTokenRepository;
    @Autowired
    UserRepository userRepository;

    private User seedUser() {
        User u = User.builder()
                .username("rachel")
                .email("rachel@example.com")
                .password("$2a$10$hash")
                .roles(new HashSet<>(Set.of(Role.ROLE_USER)))
                .build();
        return userRepository.save(u);
    }

    /**
     * Given a persisted user
     * When creating, validating, and rotating tokens
     * Then tokens are persisted with expected flags and validation works across
     * rotations
     */
    @Test
    void create_and_validate_and_rotate_flow() {
        User u = seedUser();

        // When: creating token
        RefreshToken t1 = refreshTokenService.create(u);
        // Then: token persisted and active
        assertThat(t1.getId()).isNotNull();
        assertThat(t1.isRevoked()).isFalse();
        assertThat(t1.getExpiresAt()).isAfter(Instant.now());

        // When: validating existing token
        RefreshToken validated = refreshTokenService.validateUsable(t1.getToken());
        assertThat(validated.getId()).isEqualTo(t1.getId());

        // When: rotating token without expiry
        RefreshToken t2 = refreshTokenService.rotate(t1);
        assertThat(t2.getToken()).isEqualTo(t1.getToken());
        assertThat(refreshTokenRepository.findByToken(t1.getToken()))
                .get()
                .extracting(RefreshToken::isRevoked)
                .isEqualTo(false);

        // Then: still usable after rotation
        assertThat(refreshTokenService.validateUsable(t2.getToken())).isNotNull();

        Instant nearExpiry = Instant.now().plusMillis(60000);
        t1.setExpiresAt(nearExpiry);
        refreshTokenRepository.save(t1);

        // When: rotating near-expiry token
        RefreshToken t3 = refreshTokenService.rotate(t1);
        // Then: old token revoked and new token usable
        assertThat(t3.getToken()).isNotEqualTo(t1.getToken());
        assertThat(refreshTokenRepository.findByToken(t1.getToken()))
                .get()
                .extracting(RefreshToken::isRevoked)
                .isEqualTo(true);

        assertThat(refreshTokenService.validateUsable(t3.getToken())).isNotNull();
    }
}
