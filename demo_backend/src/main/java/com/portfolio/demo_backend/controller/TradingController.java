package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.trading.BuyOrderRequest;
import com.portfolio.demo_backend.dto.trading.PortfolioSummaryDTO;
import com.portfolio.demo_backend.dto.trading.SellOrderRequest;
import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.model.Transaction;
import com.portfolio.demo_backend.service.TradingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/trades")
@RequiredArgsConstructor
@Slf4j
@Validated
public class TradingController {

    private final TradingService tradingService;

    @PostMapping("/buy")
    public ResponseEntity<TradeExecutionResponse> executeBuyOrder(
            @Valid @RequestBody BuyOrderRequest request,
            Authentication authentication) {

        log.info("Received buy order request: {}", request);

        String username = authentication.getName();
        TradeExecutionResponse response = tradingService.executeBuyOrder(request, username);

        log.info("Buy order executed successfully for user: {}", username);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sell")
    public ResponseEntity<TradeExecutionResponse> executeSellOrder(
            @Valid @RequestBody SellOrderRequest request,
            Authentication authentication) {

        log.info("Received sell order request: {}", request);

        String username = authentication.getName();
        TradeExecutionResponse response = tradingService.executeSellOrder(request, username);

        log.info("Sell order executed successfully for user: {}", username);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/portfolio")
    public ResponseEntity<PortfolioSummaryDTO> getPortfolioSummary(Authentication authentication) {
        log.info("Received portfolio summary request");

        String username = authentication.getName();
        PortfolioSummaryDTO summary = tradingService.getPortfolioSummary(username);

        log.info("Portfolio summary retrieved successfully for user: {}", username);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Transaction>> getTransactionHistory(Authentication authentication) {
        log.info("Received transaction history request");

        String username = authentication.getName();
        List<Transaction> history = tradingService.getTransactionHistory(username);

        log.info("Transaction history retrieved successfully for user: {}, {} transactions",
                username, history.size());
        return ResponseEntity.ok(history);
    }
}
