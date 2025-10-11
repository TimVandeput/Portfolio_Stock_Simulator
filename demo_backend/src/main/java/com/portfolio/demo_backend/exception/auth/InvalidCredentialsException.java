package com.portfolio.demo_backend.exception.auth;

/**
 * Thrown when a user attempts to authenticate with an invalid username/password
 * combination.
 */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Invalid credentials.");
    }
}