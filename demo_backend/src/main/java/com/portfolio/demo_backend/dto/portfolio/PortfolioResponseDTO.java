package com.portfolio.demo_backend.dto.portfolio;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Aggregated portfolio response containing holdings, wallet balance and
 * summary metrics.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioResponseDTO {
    @Valid
    private List<PortfolioHoldingResponseDTO> holdings;
    @NotNull
    @Valid
    private WalletBalanceDTO walletBalance;
    @NotNull
    @Valid
    private PortfolioSummaryDetailsDTO summary;

    /** Summary of the user's wallet balances reported with the portfolio. */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WalletBalanceDTO {
        @NotNull
        private BigDecimal cashBalance;
        @NotNull
        private BigDecimal totalValue;
        @NotNull
        private BigDecimal totalInvested;
    }

    /** Derived totals and PnL percentages for the entire portfolio. */
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PortfolioSummaryDetailsDTO {
        @NotNull
        private BigDecimal totalPortfolioValue;
        @NotNull
        private BigDecimal totalUnrealizedPnL;
        @NotNull
        private BigDecimal totalRealizedPnL;
        @NotNull
        private BigDecimal totalPnLPercent;
    }
}
