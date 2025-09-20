package com.portfolio.demo_backend.dto.trading;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioSummaryDTO {

    private BigDecimal cashBalance;
    private BigDecimal totalMarketValue;
    private BigDecimal totalPortfolioValue;
    private BigDecimal totalUnrealizedGainLoss;
    private BigDecimal totalUnrealizedGainLossPercent;
    private List<PortfolioHoldingDTO> holdings;
}
