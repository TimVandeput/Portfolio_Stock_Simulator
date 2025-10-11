package com.portfolio.demo_backend.dto.trading;

import com.portfolio.demo_backend.model.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * API response DTO describing a single trade transaction with computed totals
 * and timestamp.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionDTO {
    @NotNull
    private Long id;
    @NotNull
    private Long userId;
    @NotNull
    private TransactionType type;
    @NotBlank
    private String symbol;
    @NotBlank
    private String symbolName;
    @NotNull
    private Integer quantity;
    @NotNull
    private BigDecimal pricePerShare;
    @NotNull
    private BigDecimal totalAmount;
    private BigDecimal profitLoss;
    @NotNull
    private Instant executedAt;
}
