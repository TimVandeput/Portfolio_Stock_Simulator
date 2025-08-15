package com.portfolio.demo_backend.exception.user;

public class WeakPasswordException extends RuntimeException {
    public WeakPasswordException() {
        super("Password must be 8–128 characters and contain at least one letter and one number.");
    }
}
