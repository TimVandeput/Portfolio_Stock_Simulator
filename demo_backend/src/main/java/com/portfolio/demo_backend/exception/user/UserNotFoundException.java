package com.portfolio.demo_backend.exception.user;

/**
 * Raised when the requested user entity cannot be found by id or username.
 */
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("User not found with id: " + id);
    }

    public UserNotFoundException(String username) {
        super("Username: " + username + " not found");
    }
}
