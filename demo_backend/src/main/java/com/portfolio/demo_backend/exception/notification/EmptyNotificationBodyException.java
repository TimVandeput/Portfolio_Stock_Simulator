package com.portfolio.demo_backend.exception.notification;

public class EmptyNotificationBodyException extends RuntimeException {
    public EmptyNotificationBodyException() {
        super("Body must not be blank");
    }
}
