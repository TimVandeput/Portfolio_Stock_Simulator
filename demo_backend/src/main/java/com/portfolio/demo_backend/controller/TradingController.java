package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.trading.BuyOrderRequest;
import com.portfolio.demo_backend.dto.trading.PortfolioSummaryDTO;
import com.portfolio.demo_backend.dto.trading.SellOrderRequest;
import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.dto.trading.TransactionDTO;
import com.portfolio.demo_backend.mapper.TransactionMapper;
import com.portfolio.demo_backend.mapper.TradingMapper;
import com.portfolio.demo_backend.service.TradingService;
import com.portfolio.demo_backend.service.WalletService;
import com.portfolio.demo_backend.service.data.PortfolioSummaryData;

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
    private final TransactionMapper transactionMapper;
    private final TradingMapper tradingMapper;

    @PostMapping("/{userId}/buy")
    public ResponseEntity<TradeExecutionResponse> executeBuyOrder(
            @PathVariable Long userId,
            @Valid @RequestBody BuyOrderRequest request) {
        var data = tradingService.executeBuy(userId, request);
        TradeExecutionResponse dto = tradingMapper.toTradeExecutionResponse(
                data.getTransaction(), data.getNewCashBalance(), data.getNewSharesOwned());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/{userId}/sell")
    public ResponseEntity<TradeExecutionResponse> executeSellOrder(
            @PathVariable Long userId,
            @Valid @RequestBody SellOrderRequest request) {
        var data = tradingService.executeSell(userId, request);
        TradeExecutionResponse dto = tradingMapper.toTradeExecutionResponse(
                data.getTransaction(), data.getNewCashBalance(), data.getNewSharesOwned());
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{userId}/portfolio")
    public ResponseEntity<PortfolioSummaryDTO> getPortfolioSummary(@PathVariable Long userId) {
        PortfolioSummaryData summaryData = walletService.getPortfolioSummary(userId);
        PortfolioSummaryDTO summary = tradingMapper.toPortfolioSummaryDTO(summaryData.getWallet(),
                summaryData.getPositions(), summaryData.getCurrentPrices());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/{userId}/history")
    public ResponseEntity<List<TransactionDTO>> getTransactionHistory(@PathVariable Long userId) {
        List<TransactionDTO> history = transactionMapper.toDTOs(tradingService.getTransactionHistory(userId));
        return ResponseEntity.ok(history);
    }
}
