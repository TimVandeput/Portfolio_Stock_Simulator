package com.portfolio.demo_backend.exception.trading;

/**
 * Thrown when a user's wallet balance is lower than the amount required to
 * execute a trade or withdrawal.
 */
public class InsufficientFundsException extends RuntimeException {
    public InsufficientFundsException(String username, String required, String available) {
        super(String.format("Insufficient funds for user '%s'. Required: %s, Available: %s",
                username, required, available));
    }
}
