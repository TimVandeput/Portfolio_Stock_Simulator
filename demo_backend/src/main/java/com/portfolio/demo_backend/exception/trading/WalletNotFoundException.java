package com.portfolio.demo_backend.exception.trading;

/**
 * Thrown when a wallet for the given user cannot be located during trading or
 * balance operations.
 */
public class WalletNotFoundException extends RuntimeException {
    public WalletNotFoundException(String username) {
        super("Wallet not found for user: " + username);
    }
}
