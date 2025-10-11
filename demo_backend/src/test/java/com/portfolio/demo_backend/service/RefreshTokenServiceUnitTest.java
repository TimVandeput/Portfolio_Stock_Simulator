package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.config.JwtProperties;
import com.portfolio.demo_backend.model.RefreshToken;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Instant;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link RefreshTokenService} validating token lifecycle.
 *
 * Contains class/method Javadoc and inline Given/When/Then comments for
 * readability.
 */
class RefreshTokenServiceUnitTest {

    private RefreshTokenRepository repo;
    private RefreshTokenService service;

    /**
     * Given a fresh service instance with configured expiration for each test.
     */
    @BeforeEach
    void setUp() {
        repo = mock(RefreshTokenRepository.class);
        JwtProperties jwtProperties = new JwtProperties();
        jwtProperties.setRefreshExpiration(604800000L);
        service = new RefreshTokenService(repo, jwtProperties);
    }

    private static User user() {
        return User.builder()
                .id(1L)
                .username("tim")
                .password("$2a$10$hash")
                .roles(new HashSet<>(Set.of(Role.ROLE_USER)))
                .build();
    }

    /**
     * Given a user
     * When create is invoked
     * Then a non-revoked token with future expiration is persisted and returned
     */
    @Test
    void create_persists_with_future_exp_and_notRevoked() {
        User u = user();

        ArgumentCaptor<RefreshToken> cap = ArgumentCaptor.forClass(RefreshToken.class);
        when(repo.save(cap.capture())).thenAnswer(inv -> inv.getArgument(0));

        // When
        RefreshToken rt = service.create(u);

        // Then
        assertThat(rt.getToken()).isNotBlank();
        assertThat(rt.getUser()).isEqualTo(u);
        assertThat(rt.isRevoked()).isFalse();
        assertThat(rt.getExpiresAt()).isAfter(Instant.now());

        verify(repo).save(any(RefreshToken.class));
        assertThat(cap.getValue().getToken()).isEqualTo(rt.getToken());
    }

    /**
     * Given an active, unexpired token exists
     * When validateUsable is invoked
     * Then the same token is returned
     */
    @Test
    void validateUsable_ok_when_active_and_notExpired() {
        RefreshToken stored = RefreshToken.builder()
                .token("tok")
                .user(user())
                .revoked(false)
                .expiresAt(Instant.now().plusSeconds(60))
                .build();

        when(repo.findByToken("tok")).thenReturn(Optional.of(stored));

        // When
        RefreshToken out = service.validateUsable("tok");
        // Then
        assertThat(out).isSameAs(stored);
    }

    /**
     * Given tokens that are missing, revoked, or expired
     * When validateUsable is called
     * Then an IllegalArgumentException is thrown for each case
     */
    @Test
    void validateUsable_throws_for_missing_or_revoked_or_expired() {
        when(repo.findByToken("missing")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.validateUsable("missing"))
                .isInstanceOf(IllegalArgumentException.class);

        RefreshToken revoked = RefreshToken.builder()
                .token("rev")
                .user(user())
                .revoked(true)
                .expiresAt(Instant.now().plusSeconds(60))
                .build();
        when(repo.findByToken("rev")).thenReturn(Optional.of(revoked));
        assertThatThrownBy(() -> service.validateUsable("rev"))
                .isInstanceOf(IllegalArgumentException.class);

        RefreshToken expired = RefreshToken.builder()
                .token("exp")
                .user(user())
                .revoked(false)
                .expiresAt(Instant.now().minusSeconds(1))
                .build();
        when(repo.findByToken("exp")).thenReturn(Optional.of(expired));
        assertThatThrownBy(() -> service.validateUsable("exp"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    /**
     * Given a valid existing refresh token
     * When rotate is invoked
     * Then the old token is revoked and a new one is created and persisted
     */
    @Test
    void rotate_revokes_old_and_creates_new() {
        User u = user();
        RefreshToken old = RefreshToken.builder()
                .token("old")
                .user(u)
                .revoked(false)
                .expiresAt(Instant.now().plusSeconds(60))
                .build();

        when(repo.save(any(RefreshToken.class))).thenAnswer(inv -> inv.getArgument(0));

        // When
        RefreshToken fresh = service.rotate(old);

        // Then
        assertThat(old.isRevoked()).isTrue();
        assertThat(fresh).isNotNull();
        assertThat(fresh.getToken()).isNotEqualTo("old");
        assertThat(fresh.getUser()).isEqualTo(u);
        assertThat(fresh.isRevoked()).isFalse();

        verify(repo, times(2)).save(any(RefreshToken.class));
    }

    /**
     * Given a stored token
     * When revoke is invoked with its token
     * Then the token is marked revoked and saved
     */
    @Test
    void revoke_sets_revoked_true_if_found() {
        RefreshToken stored = RefreshToken.builder()
                .token("tok")
                .user(user())
                .revoked(false)
                .expiresAt(Instant.now().plusSeconds(60))
                .build();

        when(repo.findByToken("tok")).thenReturn(Optional.of(stored));
        when(repo.save(any(RefreshToken.class))).thenAnswer(inv -> inv.getArgument(0));

        // When
        service.revoke("tok");

        // Then
        assertThat(stored.isRevoked()).isTrue();
        verify(repo).save(stored);
    }

    /**
     * Given an unknown token
     * When revoke is invoked
     * Then no persistence changes occur
     */
    @Test
    void revoke_noop_if_not_found() {
        when(repo.findByToken("unknown")).thenReturn(Optional.empty());
        // When
        service.revoke("unknown");
        // Then
        verify(repo, never()).save(any());
    }
}
