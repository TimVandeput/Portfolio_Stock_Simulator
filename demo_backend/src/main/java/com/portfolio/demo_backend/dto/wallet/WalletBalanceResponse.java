package com.portfolio.demo_backend.dto.wallet;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WalletBalanceResponse {
    private BigDecimal cashBalance;
    private BigDecimal marketValue;
    private BigDecimal totalValue;
}
