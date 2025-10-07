package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.trading.BuyOrderRequest;
import com.portfolio.demo_backend.dto.trading.SellOrderRequest;
import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.dto.trading.TransactionDTO;
import com.portfolio.demo_backend.mapper.TransactionMapper;
import com.portfolio.demo_backend.mapper.TradingMapper;
import com.portfolio.demo_backend.service.TradingService;

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
/**
 * Trading endpoints to place buy/sell orders and fetch transaction history.
 */
public class TradingController {

    private final TradingService tradingService;
    private final TransactionMapper transactionMapper;
    private final TradingMapper tradingMapper;

    /**
     * Execute a buy order for the given user.
     */
    @PostMapping("/{userId}/buy")
    public ResponseEntity<TradeExecutionResponse> executeBuyOrder(
            @PathVariable Long userId,
            @Valid @RequestBody BuyOrderRequest request) {
        var data = tradingService.executeBuy(userId, request);
        TradeExecutionResponse dto = tradingMapper.toTradeExecutionResponse(
                data.getTransaction(), data.getNewCashBalance(), data.getNewSharesOwned());
        return ResponseEntity.ok(dto);
    }

    /**
     * Execute a sell order for the given user.
     */
    @PostMapping("/{userId}/sell")
    public ResponseEntity<TradeExecutionResponse> executeSellOrder(
            @PathVariable Long userId,
            @Valid @RequestBody SellOrderRequest request) {
        var data = tradingService.executeSell(userId, request);
        TradeExecutionResponse dto = tradingMapper.toTradeExecutionResponse(
                data.getTransaction(), data.getNewCashBalance(), data.getNewSharesOwned());
        return ResponseEntity.ok(dto);
    }

    /**
     * Retrieve the user's transaction history ordered by most recent first.
     */
    @GetMapping("/{userId}/history")
    public ResponseEntity<List<TransactionDTO>> getTransactionHistory(@PathVariable Long userId) {
        List<TransactionDTO> history = transactionMapper.toDTOs(tradingService.getTransactionHistory(userId));
        return ResponseEntity.ok(history);
    }
}
