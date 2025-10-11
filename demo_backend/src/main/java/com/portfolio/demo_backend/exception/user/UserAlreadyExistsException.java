package com.portfolio.demo_backend.exception.user;

/**
 * Thrown when attempting to create a user with a username that is already
 * taken.
 */
public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String username) {
        super("Username: " + username + " already exists");
    }
}
