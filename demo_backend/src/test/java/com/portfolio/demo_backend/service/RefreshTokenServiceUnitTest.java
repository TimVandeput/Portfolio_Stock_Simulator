package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.RefreshToken;
import com.portfolio.demo_backend.model.Role;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.time.Instant;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class RefreshTokenServiceUnitTest {

    private RefreshTokenRepository repo;
    private RefreshTokenService service;

    @BeforeEach
    void setUp() {
        repo = mock(RefreshTokenRepository.class);
        service = new RefreshTokenService(repo);
    }

    private static User user() {
        return User.builder()
                .id(1L)
                .username("tim")
                .password("$2a$10$hash")
                .roles(new HashSet<>(Set.of(Role.ROLE_USER)))
                .build();
    }

    @Test
    void create_persists_with_future_exp_and_notRevoked() {
        User u = user();

        ArgumentCaptor<RefreshToken> cap = ArgumentCaptor.forClass(RefreshToken.class);
        when(repo.save(cap.capture())).thenAnswer(inv -> inv.getArgument(0));

        RefreshToken rt = service.create(u);

        assertThat(rt.getToken()).isNotBlank();
        assertThat(rt.getUser()).isEqualTo(u);
        assertThat(rt.isRevoked()).isFalse();
        assertThat(rt.getExpiresAt()).isAfter(Instant.now());

        verify(repo).save(any(RefreshToken.class));
        assertThat(cap.getValue().getToken()).isEqualTo(rt.getToken());
    }

    @Test
    void validateUsable_ok_when_active_and_notExpired() {
        RefreshToken stored = RefreshToken.builder()
                .token("tok")
                .user(user())
                .revoked(false)
                .expiresAt(Instant.now().plusSeconds(60))
                .build();

        when(repo.findByToken("tok")).thenReturn(Optional.of(stored));

        RefreshToken out = service.validateUsable("tok");
        assertThat(out).isSameAs(stored);
    }

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

        RefreshToken fresh = service.rotate(old);

        assertThat(old.isRevoked()).isTrue();
        assertThat(fresh).isNotNull();
        assertThat(fresh.getToken()).isNotEqualTo("old");
        assertThat(fresh.getUser()).isEqualTo(u);
        assertThat(fresh.isRevoked()).isFalse();

        verify(repo, times(2)).save(any(RefreshToken.class));
    }

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

        service.revoke("tok");

        assertThat(stored.isRevoked()).isTrue();
        verify(repo).save(stored);
    }

    @Test
    void revoke_noop_if_not_found() {
        when(repo.findByToken("unknown")).thenReturn(Optional.empty());
        service.revoke("unknown");
        verify(repo, never()).save(any());
    }
}
