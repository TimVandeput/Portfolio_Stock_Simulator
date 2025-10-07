package com.portfolio.demo_backend.dto.trading;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioHoldingDTO {

    @NotBlank
    private String symbol;
    @NotNull
    private Integer shares;
    @NotNull
    private BigDecimal averageCost;
    @NotNull
    private BigDecimal currentPrice;
    @NotNull
    private BigDecimal marketValue;
    @NotNull
    private BigDecimal unrealizedGainLoss;
    @NotNull
    private BigDecimal unrealizedGainLossPercent;
}
