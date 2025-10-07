package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository for {@link RefreshToken} entities.
 */
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    /**
     * Finds a refresh token by its exact token string.
     *
     * @param token the token value
     * @return the refresh token if found, otherwise empty
     */
    Optional<RefreshToken> findByToken(String token);
}
