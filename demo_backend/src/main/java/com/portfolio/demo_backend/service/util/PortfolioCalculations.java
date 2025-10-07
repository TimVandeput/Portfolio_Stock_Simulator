package com.portfolio.demo_backend.service.util;

import com.portfolio.demo_backend.model.Portfolio;

import java.math.BigDecimal;
import java.util.List;

public final class PortfolioCalculations {

    private PortfolioCalculations() {
    }

    public static BigDecimal calculateTotalInvested(List<Portfolio> portfolios) {
        if (portfolios == null || portfolios.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return portfolios.stream()
                .map(p -> p.getAverageCostBasis().multiply(BigDecimal.valueOf(p.getSharesOwned())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
