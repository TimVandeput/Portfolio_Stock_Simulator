package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.portfolio.PortfolioHoldingResponseDTO;
import com.portfolio.demo_backend.dto.portfolio.PortfolioResponseDTO;
import com.portfolio.demo_backend.mapper.PortfolioDtoMapper;
import com.portfolio.demo_backend.service.PortfolioService;
import com.portfolio.demo_backend.service.data.UserPortfolioData;
import com.portfolio.demo_backend.service.data.UserHoldingData;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Portfolio read-only endpoints for aggregated portfolio views and holdings.
 */
@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor

public class PortfolioController {

    private final PortfolioService portfolioService;
    private final PortfolioDtoMapper portfolioDtoMapper;

    /**
     * Get an aggregated portfolio view for the user, including holdings, wallet
     * snapshot and summary metrics.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<PortfolioResponseDTO> getUserPortfolio(@PathVariable Long userId) {
        UserPortfolioData portfolioData = portfolioService.getUserPortfolio(userId);

        var holdings = portfolioDtoMapper.toHoldings(portfolioData.getPortfolios());

        var walletBalance = portfolioDtoMapper.toWalletBalanceDTO(portfolioData.getWallet(),
                portfolioData.getTotalInvested());

        var summary = portfolioDtoMapper.toPortfolioSummaryDetailsDTO(portfolioData.getTotalValue());

        PortfolioResponseDTO portfolio = portfolioDtoMapper.toPortfolioResponseDTO(holdings, walletBalance, summary);
        return ResponseEntity.ok(portfolio);
    }

    /**
     * Get a single holding for the given user and symbol. Returns an empty
     * placeholder DTO if no holding exists.
     */
    @GetMapping("/{userId}/holdings/{symbol}")
    public ResponseEntity<PortfolioHoldingResponseDTO> getUserHolding(
            @PathVariable Long userId,
            @PathVariable String symbol) {
        UserHoldingData holdingData = portfolioService.getUserHolding(userId, symbol);

        PortfolioHoldingResponseDTO holding = holdingData.isHasHolding()
                ? portfolioDtoMapper.toHolding(holdingData.getPortfolio())
                : portfolioDtoMapper.toEmptyHolding(holdingData.getSymbol());

        return ResponseEntity.ok(holding);
    }
}
