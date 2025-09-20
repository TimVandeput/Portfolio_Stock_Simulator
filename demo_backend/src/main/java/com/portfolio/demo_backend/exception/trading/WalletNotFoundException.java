package com.portfolio.demo_backend.exception.trading;

public class WalletNotFoundException extends RuntimeException {
    public WalletNotFoundException(String username) {
        super("Wallet not found for user: " + username);
    }
}
