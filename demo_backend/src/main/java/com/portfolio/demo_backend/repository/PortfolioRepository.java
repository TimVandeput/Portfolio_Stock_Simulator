package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Repository for {@link Portfolio} positions linking a user to a
 * {@link com.portfolio.demo_backend.model.Symbol}.
 */
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    /**
     * Returns all positions for the given user.
     *
     * @param userId the user identifier
     * @return list of positions (empty if none)
     */
    List<Portfolio> findByUserId(Long userId);

    /**
     * Finds a position by user and exact symbol name (case depends on data
     * normalization).
     *
     * @param userId     the user identifier
     * @param symbolName the symbol to match (prefer uppercase)
     * @return the position if present, otherwise empty
     */
    Optional<Portfolio> findByUserIdAndSymbol_Symbol(Long userId, String symbolName);

    /**
     * Returns positions with positive share count for a user.
     *
     * @param userId the user identifier
     * @return active positions only
     */
    @Query("SELECT p FROM Portfolio p WHERE p.userId = :userId AND p.sharesOwned > 0")
    List<Portfolio> findActivePositionsByUserId(@Param("userId") Long userId);

}
