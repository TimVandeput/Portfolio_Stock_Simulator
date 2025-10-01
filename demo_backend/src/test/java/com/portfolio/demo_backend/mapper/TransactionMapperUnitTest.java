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

    @Test
    void toDTO_validTransaction_returnsCorrectDTO() {
        TransactionDTO result = mapper.toDTO(transaction);

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

    @Test
    void toDTO_nullTransaction_returnsNull() {
        TransactionDTO result = mapper.toDTO(null);

        assertThat(result).isNull();
    }

    @Test
    void toDTO_transactionWithNullSymbol_returnsNullSymbol() {
        transaction.setSymbol(null);

        TransactionDTO result = mapper.toDTO(transaction);

        assertThat(result).isNotNull();
        assertThat(result.getSymbol()).isNull();
        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void toDTOList_validTransactions_returnsCorrectDTOList() {
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

        List<TransactionDTO> result = mapper.toDTOs(transactions);

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

    @Test
    void toDTOList_nullList_returnsNull() {
        List<TransactionDTO> result = mapper.toDTOs(null);

        assertThat(result).isNull();
    }

    @Test
    void toDTOList_emptyList_returnsEmptyList() {
        List<TransactionDTO> result = mapper.toDTOs(Collections.emptyList());

        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
    }
}
