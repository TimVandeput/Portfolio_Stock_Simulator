package com.portfolio.demo_backend.dto.wallet;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO reporting wallet cash and derived totals.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class WalletBalanceResponse {
    @NotNull
    private BigDecimal cashBalance;
    @NotNull
    private BigDecimal marketValue;
    @NotNull
    private BigDecimal totalValue;
}
