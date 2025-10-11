package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.trading.TransactionDTO;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.model.Transaction;
import com.portfolio.demo_backend.model.enums.TransactionType;
import org.junit.jupiter.api.BeforeEach;
import org.mapstruct.factory.Mappers;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link TransactionMapper} verifying mapping from
 * {@link com.portfolio.demo_backend.model.Transaction} to
 * {@link com.portfolio.demo_backend.dto.trading.TransactionDTO} for
 * single objects and lists, including null and edge cases.
 */
class TransactionMapperUnitTest {

    private Transaction transaction;
    private Symbol symbol;
    private TransactionMapper mapper = Mappers.getMapper(TransactionMapper.class);

    @BeforeEach
    void setUp() {
        symbol = new Symbol();
        symbol.setSymbol("AAPL");
        symbol.setName("Apple Inc.");

        transaction = new Transaction();
        transaction.setId(1L);
        transaction.setUserId(123L);
        transaction.setType(TransactionType.BUY);
        transaction.setQuantity(10);
        transaction.setPricePerShare(BigDecimal.valueOf(150.00));
        transaction.setTotalAmount(BigDecimal.valueOf(1500.00));
        transaction.setExecutedAt(Instant.parse("2025-09-20T10:30:00Z"));
        transaction.setSymbol(symbol);
    }

    /**
     * Maps a populated transaction to DTO with all fields preserved.
     */
    @Test
    void toDTO_validTransaction_returnsCorrectDTO() {
        // Given: A fully populated Transaction entity
        // (created in setUp)

        // When: Mapping to DTO
        TransactionDTO result = mapper.toDTO(transaction);

        // Then: All fields are mapped accurately
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getUserId()).isEqualTo(123L);
        assertThat(result.getType()).isEqualTo(TransactionType.BUY);
        assertThat(result.getSymbol()).isEqualTo("AAPL");
        assertThat(result.getQuantity()).isEqualTo(10);
        assertThat(result.getPricePerShare()).isEqualByComparingTo(BigDecimal.valueOf(150.00));
        assertThat(result.getTotalAmount()).isEqualByComparingTo(BigDecimal.valueOf(1500.00));
        assertThat(result.getExecutedAt()).isEqualTo(Instant.parse("2025-09-20T10:30:00Z"));
    }

    /**
     * Returns null when mapping a null Transaction.
     */
    @Test
    void toDTO_nullTransaction_returnsNull() {
        // Given: A null Transaction

        // When: Mapping to DTO
        TransactionDTO result = mapper.toDTO(null);

        // Then: Result is null
        assertThat(result).isNull();
    }

    /**
     * Maps a transaction with null Symbol, resulting DTO has null symbol field.
     */
    @Test
    void toDTO_transactionWithNullSymbol_returnsNullSymbol() {
        // Given: Transaction without a Symbol
        transaction.setSymbol(null);

        // When: Mapping to DTO
        TransactionDTO result = mapper.toDTO(transaction);

        // Then: DTO symbol is null and other fields remain
        assertThat(result).isNotNull();
        assertThat(result.getSymbol()).isNull();
        assertThat(result.getId()).isEqualTo(1L);
    }

    /**
     * Maps a list of transactions to a list of DTOs preserving order and values.
     */
    @Test
    void toDTOList_validTransactions_returnsCorrectDTOList() {
        // Given: Two transactions with different types and quantities
        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        transaction2.setUserId(123L);
        transaction2.setType(TransactionType.SELL);
        transaction2.setQuantity(5);
        transaction2.setPricePerShare(BigDecimal.valueOf(160.00));
        transaction2.setTotalAmount(BigDecimal.valueOf(800.00));
        transaction2.setExecutedAt(Instant.parse("2025-09-21T14:15:00Z"));
        transaction2.setSymbol(symbol);

        List<Transaction> transactions = Arrays.asList(transaction, transaction2);

        // When: Mapping list to DTOs
        List<TransactionDTO> result = mapper.toDTOs(transactions);

        // Then: Both items are mapped correctly
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);

        TransactionDTO dto1 = result.get(0);
        assertThat(dto1.getId()).isEqualTo(1L);
        assertThat(dto1.getType()).isEqualTo(TransactionType.BUY);
        assertThat(dto1.getQuantity()).isEqualTo(10);

        TransactionDTO dto2 = result.get(1);
        assertThat(dto2.getId()).isEqualTo(2L);
        assertThat(dto2.getType()).isEqualTo(TransactionType.SELL);
        assertThat(dto2.getQuantity()).isEqualTo(5);
    }

    /**
     * Returns null when mapping a null list.
     */
    @Test
    void toDTOList_nullList_returnsNull() {
        // Given: A null list

        // When: Mapping to DTO list
        List<TransactionDTO> result = mapper.toDTOs(null);

        // Then: Result is null
        assertThat(result).isNull();
    }

    /**
     * Returns an empty list when mapping an empty input list.
     */
    @Test
    void toDTOList_emptyList_returnsEmptyList() {
        // Given: An empty list
        // When: Mapping to DTOs
        List<TransactionDTO> result = mapper.toDTOs(Collections.emptyList());

        // Then: Empty result list
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
    }
}
