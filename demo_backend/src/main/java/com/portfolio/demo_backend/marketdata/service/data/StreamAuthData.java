package com.portfolio.demo_backend.marketdata.service.data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record StreamAuthData(
        @NotBlank String username,
        @NotBlank String token,
        @NotNull Long userId,
        @NotEmpty List<String> subscribedSymbols,
        @NotNull Long authenticatedAt) {
    public static StreamAuthData of(String username, String token, Long userId, List<String> subscribedSymbols) {
        return new StreamAuthData(username, token, userId, subscribedSymbols, System.currentTimeMillis());
    }
}
