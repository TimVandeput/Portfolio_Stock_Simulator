package com.portfolio.demo_backend.exception.trading;

public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String username, String required, String available) {
        super(String.format("Insufficient funds for user '%s'. Required: %s, Available: %s", 
              username, required, available));
    }
}
