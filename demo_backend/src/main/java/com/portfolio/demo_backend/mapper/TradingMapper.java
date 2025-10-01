package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.trading.PortfolioHoldingDTO;
import com.portfolio.demo_backend.dto.trading.PortfolioSummaryDTO;
import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Transaction;
import com.portfolio.demo_backend.model.Wallet;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

import static com.portfolio.demo_backend.model.enums.TransactionType.BUY;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TradingMapper {

    @Mapping(target = "symbol", source = "transaction.symbol.symbol")
    @Mapping(target = "quantity", source = "transaction.quantity")
    @Mapping(target = "executionPrice", source = "transaction.pricePerShare")
    @Mapping(target = "totalAmount", source = "transaction.totalAmount")
    @Mapping(target = "transactionType", source = "transaction.type")
    @Mapping(target = "executedAt", source = "transaction.executedAt")
    @Mapping(target = "newCashBalance", source = "newCashBalance")
    @Mapping(target = "newSharesOwned", source = "newSharesOwned")
    TradeExecutionResponse toTradeExecutionResponse(Transaction transaction, BigDecimal newCashBalance,
            Integer newSharesOwned);

    @AfterMapping
    default void fillTradeMessage(Transaction transaction, @MappingTarget TradeExecutionResponse target) {
        target.setMessage(String.format("Successfully %s %d shares of %s at $%.2f per share",
                transaction.getType() == BUY ? "bought" : "sold",
                transaction.getQuantity(),
                transaction.getSymbol().getSymbol(),
                transaction.getPricePerShare()));
    }

    @Mapping(target = "symbol", source = "portfolio.symbol.symbol")
    @Mapping(target = "shares", source = "portfolio.sharesOwned")
    @Mapping(target = "averageCost", source = "portfolio.averageCostBasis")
    @Mapping(target = "currentPrice", source = "currentPrice")
    @Mapping(target = "marketValue", ignore = true)
    @Mapping(target = "unrealizedGainLoss", ignore = true)
    @Mapping(target = "unrealizedGainLossPercent", ignore = true)
    PortfolioHoldingDTO toPortfolioHoldingDTO(Portfolio portfolio, BigDecimal currentPrice);

    @AfterMapping
    default void computeHoldingDerived(Portfolio portfolio, BigDecimal currentPrice,
            @MappingTarget PortfolioHoldingDTO dto) {
        BigDecimal marketValue = currentPrice.multiply(BigDecimal.valueOf(portfolio.getSharesOwned()));
        dto.setMarketValue(marketValue);

        BigDecimal costBasis = portfolio.getAverageCostBasis()
                .multiply(BigDecimal.valueOf(portfolio.getSharesOwned()));

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
    }

    @Mapping(target = "symbol", source = "portfolio.symbol.symbol")
    @Mapping(target = "shares", source = "portfolio.sharesOwned")
    @Mapping(target = "averageCost", source = "portfolio.averageCostBasis")
    @Mapping(target = "currentPrice", expression = "java(currentPrices.getOrDefault(portfolio.getSymbol().getSymbol(), java.math.BigDecimal.ZERO))")
    @Mapping(target = "marketValue", ignore = true)
    @Mapping(target = "unrealizedGainLoss", ignore = true)
    @Mapping(target = "unrealizedGainLossPercent", ignore = true)
    PortfolioHoldingDTO toPortfolioHoldingDTO(Portfolio portfolio, @Context Map<String, BigDecimal> currentPrices);

    List<PortfolioHoldingDTO> toPortfolioHoldingDTOs(List<Portfolio> portfolios,
            @Context Map<String, BigDecimal> currentPrices);

    @AfterMapping
    default void computeHoldingDerived(Portfolio portfolio,
            @Context Map<String, BigDecimal> currentPrices,
            @MappingTarget PortfolioHoldingDTO dto) {
        BigDecimal current = dto.getCurrentPrice();
        if (current == null) {
            current = currentPrices.getOrDefault(
                    portfolio.getSymbol() != null ? portfolio.getSymbol().getSymbol() : null,
                    BigDecimal.ZERO);
        }
        computeHoldingDerived(portfolio, current, dto);
    }

    @Mapping(target = "cashBalance", source = "wallet.cashBalance")
    @Mapping(target = "holdings", expression = "java(toPortfolioHoldingDTOs(portfolios, currentPrices))")
    @Mapping(target = "totalMarketValue", ignore = true)
    @Mapping(target = "totalPortfolioValue", ignore = true)
    @Mapping(target = "totalUnrealizedGainLoss", ignore = true)
    @Mapping(target = "totalUnrealizedGainLossPercent", ignore = true)
    PortfolioSummaryDTO toPortfolioSummaryDTO(Wallet wallet, List<Portfolio> portfolios,
            @Context Map<String, BigDecimal> currentPrices);

    @AfterMapping
    default void computeSummaryDerived(@MappingTarget PortfolioSummaryDTO summary) {
        List<PortfolioHoldingDTO> holdings = summary.getHoldings();
        if (holdings == null) {
            summary.setTotalMarketValue(BigDecimal.ZERO);
            summary.setTotalPortfolioValue(summary.getCashBalance());
            summary.setTotalUnrealizedGainLoss(BigDecimal.ZERO);
            summary.setTotalUnrealizedGainLossPercent(BigDecimal.ZERO);
            return;
        }

        BigDecimal totalMarketValue = holdings.stream()
                .map(PortfolioHoldingDTO::getMarketValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalUnrealizedGainLoss = holdings.stream()
                .map(PortfolioHoldingDTO::getUnrealizedGainLoss)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        summary.setTotalMarketValue(totalMarketValue);
        BigDecimal cash = summary.getCashBalance() != null ? summary.getCashBalance() : BigDecimal.ZERO;
        summary.setTotalPortfolioValue(cash.add(totalMarketValue));
        summary.setTotalUnrealizedGainLoss(totalUnrealizedGainLoss);

        BigDecimal totalCostBasis = holdings.stream()
                .map(h -> h.getAverageCost().multiply(BigDecimal.valueOf(h.getShares())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalCostBasis.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal pct = totalUnrealizedGainLoss
                    .divide(totalCostBasis, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            summary.setTotalUnrealizedGainLossPercent(pct);
        } else {
            summary.setTotalUnrealizedGainLossPercent(BigDecimal.ZERO);
        }
    }
}
