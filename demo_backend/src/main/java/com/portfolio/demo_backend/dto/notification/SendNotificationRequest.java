package com.portfolio.demo_backend.dto.notification;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendNotificationRequest {
    @NotNull
    private Long senderUserId;

    @NotBlank
    private String subject;

    @NotBlank
    private String body;
}
