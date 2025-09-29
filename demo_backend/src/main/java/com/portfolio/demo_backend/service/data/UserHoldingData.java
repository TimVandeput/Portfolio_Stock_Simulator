package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.model.Portfolio;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class UserHoldingData {
    private final Portfolio portfolio;
    private final String symbol;
    private final boolean hasHolding;
}
