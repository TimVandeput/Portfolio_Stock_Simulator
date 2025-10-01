package com.portfolio.demo_backend.dto.notification;

import java.time.Instant;

import lombok.Data;

@Data
public class NotificationResponse {
    private Long id;
    private Long senderUserId;
    private Long receiverUserId;
    private String subject;
    private String body;
    private Instant createdAt;
    private boolean read;
}
