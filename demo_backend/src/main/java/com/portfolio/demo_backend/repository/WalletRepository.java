package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {

    Optional<Wallet> findByUserId(Long userId);

    @Modifying
    @Query("UPDATE Wallet w SET w.cashBalance = w.cashBalance - :amount WHERE w.userId = :userId AND w.cashBalance >= :amount")
    int deductCash(@Param("userId") Long userId, @Param("amount") BigDecimal amount);

    @Modifying
    @Query("UPDATE Wallet w SET w.cashBalance = w.cashBalance + :amount WHERE w.userId = :userId")
    int addCash(@Param("userId") Long userId, @Param("amount") BigDecimal amount);
}
