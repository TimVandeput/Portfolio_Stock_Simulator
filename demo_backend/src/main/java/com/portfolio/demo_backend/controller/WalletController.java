package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.wallet.AddCashRequest;
import com.portfolio.demo_backend.dto.wallet.WalletBalanceResponse;
import com.portfolio.demo_backend.mapper.TradingMapper;
import com.portfolio.demo_backend.mapper.WalletMapper;
import com.portfolio.demo_backend.service.WalletService;
import com.portfolio.demo_backend.service.data.PortfolioSummaryData;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;
    private final WalletMapper walletMapper;

    @GetMapping("/{userId}/balance")
    public ResponseEntity<WalletBalanceResponse> getWalletBalance(@PathVariable Long userId) {
        WalletBalanceResponse balance = walletService.getWalletBalance(userId);
        return ResponseEntity.ok(balance);
    }

    @PostMapping("/{userId}/add-cash")
    public ResponseEntity<WalletBalanceResponse> addCash(
            @PathVariable Long userId,
            @Valid @RequestBody AddCashRequest request) {

        walletService.addCashToWallet(userId, request.getAmount(), request.getReason());

        PortfolioSummaryData summaryData = walletService.getPortfolioSummary(userId);
        var summaryDTO = TradingMapper.toPortfolioSummaryDTO(summaryData.getWallet(), summaryData.getPositions(),
                summaryData.getCurrentPrices());

        return ResponseEntity.ok(walletMapper.toWalletBalanceResponse(summaryDTO));
    }
}
