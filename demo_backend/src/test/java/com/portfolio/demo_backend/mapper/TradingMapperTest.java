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

class TradingMapperTest {

    private final TradingMapper mapper = Mappers.getMapper(TradingMapper.class);

    @Test
    void toTradeExecutionResponse_buyOrder_generatesProperly() {
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

        TradeExecutionResponse response = mapper.toTradeExecutionResponse(
                transaction, newCashBalance, newSharesOwned);

        assertEquals("AAPL", response.getSymbol());
        assertEquals(50, response.getQuantity());
        assertEquals(new BigDecimal("155.75"), response.getExecutionPrice());
        assertEquals(new BigDecimal("7787.50"), response.getTotalAmount());
        assertEquals(TransactionType.BUY, response.getTransactionType());
        assertEquals(new BigDecimal("1212.50"), response.getNewCashBalance());
        assertEquals(150, response.getNewSharesOwned());
        assertTrue(response.getMessage().contains("Successfully bought 50 shares of AAPL"));
    }

    @Test
    void toTradeExecutionResponse_sellOrder_generatesProperly() {
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

        TradeExecutionResponse response = mapper.toTradeExecutionResponse(
                transaction, newCashBalance, newSharesOwned);

        assertEquals(TransactionType.SELL, response.getTransactionType());
        assertTrue(response.getMessage().contains("Successfully sold 25 shares of GOOGL"));
    }
}
