package com.portfolio.demo_backend.dto.trading;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioHoldingDTO {

    private String symbol;
    private Integer shares;
    private BigDecimal averageCost;
    private BigDecimal currentPrice;
    private BigDecimal marketValue;
    private BigDecimal unrealizedGainLoss;
    private BigDecimal unrealizedGainLossPercent;
}
