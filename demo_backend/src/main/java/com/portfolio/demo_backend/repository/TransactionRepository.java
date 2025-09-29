package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Transaction;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.model.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByExecutedAtDesc(Long userId);

    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.symbol WHERE t.userId = :userId ORDER BY t.executedAt DESC")
    List<Transaction> findByUserIdWithSymbolOrderByExecutedAtDesc(@Param("userId") Long userId);

    Page<Transaction> findByUserIdOrderByExecutedAtDesc(Long userId, Pageable pageable);

    List<Transaction> findByUserIdAndSymbolOrderByExecutedAtDesc(Long userId, Symbol symbol);

    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND t.symbol.symbol = :symbol ORDER BY t.executedAt ASC")
    List<Transaction> findByUserIdAndSymbolOrderByExecutedAtAsc(@Param("userId") Long userId,
            @Param("symbol") String symbol);

    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND t.executedAt >= :startDate ORDER BY t.executedAt DESC")
    List<Transaction> findRecentTransactions(@Param("userId") Long userId, @Param("startDate") Instant startDate);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.userId = :userId AND t.type = :type")
    Long countTransactionsByType(@Param("userId") Long userId, @Param("type") TransactionType type);
}
