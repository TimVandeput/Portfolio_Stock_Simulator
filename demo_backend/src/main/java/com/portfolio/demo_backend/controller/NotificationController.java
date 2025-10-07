package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.notification.NotificationResponse;
import com.portfolio.demo_backend.mapper.NotificationMapper;
import com.portfolio.demo_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
/**
 * Notification endpoints for retrieving and updating user notifications.
 */
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;

    /**
     * List notifications for a user.
     *
     * @param userId target user id
     * @return list of notifications (most recent first if service applies ordering)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationMapper.toDTOList(notificationService.getNotificationsForUser(userId)));
    }

    /**
     * Mark a notification as read.
     *
     * @param notificationId id of the notification to mark read
     * @return 204 on success
     */
    @PostMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.noContent().build();
    }
}
