package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.notification.NotificationResponse;
import com.portfolio.demo_backend.model.Notification;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class NotificationMapper {
    public Notification toEntity(Long senderUserId, Long receiverUserId, String subject, String body) {
        return new Notification(senderUserId, receiverUserId, subject, body);
    }

    public NotificationResponse toDTO(Notification n) {
        NotificationResponse dto = new NotificationResponse();
        dto.setId(n.getId());
        dto.setSenderUserId(n.getSenderUserId());
        dto.setReceiverUserId(n.getReceiverUserId());
        dto.setSubject(n.getSubject());
        dto.setBody(n.getBody());
        dto.setCreatedAt(n.getCreatedAt());
        dto.setRead(n.isRead());
        return dto;
    }

    public List<NotificationResponse> toDTOList(List<Notification> list) {
        return list.stream().map(this::toDTO).collect(Collectors.toList());
    }
}
