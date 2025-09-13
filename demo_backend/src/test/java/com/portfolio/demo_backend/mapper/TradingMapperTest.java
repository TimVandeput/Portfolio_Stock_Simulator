package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Transaction;
import com.portfolio.demo_backend.model.Wallet;
import com.portfolio.demo_backend.dto.PortfolioHoldingDTO;
import com.portfolio.demo_backend.dto.PortfolioSummaryDTO;
import com.portfolio.demo_backend.dto.TradeExecutionResponse;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class TradingMapperTest {

    @Test
    void toPortfolioHoldingDTO_withProfitablePosition_calculatesCorrectly() {
        Portfolio portfolio = new Portfolio();
        portfolio.setSymbol("AAPL");
        portfolio.setSharesOwned(100);
        portfolio.setAverageCostBasis(new BigDecimal("150.00"));
        BigDecimal currentPrice = new BigDecimal("160.00");

        PortfolioHoldingDTO dto = TradingMapper.toPortfolioHoldingDTO(portfolio, currentPrice);

        assertEquals("AAPL", dto.getSymbol());
        assertEquals(100, dto.getShares());
        assertEquals(new BigDecimal("150.00"), dto.getAverageCost());
        assertEquals(new BigDecimal("160.00"), dto.getCurrentPrice());
        assertEquals(new BigDecimal("16000.00"), dto.getMarketValue());
        assertEquals(new BigDecimal("1000.00"), dto.getUnrealizedGainLoss());
        assertEquals(0, new BigDecimal("6.67")
                .compareTo(dto.getUnrealizedGainLossPercent().setScale(2, java.math.RoundingMode.HALF_UP)));
    }

    @Test
    void toPortfolioSummaryDTO_withMultipleHoldings_aggregatesCorrectly() {
        Wallet wallet = new Wallet();
        wallet.setCashBalance(new BigDecimal("2000.00"));

        Portfolio portfolio1 = new Portfolio();
        portfolio1.setSymbol("AAPL");
        portfolio1.setSharesOwned(100);
        portfolio1.setAverageCostBasis(new BigDecimal("150.00"));

        Portfolio portfolio2 = new Portfolio();
        portfolio2.setSymbol("GOOGL");
        portfolio2.setSharesOwned(50);
        portfolio2.setAverageCostBasis(new BigDecimal("120.00"));

        Map<String, BigDecimal> currentPrices = new HashMap<>();
        currentPrices.put("AAPL", new BigDecimal("160.00"));
        currentPrices.put("GOOGL", new BigDecimal("130.00"));

        PortfolioSummaryDTO summary = TradingMapper.toPortfolioSummaryDTO(
                wallet, Arrays.asList(portfolio1, portfolio2), currentPrices);

        assertEquals(new BigDecimal("2000.00"), summary.getCashBalance());
        assertEquals(new BigDecimal("22500.00"), summary.getTotalMarketValue());
        assertEquals(new BigDecimal("24500.00"), summary.getTotalPortfolioValue());
        assertEquals(new BigDecimal("1500.00"), summary.getTotalUnrealizedGainLoss());
        assertEquals(2, summary.getHoldings().size());
    }

    @Test
    void toTradeExecutionResponse_buyOrder_generatesProperly() {
        Transaction transaction = new Transaction();
        transaction.setSymbol("AAPL");
        transaction.setQuantity(50);
        transaction.setPricePerShare(new BigDecimal("155.75"));
        transaction.setTotalAmount(new BigDecimal("7787.50"));
        transaction.setType(Transaction.TransactionType.BUY);
        transaction.setExecutedAt(Instant.now());
        BigDecimal newCashBalance = new BigDecimal("1212.50");
        Integer newSharesOwned = 150;

        TradeExecutionResponse response = TradingMapper.toTradeExecutionResponse(
                transaction, newCashBalance, newSharesOwned);

        assertEquals("AAPL", response.getSymbol());
        assertEquals(50, response.getQuantity());
        assertEquals(new BigDecimal("155.75"), response.getExecutionPrice());
        assertEquals(new BigDecimal("7787.50"), response.getTotalAmount());
        assertEquals("BUY", response.getTransactionType());
        assertEquals(new BigDecimal("1212.50"), response.getNewCashBalance());
        assertEquals(150, response.getNewSharesOwned());
        assertTrue(response.getMessage().contains("Successfully bought 50 shares of AAPL"));
    }

    @Test
    void toTradeExecutionResponse_sellOrder_generatesProperly() {
        Transaction transaction = new Transaction();
        transaction.setSymbol("GOOGL");
        transaction.setQuantity(25);
        transaction.setPricePerShare(new BigDecimal("135.00"));
        transaction.setTotalAmount(new BigDecimal("3375.00"));
        transaction.setType(Transaction.TransactionType.SELL);
        transaction.setExecutedAt(Instant.now());
        BigDecimal newCashBalance = new BigDecimal("8375.00");
        Integer newSharesOwned = 25;

        TradeExecutionResponse response = TradingMapper.toTradeExecutionResponse(
                transaction, newCashBalance, newSharesOwned);

        assertEquals("SELL", response.getTransactionType());
        assertTrue(response.getMessage().contains("Successfully sold 25 shares of GOOGL"));
    }
}
