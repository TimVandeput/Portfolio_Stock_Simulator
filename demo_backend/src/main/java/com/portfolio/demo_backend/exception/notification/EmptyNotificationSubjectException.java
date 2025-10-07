package com.portfolio.demo_backend.exception.notification;

/**
 * Indicates that a notification subject was blank or missing.
 */
public class EmptyNotificationSubjectException extends RuntimeException {
    public EmptyNotificationSubjectException() {
        super("Subject must not be blank");
    }
}
