package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.portfolio.PortfolioHoldingResponseDTO;
import com.portfolio.demo_backend.dto.portfolio.PortfolioResponseDTO;
import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Wallet;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PortfolioDtoMapper {

    @Mapping(target = "symbol", source = "symbol.symbol")
    @Mapping(target = "quantity", source = "sharesOwned")
    @Mapping(target = "avgCostBasis", source = "averageCostBasis")
    @Mapping(target = "totalCost", ignore = true)
    @Mapping(target = "lastTradeDate", source = "updatedAt")
    PortfolioHoldingResponseDTO toHolding(Portfolio portfolio);

    List<PortfolioHoldingResponseDTO> toHoldings(List<Portfolio> portfolios);

    @AfterMapping
    default void computeTotals(Portfolio source, @MappingTarget PortfolioHoldingResponseDTO target) {
        if (source == null || target == null)
            return;
        Integer qty = source.getSharesOwned();
        BigDecimal acb = source.getAverageCostBasis();
        if (qty != null && acb != null) {
            target.setTotalCost(acb.multiply(BigDecimal.valueOf(qty)));
        }
    }

    default PortfolioHoldingResponseDTO toEmptyHolding(String symbol) {
        PortfolioHoldingResponseDTO dto = new PortfolioHoldingResponseDTO();
        dto.setSymbol(symbol);
        dto.setQuantity(0);
        dto.setAvgCostBasis(BigDecimal.ZERO);
        dto.setTotalCost(BigDecimal.ZERO);
        dto.setLastTradeDate(null);
        return dto;
    }

    default PortfolioResponseDTO.WalletBalanceDTO toWalletBalanceDTO(Wallet wallet, BigDecimal totalInvested) {
        if (wallet == null)
            return null;
        BigDecimal cash = wallet.getCashBalance();
        BigDecimal invested = totalInvested != null ? totalInvested : BigDecimal.ZERO;
        BigDecimal totalValue = (cash != null ? cash : BigDecimal.ZERO).add(invested);
        return new PortfolioResponseDTO.WalletBalanceDTO(cash, totalValue, invested);
    }

    default PortfolioResponseDTO.PortfolioSummaryDetailsDTO toPortfolioSummaryDetailsDTO(BigDecimal totalValue) {
        return new PortfolioResponseDTO.PortfolioSummaryDetailsDTO(
                totalValue,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO);
    }

    default PortfolioResponseDTO toPortfolioResponseDTO(
            List<PortfolioHoldingResponseDTO> holdings,
            PortfolioResponseDTO.WalletBalanceDTO walletBalance,
            PortfolioResponseDTO.PortfolioSummaryDetailsDTO summary) {
        return new PortfolioResponseDTO(holdings, walletBalance, summary);
    }
}
