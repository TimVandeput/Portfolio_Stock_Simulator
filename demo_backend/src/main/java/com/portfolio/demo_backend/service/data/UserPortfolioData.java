package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Wallet;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Aggregated view of a user's portfolio state combining holdings, wallet cash
 * and precomputed totals used by the portfolio endpoints.
 */
@Data
@AllArgsConstructor
public class UserPortfolioData {
    @NotEmpty
    @Valid
    private final List<Portfolio> portfolios;
    @NotNull
    @Valid
    private final Wallet wallet;
    @NotNull
    private final BigDecimal totalInvested;
    @NotNull
    private final BigDecimal totalValue;
    @NotNull
    private final BigDecimal totalPL;
}
