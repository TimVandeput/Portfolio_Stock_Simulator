package com.portfolio.demo_backend.exception.user;

/**
 * Thrown when attempting to register or update to an email address that is
 * already associated with another account.
 */
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String email) {
        super("Email already exists: " + email);
    }
}
