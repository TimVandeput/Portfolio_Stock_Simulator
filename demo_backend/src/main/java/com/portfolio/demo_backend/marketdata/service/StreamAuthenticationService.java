package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.security.JwtService;
import com.portfolio.demo_backend.marketdata.service.data.StreamAuthData;
import com.portfolio.demo_backend.exception.marketdata.StreamAuthenticationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * Service for authenticating websocket stream sessions using JWT access tokens.
 */
@Service
@RequiredArgsConstructor
public class StreamAuthenticationService {

    private final JwtService jwtService;

    /**
     * Validates the token and returns the username encoded in it.
     *
     * @param token bearer token
     * @return username
     * @throws StreamAuthenticationException if token is missing or invalid
     */
    public String validateToken(String token) {
        if (!StringUtils.hasText(token)) {
            throw new StreamAuthenticationException("Token is required");
        }

        try {
            String username = jwtService.extractUsername(token);
            if (!StringUtils.hasText(username)) {
                throw new StreamAuthenticationException("Invalid token");
            }
            return username;
        } catch (StreamAuthenticationException e) {
            throw e;
        } catch (Exception e) {
            throw new StreamAuthenticationException("Token validation failed");
        }
    }

    /**
     * Builds a {@link StreamAuthData} after validation.
     */
    public StreamAuthData createStreamAuthData(String token, Long userId, List<String> subscribedSymbols) {
        String username = validateToken(token);
        return StreamAuthData.of(username, token, userId, subscribedSymbols);
    }

    /**
     * Lightweight validity check for stream auth container.
     */
    public boolean isValidStreamAuth(StreamAuthData authData) {
        if (ObjectUtils.isEmpty(authData)) {
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
