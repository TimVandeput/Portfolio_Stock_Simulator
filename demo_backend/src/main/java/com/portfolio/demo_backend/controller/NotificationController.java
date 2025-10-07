package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.notification.NotificationResponse;
import com.portfolio.demo_backend.dto.notification.SendNotificationRequest;
import com.portfolio.demo_backend.dto.notification.SendRoleNotificationRequest;
import com.portfolio.demo_backend.mapper.NotificationMapper;
import com.portfolio.demo_backend.model.Notification;
import com.portfolio.demo_backend.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;

    @PostMapping("/user/{receiverUserId}")
    public ResponseEntity<NotificationResponse> sendToUser(
            @PathVariable Long receiverUserId,
            @Valid @RequestBody SendNotificationRequest request) {
        Notification created = notificationService.sendToUser(request.getSenderUserId(), receiverUserId,
                request.getSubject(), request.getBody());
        return ResponseEntity.ok(notificationMapper.toDTO(created));
    }

    @PostMapping("/role")
    public ResponseEntity<List<NotificationResponse>> sendToRole(
            @Valid @RequestBody SendRoleNotificationRequest request) {
        List<Notification> created = notificationService.sendToRole(request.getSenderUserId(), request.getRole(),
                request.getSubject(), request.getBody());
        return ResponseEntity.ok(notificationMapper.toDTOList(created));
    }

    @PostMapping("/all")
    public ResponseEntity<List<NotificationResponse>> sendToAll(
            @Valid @RequestBody SendNotificationRequest request) {
        List<Notification> created = notificationService.sendToAllUsers(request.getSenderUserId(),
                request.getSubject(), request.getBody());
        return ResponseEntity.ok(notificationMapper.toDTOList(created));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationMapper.toDTOList(notificationService.getNotificationsForUser(userId)));
    }

    @PostMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.noContent().build();
    }
}
