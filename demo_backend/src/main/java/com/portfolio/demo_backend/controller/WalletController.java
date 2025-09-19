package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.wallet.WalletBalanceResponse;
import com.portfolio.demo_backend.service.TradingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
@Slf4j
public class WalletController {

    private final TradingService tradingService;

    @GetMapping("/balance")
    public ResponseEntity<WalletBalanceResponse> getWalletBalance(Authentication authentication) {
        log.info("Received wallet balance request");

        try {
            String username = authentication.getName();
            var summary = tradingService.getPortfolioSummary(username);

            WalletBalanceResponse response = new WalletBalanceResponse(
                    summary.getCashBalance(),
                    summary.getTotalMarketValue(),
                    summary.getTotalPortfolioValue());

            log.info("Wallet balance retrieved successfully for user: {}", username);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Failed to get wallet balance: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
