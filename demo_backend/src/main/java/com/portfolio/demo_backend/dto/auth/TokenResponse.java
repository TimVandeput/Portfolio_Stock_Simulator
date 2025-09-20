package com.portfolio.demo_backend.dto.auth;

import lombok.Data;

@Data
public class TokenResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";

    public TokenResponse(String access, String refresh) {
        this.accessToken = access;
        this.refreshToken = refresh;
    }
}
