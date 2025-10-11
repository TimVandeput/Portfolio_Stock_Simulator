package com.portfolio.demo_backend.dto.notification;

import java.time.Instant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Notification view model returned by the API layer.
 */
@Data
public class NotificationResponse {
    @NotNull
    private Long id;

    private String senderName;

    @NotNull
    private Long receiverUserId;
    @NotBlank
    private String subject;
    @NotBlank
    private String body;

    private String preview;

    @NotNull
    private Instant createdAt;
    @NotNull
    private boolean read;
}
