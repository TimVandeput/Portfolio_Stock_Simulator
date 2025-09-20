package com.portfolio.demo_backend.dto.trading;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

import com.portfolio.demo_backend.model.enums.TransactionType;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TradeExecutionResponse {

    private String message;
    private String symbol;
    private Integer quantity;
    private BigDecimal executionPrice;
    private BigDecimal totalAmount;
    private TransactionType transactionType;
    private Instant executedAt;
    private BigDecimal newCashBalance;
    private Integer newSharesOwned;
}
