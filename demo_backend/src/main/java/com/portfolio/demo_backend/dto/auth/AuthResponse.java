package com.portfolio.demo_backend.dto.auth;

import java.util.Set;

import com.portfolio.demo_backend.model.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private String username;
    private Set<Role> roles;
    private Role authenticatedAs;
}
