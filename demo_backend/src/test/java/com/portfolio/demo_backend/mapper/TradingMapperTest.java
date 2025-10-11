package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.model.Transaction;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.model.enums.TransactionType;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.time.Instant;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for {@link TradingMapper}.
 *
 * Verifies mapping from domain
 * {@link com.portfolio.demo_backend.model.Transaction}
 * to {@link com.portfolio.demo_backend.dto.trading.TradeExecutionResponse} for
 * both BUY and SELL scenarios.
 */
class TradingMapperTest {

    private final TradingMapper mapper = Mappers.getMapper(TradingMapper.class);

    /**
     * Ensures BUY transaction is mapped to TradeExecutionResponse correctly.
     */
    @Test
    void toTradeExecutionResponse_buyOrder_generatesProperly() {
        // Given: A BUY transaction with values
        Symbol symbol = new Symbol();
        symbol.setSymbol("AAPL");
        symbol.setName("Apple Inc.");
        symbol.setEnabled(true);

        Transaction transaction = new Transaction();
        transaction.setSymbol(symbol);
        transaction.setQuantity(50);
        transaction.setPricePerShare(new BigDecimal("155.75"));
        transaction.setTotalAmount(new BigDecimal("7787.50"));
        transaction.setType(TransactionType.BUY);
        transaction.setExecutedAt(Instant.now());
        BigDecimal newCashBalance = new BigDecimal("1212.50");
        Integer newSharesOwned = 150;

        // When: Mapping to response
        TradeExecutionResponse response = mapper.toTradeExecutionResponse(
                transaction, newCashBalance, newSharesOwned);

        // Then: Fields are transferred correctly
        assertEquals("AAPL", response.getSymbol());
        assertEquals(50, response.getQuantity());
        assertEquals(new BigDecimal("155.75"), response.getExecutionPrice());
        assertEquals(new BigDecimal("7787.50"), response.getTotalAmount());
        assertEquals(TransactionType.BUY, response.getTransactionType());
        assertEquals(new BigDecimal("1212.50"), response.getNewCashBalance());
        assertEquals(150, response.getNewSharesOwned());
        assertTrue(response.getMessage().contains("Successfully bought 50 shares of AAPL"));
    }

    /**
     * Ensures SELL transaction is mapped to TradeExecutionResponse correctly.
     */
    @Test
    void toTradeExecutionResponse_sellOrder_generatesProperly() {
        // Given: A SELL transaction with values
        Symbol symbol = new Symbol();
        symbol.setSymbol("GOOGL");
        symbol.setName("Alphabet Inc.");
        symbol.setEnabled(true);

        Transaction transaction = new Transaction();
        transaction.setSymbol(symbol);
        transaction.setQuantity(25);
        transaction.setPricePerShare(new BigDecimal("135.00"));
        transaction.setTotalAmount(new BigDecimal("3375.00"));
        transaction.setType(TransactionType.SELL);
        transaction.setExecutedAt(Instant.now());
        BigDecimal newCashBalance = new BigDecimal("8375.00");
        Integer newSharesOwned = 25;

        // When: Mapping to response
        TradeExecutionResponse response = mapper.toTradeExecutionResponse(
                transaction, newCashBalance, newSharesOwned);

        // Then: Fields and message reflect SELL
        assertEquals(TransactionType.SELL, response.getTransactionType());
        assertTrue(response.getMessage().contains("Successfully sold 25 shares of GOOGL"));
    }
}
