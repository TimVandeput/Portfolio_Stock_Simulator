package com.portfolio.demo_backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request body for refreshing access tokens using a refresh token.
 */
@Data
public class RefreshRequest {
    @NotBlank
    private String refreshToken;
}
