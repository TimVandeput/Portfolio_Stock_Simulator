package com.portfolio.demo_backend.dto.trading;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioSummaryDTO {

    @NotNull
    private BigDecimal cashBalance;
    @NotNull
    private BigDecimal totalMarketValue;
    @NotNull
    private BigDecimal totalPortfolioValue;
    @NotNull
    private BigDecimal totalUnrealizedGainLoss;
    @NotNull
    private BigDecimal totalUnrealizedGainLossPercent;
    @NotEmpty
    @Valid
    private List<PortfolioHoldingDTO> holdings;
}
