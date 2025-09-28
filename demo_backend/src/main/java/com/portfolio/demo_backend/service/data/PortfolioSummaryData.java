package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Wallet;
import lombok.Data;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class PortfolioSummaryData {
    private final Wallet wallet;
    private final List<Portfolio> positions;
    private final Map<String, BigDecimal> currentPrices;
}
