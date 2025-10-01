package com.portfolio.demo_backend.exception.notification;

public class EmptyNotificationSubjectException extends RuntimeException {
    public EmptyNotificationSubjectException() {
        super("Subject must not be blank");
    }
}
