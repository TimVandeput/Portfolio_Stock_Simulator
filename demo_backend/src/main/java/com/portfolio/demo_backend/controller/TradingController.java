package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.trading.BuyOrderRequest;
import com.portfolio.demo_backend.dto.trading.PortfolioSummaryDTO;
import com.portfolio.demo_backend.dto.trading.SellOrderRequest;
import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.model.Transaction;
import com.portfolio.demo_backend.service.TradingService;
import com.portfolio.demo_backend.service.WalletService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/trades")
@RequiredArgsConstructor
@Validated
public class TradingController {

    private final TradingService tradingService;
    private final WalletService walletService;

    @PostMapping("/{userId}/buy")
    public ResponseEntity<TradeExecutionResponse> executeBuyOrder(
            @PathVariable Long userId,
            @Valid @RequestBody BuyOrderRequest request) {
        TradeExecutionResponse response = tradingService.executeBuyOrder(userId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{userId}/sell")
    public ResponseEntity<TradeExecutionResponse> executeSellOrder(
            @PathVariable Long userId,
            @Valid @RequestBody SellOrderRequest request) {
        TradeExecutionResponse response = tradingService.executeSellOrder(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/portfolio")
    public ResponseEntity<PortfolioSummaryDTO> getPortfolioSummary(@PathVariable Long userId) {
        PortfolioSummaryDTO summary = walletService.getPortfolioSummary(userId);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/{userId}/history")
    public ResponseEntity<List<Transaction>> getTransactionHistory(@PathVariable Long userId) {
        List<Transaction> history = tradingService.getTransactionHistory(userId);
        return ResponseEntity.ok(history);
    }
}
