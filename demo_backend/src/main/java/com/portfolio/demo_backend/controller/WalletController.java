package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.wallet.WalletBalanceResponse;
import com.portfolio.demo_backend.service.TradingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final TradingService tradingService;

    @GetMapping("/{userId}/balance")
    public ResponseEntity<WalletBalanceResponse> getWalletBalance(@PathVariable Long userId) {
        var summary = tradingService.getPortfolioSummary(userId);

        return ResponseEntity.ok(new WalletBalanceResponse(
                summary.getCashBalance(),
                summary.getTotalMarketValue(),
                summary.getTotalPortfolioValue()));
    }
}
