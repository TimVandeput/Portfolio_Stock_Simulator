package com.portfolio.demo_backend.dto.portfolio;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PortfolioHoldingResponseDTO {
    private String symbol;
    private Integer quantity;
    private BigDecimal avgCostBasis;
    private BigDecimal totalCost;
    private String lastTradeDate;
}
