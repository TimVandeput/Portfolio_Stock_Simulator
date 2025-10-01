package com.portfolio.demo_backend.dto.notification;

import java.time.Instant;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationResponse {
    @NotNull
    private Long id;
    @NotNull
    private Long senderUserId;
    @NotNull
    private Long receiverUserId;
    @NotBlank
    private String subject;
    @NotBlank
    private String body;
    @NotNull
    private Instant createdAt;
    @NotNull
    private boolean read;
}
