package com.portfolio.demo_backend.dto.notification;

import com.portfolio.demo_backend.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendRoleNotificationRequest {
    @NotNull
    private Long senderUserId;
    @NotNull
    private Role role;
    @NotBlank
    private String subject;
    @NotBlank
    private String body;

}
