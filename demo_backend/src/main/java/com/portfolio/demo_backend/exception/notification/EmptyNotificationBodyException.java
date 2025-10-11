package com.portfolio.demo_backend.exception.notification;

/**
 * Indicates that a notification body was blank or missing.
 */
public class EmptyNotificationBodyException extends RuntimeException {
    public EmptyNotificationBodyException() {
        super("Body must not be blank");
    }
}
