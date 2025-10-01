package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record AuthTokensData(
        @NotBlank String accessToken,
        @NotBlank String refreshToken,
        @NotBlank String tokenType,
        @NotNull Long userId,
        @NotBlank String username,
        @NotEmpty Set<Role> roles,
        @NotNull Role authenticatedAs) {
}
