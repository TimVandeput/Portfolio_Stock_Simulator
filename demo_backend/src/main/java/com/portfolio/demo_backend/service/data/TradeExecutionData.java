package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.model.Transaction;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TradeExecutionData {
    private final Transaction transaction;
    private final BigDecimal newCashBalance;
    private final Integer newSharesOwned;

    public TradeExecutionData(Transaction transaction, BigDecimal newCashBalance, Integer newSharesOwned) {
        this.transaction = transaction;
        this.newCashBalance = newCashBalance;
        this.newSharesOwned = newSharesOwned;
    }
}
