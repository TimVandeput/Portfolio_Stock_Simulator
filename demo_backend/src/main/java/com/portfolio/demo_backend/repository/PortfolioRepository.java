package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    List<Portfolio> findByUserId(Long userId);

    Optional<Portfolio> findByUserIdAndSymbol_Symbol(Long userId, String symbolName);

    @Query("SELECT p FROM Portfolio p WHERE p.userId = :userId AND p.sharesOwned > 0")
    List<Portfolio> findActivePositionsByUserId(@Param("userId") Long userId);


}
