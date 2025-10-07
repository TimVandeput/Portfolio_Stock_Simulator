package com.portfolio.demo_backend.dto.trading;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank
    private String message;
    @NotBlank
    private String symbol;
    @NotNull
    private Integer quantity;
    @NotNull
    private BigDecimal executionPrice;
    @NotNull
    private BigDecimal totalAmount;
    @NotNull
    private TransactionType transactionType;
    @NotNull
    private Instant executedAt;
    @NotNull
    private BigDecimal newCashBalance;
    @NotNull
    private Integer newSharesOwned;
}
