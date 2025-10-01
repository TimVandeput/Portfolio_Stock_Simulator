package com.portfolio.demo_backend.dto.symbol;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SymbolDTO {
    @NotNull
    public Long id;
    @NotBlank
    public String symbol;
    @NotBlank
    public String name;
    public String exchange;
    public String currency;
    @NotNull
    public boolean enabled;
}
