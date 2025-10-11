package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

/**
 * Authentication token bundle returned after login/refresh containing access
 * and refresh tokens plus user identity and role context. Immutable record
 * used only for service-to-service data transfer.
 */
public record AuthTokensData(
        @NotBlank String accessToken,
        @NotBlank String refreshToken,
        @NotBlank String tokenType,
        @NotNull Long userId,
        @NotBlank String username,
        @NotEmpty Set<Role> roles,
        @NotNull Role authenticatedAs) {
}
