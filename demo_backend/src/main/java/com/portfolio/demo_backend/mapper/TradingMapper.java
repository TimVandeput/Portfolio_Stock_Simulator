package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.trading.PortfolioHoldingDTO;
import com.portfolio.demo_backend.dto.trading.PortfolioSummaryDTO;
import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Transaction;
import com.portfolio.demo_backend.model.Wallet;

import static com.portfolio.demo_backend.model.enums.TransactionType.BUY;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class TradingMapper {

    public static PortfolioHoldingDTO toPortfolioHoldingDTO(Portfolio portfolio, BigDecimal currentPrice) {
        PortfolioHoldingDTO dto = new PortfolioHoldingDTO();

        dto.setSymbol(portfolio.getSymbol().getSymbol());
        dto.setShares(portfolio.getSharesOwned());
        dto.setAverageCost(portfolio.getAverageCostBasis());
        dto.setCurrentPrice(currentPrice);

        BigDecimal marketValue = currentPrice.multiply(BigDecimal.valueOf(portfolio.getSharesOwned()));
        dto.setMarketValue(marketValue);

        BigDecimal costBasis = portfolio.getAverageCostBasis().multiply(BigDecimal.valueOf(portfolio.getSharesOwned()));

        BigDecimal unrealizedGainLoss = marketValue.subtract(costBasis);
        dto.setUnrealizedGainLoss(unrealizedGainLoss);

        if (costBasis.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal unrealizedGainLossPercent = unrealizedGainLoss
                    .divide(costBasis, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            dto.setUnrealizedGainLossPercent(unrealizedGainLossPercent);
        } else {
            dto.setUnrealizedGainLossPercent(BigDecimal.ZERO);
        }

        return dto;
    }

    public static PortfolioSummaryDTO toPortfolioSummaryDTO(Wallet wallet, List<Portfolio> portfolios,
            Map<String, BigDecimal> currentPrices) {
        PortfolioSummaryDTO summary = new PortfolioSummaryDTO();

        summary.setCashBalance(wallet.getCashBalance());

        List<PortfolioHoldingDTO> holdings = portfolios.stream()
                .map(portfolio -> {
                    String symbol = portfolio.getSymbol().getSymbol();
                    BigDecimal currentPrice = currentPrices.getOrDefault(symbol, BigDecimal.ZERO);
                    return toPortfolioHoldingDTO(portfolio, currentPrice);
                })
                .collect(Collectors.toList());

        summary.setHoldings(holdings);

        BigDecimal totalMarketValue = holdings.stream()
                .map(PortfolioHoldingDTO::getMarketValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalUnrealizedGainLoss = holdings.stream()
                .map(PortfolioHoldingDTO::getUnrealizedGainLoss)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        summary.setTotalMarketValue(totalMarketValue);
        summary.setTotalPortfolioValue(wallet.getCashBalance().add(totalMarketValue));
        summary.setTotalUnrealizedGainLoss(totalUnrealizedGainLoss);

        BigDecimal totalCostBasis = holdings.stream()
                .map(holding -> holding.getAverageCost().multiply(BigDecimal.valueOf(holding.getShares())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalCostBasis.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal totalUnrealizedGainLossPercent = totalUnrealizedGainLoss
                    .divide(totalCostBasis, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            summary.setTotalUnrealizedGainLossPercent(totalUnrealizedGainLossPercent);
        } else {
            summary.setTotalUnrealizedGainLossPercent(BigDecimal.ZERO);
        }

        return summary;
    }

    public static TradeExecutionResponse toTradeExecutionResponse(Transaction transaction, BigDecimal newCashBalance,
            Integer newSharesOwned) {
        TradeExecutionResponse response = new TradeExecutionResponse();

        response.setSymbol(transaction.getSymbol().getSymbol());
        response.setQuantity(transaction.getQuantity());
        response.setExecutionPrice(transaction.getPricePerShare());
        response.setTotalAmount(transaction.getTotalAmount());
        response.setTransactionType(transaction.getType());
        response.setExecutedAt(transaction.getExecutedAt());
        response.setNewCashBalance(newCashBalance);
        response.setNewSharesOwned(newSharesOwned);

        response.setMessage(String.format("Successfully %s %d shares of %s at $%.2f per share",
                transaction.getType() == BUY ? "bought" : "sold",
                transaction.getQuantity(),
                transaction.getSymbol().getSymbol(),
                transaction.getPricePerShare()));

        return response;
    }
}
