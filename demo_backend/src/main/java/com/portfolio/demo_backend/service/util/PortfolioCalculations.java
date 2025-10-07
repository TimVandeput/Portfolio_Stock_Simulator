package com.portfolio.demo_backend.service.util;

import com.portfolio.demo_backend.model.Portfolio;

import java.math.BigDecimal;
import java.util.List;

/**
 * Utility methods for portfolio-related numeric calculations.
 */
public final class PortfolioCalculations {

    private PortfolioCalculations() {
    }

    /**
     * Sums average cost basis times shares for all positions; returns 0 for null/empty input.
     *
     * @param portfolios list of portfolio positions (may be null)
     * @return total invested amount
     */
    public static BigDecimal calculateTotalInvested(List<Portfolio> portfolios) {
        if (portfolios == null || portfolios.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return portfolios.stream()
                .map(p -> p.getAverageCostBasis().multiply(BigDecimal.valueOf(p.getSharesOwned())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
