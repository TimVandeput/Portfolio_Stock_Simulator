package com.portfolio.demo_backend.dto.portfolio;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioHoldingResponseDTO {
    @NotBlank
    private String symbol;
    @NotNull
    private Integer quantity;
    @NotNull
    private BigDecimal avgCostBasis;
    @NotNull
    private BigDecimal totalCost;
    private String lastTradeDate;
}
