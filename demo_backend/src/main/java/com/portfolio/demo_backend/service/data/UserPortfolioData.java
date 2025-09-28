package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Wallet;
import lombok.Data;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class UserPortfolioData {
    private final List<Portfolio> portfolios;
    private final Wallet wallet;
    private final BigDecimal totalInvested;
    private final BigDecimal totalValue;
    private final BigDecimal totalPL;
}
