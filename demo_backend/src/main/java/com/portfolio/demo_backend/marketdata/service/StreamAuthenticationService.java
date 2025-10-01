package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.security.JwtService;
import com.portfolio.demo_backend.marketdata.service.data.StreamAuthData;
import com.portfolio.demo_backend.exception.marketdata.StreamAuthenticationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StreamAuthenticationService {

    private final JwtService jwtService;

    public String validateToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            throw new StreamAuthenticationException("Token is required");
        }

        try {
            String username = jwtService.extractUsername(token);
            if (username == null || username.trim().isEmpty()) {
                throw new StreamAuthenticationException("Invalid token");
            }
            return username;
        } catch (StreamAuthenticationException e) {
            throw e;
        } catch (Exception e) {
            throw new StreamAuthenticationException("Token validation failed");
        }
    }

    public StreamAuthData createStreamAuthData(String token, Long userId, List<String> subscribedSymbols) {
        String username = validateToken(token);
        return StreamAuthData.of(username, token, userId, subscribedSymbols);
    }

    public boolean isValidStreamAuth(StreamAuthData authData) {
        if (authData == null) {
            return false;
        }

        try {
            validateToken(authData.token());
            return true;
        } catch (StreamAuthenticationException e) {
            return false;
        }
    }
}
