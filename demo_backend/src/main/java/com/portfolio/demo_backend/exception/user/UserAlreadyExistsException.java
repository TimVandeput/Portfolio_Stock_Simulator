package com.portfolio.demo_backend.exception.user;

public class UserAlreadyExistsException extends RuntimeException {
    public UserAlreadyExistsException(String username) {
        super("Username: " + username + " already exists");
    }
}
