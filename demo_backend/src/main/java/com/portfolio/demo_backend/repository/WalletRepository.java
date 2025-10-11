package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository for {@link Wallet} entities keyed by the owning user's ID.
 */
public interface WalletRepository extends JpaRepository<Wallet, Long> {

    /**
     * Retrieves the wallet for a given user ID.
     *
     * @param userId the user identifier
     * @return the wallet if present, otherwise empty
     */
    Optional<Wallet> findByUserId(Long userId);
}
