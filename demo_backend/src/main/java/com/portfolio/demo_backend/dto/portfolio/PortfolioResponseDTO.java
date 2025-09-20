package com.portfolio.demo_backend.dto.portfolio;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioResponseDTO {
    private List<PortfolioHoldingResponseDTO> holdings;
    private WalletBalanceDTO walletBalance;
    private PortfolioSummaryDetailsDTO summary;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class WalletBalanceDTO {
        private BigDecimal cashBalance;
        private BigDecimal totalValue;
        private BigDecimal totalInvested;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PortfolioSummaryDetailsDTO {
        private BigDecimal totalPortfolioValue;
        private BigDecimal totalUnrealizedPnL;
        private BigDecimal totalRealizedPnL;
        private BigDecimal totalPnLPercent;
    }
}
