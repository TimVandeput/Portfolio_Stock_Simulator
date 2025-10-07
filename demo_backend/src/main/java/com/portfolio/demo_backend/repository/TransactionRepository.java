package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.symbol WHERE t.userId = :userId ORDER BY t.executedAt DESC")
    List<Transaction> findByUserIdWithSymbolOrderByExecutedAtDesc(@Param("userId") Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND t.symbol.symbol = :symbol ORDER BY t.executedAt ASC")
    List<Transaction> findByUserIdAndSymbolOrderByExecutedAtAsc(@Param("userId") Long userId,
            @Param("symbol") String symbol);
}
