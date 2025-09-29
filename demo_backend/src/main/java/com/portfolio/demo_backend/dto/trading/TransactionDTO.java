package com.portfolio.demo_backend.dto.trading;

import com.portfolio.demo_backend.model.enums.TransactionType;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDTO {
    private Long id;
    private Long userId;
    private TransactionType type;
    private String symbol;
    private String symbolName;
    private Integer quantity;
    private BigDecimal pricePerShare;
    private BigDecimal totalAmount;
    private BigDecimal profitLoss;
    private Instant executedAt;
}
