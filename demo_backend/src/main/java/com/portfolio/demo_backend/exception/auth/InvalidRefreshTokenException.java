package com.portfolio.demo_backend.exception.auth;

/**
 * Indicates a refresh token provided by the client is invalid, expired or
 * revoked during token refresh or logout flows.
 */
public class InvalidRefreshTokenException extends RuntimeException {
    public InvalidRefreshTokenException(String message) {
        super(message);
    }

    public InvalidRefreshTokenException() {
        super("Invalid, expired, or revoked refresh token.");
    }
}