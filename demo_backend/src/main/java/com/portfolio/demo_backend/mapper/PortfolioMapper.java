package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.portfolio.PortfolioHoldingResponseDTO;
import com.portfolio.demo_backend.dto.portfolio.PortfolioResponseDTO;
import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Wallet;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class PortfolioMapper {

    public static PortfolioHoldingResponseDTO toPortfolioHoldingResponseDTO(Portfolio portfolio) {
        if (portfolio == null) {
            return null;
        }

        BigDecimal totalCost = portfolio.getAverageCostBasis()
                .multiply(BigDecimal.valueOf(portfolio.getSharesOwned()));

        String lastTradeDate = portfolio.getUpdatedAt() != null ? portfolio.getUpdatedAt().toString() : null;

        return new PortfolioHoldingResponseDTO(
                portfolio.getSymbol().getSymbol(),
                portfolio.getSharesOwned(),
                portfolio.getAverageCostBasis(),
                totalCost,
                lastTradeDate);
    }

    public static PortfolioHoldingResponseDTO toEmptyPortfolioHoldingResponseDTO(String symbol) {
        return new PortfolioHoldingResponseDTO(
                symbol,
                0,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                null);
    }

    public static List<PortfolioHoldingResponseDTO> toPortfolioHoldingResponseDTOList(List<Portfolio> portfolios) {
        if (portfolios == null) {
            return null;
        }

        return portfolios.stream()
                .map(PortfolioMapper::toPortfolioHoldingResponseDTO)
                .collect(Collectors.toList());
    }

    public static PortfolioResponseDTO.WalletBalanceDTO toWalletBalanceDTO(Wallet wallet, BigDecimal totalInvested) {
        if (wallet == null) {
            return null;
        }

        BigDecimal totalValue = wallet.getCashBalance().add(totalInvested);

        return new PortfolioResponseDTO.WalletBalanceDTO(
                wallet.getCashBalance(),
                totalValue,
                totalInvested);
    }

    public static PortfolioResponseDTO.PortfolioSummaryDetailsDTO toPortfolioSummaryDetailsDTO(BigDecimal totalValue) {
        return new PortfolioResponseDTO.PortfolioSummaryDetailsDTO(
                totalValue,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO);
    }

    public static PortfolioResponseDTO toPortfolioResponseDTO(
            List<PortfolioHoldingResponseDTO> holdings,
            PortfolioResponseDTO.WalletBalanceDTO walletBalance,
            PortfolioResponseDTO.PortfolioSummaryDetailsDTO summary) {

        return new PortfolioResponseDTO(holdings, walletBalance, summary);
    }

    public static BigDecimal calculateTotalInvested(List<Portfolio> portfolios) {
        if (portfolios == null || portfolios.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return portfolios.stream()
                .map(p -> p.getAverageCostBasis().multiply(BigDecimal.valueOf(p.getSharesOwned())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
