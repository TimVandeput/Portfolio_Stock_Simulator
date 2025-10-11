package com.portfolio.demo_backend.dto.auth;

import java.util.Set;

import com.portfolio.demo_backend.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Authentication response returned by login/refresh endpoints.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    @NotBlank
    private String accessToken;
    @NotBlank
    private String refreshToken;
    @NotBlank
    private String tokenType;
    @NotNull
    private Long userId;
    @NotBlank
    private String username;
    @NotEmpty
    private Set<Role> roles;
    @NotNull
    private Role authenticatedAs;
}
