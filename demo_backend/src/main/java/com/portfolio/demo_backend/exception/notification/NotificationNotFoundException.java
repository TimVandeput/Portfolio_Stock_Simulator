package com.portfolio.demo_backend.exception.notification;

/**
 * Thrown when a notification entity cannot be found by id.
 */
public class NotificationNotFoundException extends RuntimeException {
    public NotificationNotFoundException(Long id) {
        super("Notification not found with id: " + id);
    }
}
