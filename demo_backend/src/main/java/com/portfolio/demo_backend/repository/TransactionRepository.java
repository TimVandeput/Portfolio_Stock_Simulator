package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Repository for {@link Transaction} records.
 */
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    /**
     * Retrieves transactions for a user including associated symbol via fetch join,
     * ordered by execution time descending.
     *
     * @param userId the user identifier
     * @return list of transactions (may be empty)
     */
    @Query("SELECT t FROM Transaction t LEFT JOIN FETCH t.symbol WHERE t.userId = :userId ORDER BY t.executedAt DESC")
    List<Transaction> findByUserIdWithSymbolOrderByExecutedAtDesc(@Param("userId") Long userId);

    /**
     * Retrieves transactions for a user filtered by exact symbol, ordered by
     * execution time ascending.
     *
     * @param userId the user identifier
     * @param symbol the exact symbol code (case depends on stored data)
     * @return list of transactions (may be empty)
     */
    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId AND t.symbol.symbol = :symbol ORDER BY t.executedAt ASC")
    List<Transaction> findByUserIdAndSymbolOrderByExecutedAtAsc(@Param("userId") Long userId,
            @Param("symbol") String symbol);
}
