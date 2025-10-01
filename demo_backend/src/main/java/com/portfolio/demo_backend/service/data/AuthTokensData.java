package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.model.enums.Role;

import java.util.Set;

public record AuthTokensData(
        String accessToken,
        String refreshToken,
        String tokenType,
        String username,
        Set<Role> roles,
        Role authenticatedAs) {
}
