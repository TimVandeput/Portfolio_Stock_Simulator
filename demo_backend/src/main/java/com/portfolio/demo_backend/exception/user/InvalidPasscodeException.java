package com.portfolio.demo_backend.exception.user;

public class InvalidPasscodeException extends RuntimeException {
    public InvalidPasscodeException() {
        super("Invalid or missing passcode.");
    }
}
