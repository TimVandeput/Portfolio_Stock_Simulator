package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.wallet.WalletBalanceResponse;
import com.portfolio.demo_backend.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Wallet endpoints to retrieve balances.
 */
@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor

public class WalletController {

    private final WalletService walletService;

    /**
     * Get the current wallet balance for a user.
     */
    @GetMapping("/{userId}/balance")
    public ResponseEntity<WalletBalanceResponse> getWalletBalance(@PathVariable Long userId) {
        WalletBalanceResponse balance = walletService.getWalletBalance(userId);
        return ResponseEntity.ok(balance);
    }
}
