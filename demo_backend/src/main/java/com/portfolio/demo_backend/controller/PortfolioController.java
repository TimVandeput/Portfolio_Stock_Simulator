package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.portfolio.PortfolioHoldingResponseDTO;
import com.portfolio.demo_backend.dto.portfolio.PortfolioResponseDTO;
import com.portfolio.demo_backend.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/{userId}")
    public ResponseEntity<PortfolioResponseDTO> getUserPortfolio(@PathVariable Long userId) {
        PortfolioResponseDTO portfolio = portfolioService.getUserPortfolio(userId);
        return ResponseEntity.ok(portfolio);
    }

    @GetMapping("/{userId}/holdings/{symbol}")
    public ResponseEntity<PortfolioHoldingResponseDTO> getUserHolding(
            @PathVariable Long userId,
            @PathVariable String symbol) {
        PortfolioHoldingResponseDTO holding = portfolioService.getUserHolding(userId, symbol);
        return ResponseEntity.ok(holding);
    }
}
