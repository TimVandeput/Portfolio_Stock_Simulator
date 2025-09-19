package com.portfolio.demo_backend.dto.trading;

import lombok.Data;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Data
public class BuyOrderRequest {

    @NotBlank(message = "Symbol is required")
    private String symbol;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Expected price is required")
    @Min(value = 0, message = "Expected price must be positive")
    private BigDecimal expectedPrice;
}
