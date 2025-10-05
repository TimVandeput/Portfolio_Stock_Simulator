package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.notification.NotificationResponse;
import com.portfolio.demo_backend.model.Notification;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.service.UserService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class NotificationMapper {

    @Autowired
    protected UserService userService;

    @Mapping(target = "id", source = "id")
    @Mapping(target = "senderName", source = "senderUserId", qualifiedByName = "mapSenderName")
    @Mapping(target = "receiverUserId", source = "receiverUserId")
    @Mapping(target = "subject", source = "subject")
    @Mapping(target = "body", source = "body")
    @Mapping(target = "preview", source = "body", qualifiedByName = "createPreview")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "read", source = "read")
    public abstract NotificationResponse toDTO(Notification notification);

    public abstract List<NotificationResponse> toDTOList(List<Notification> notifications);

    @Named("mapSenderName")
    protected String mapSenderName(Long senderUserId) {
        if (senderUserId == null) {
            return "System";
        }

        try {
            User sender = userService.getUserById(senderUserId);
            return sender.getUsername();
        } catch (Exception e) {
            return "Unknown User";
        }
    }

    @Named("createPreview")
    protected String createPreview(String body) {
        if (body == null || body.trim().isEmpty()) {
            return "";
        }
        String cleaned = body.replaceAll("<[^>]*>", "").trim(); // Remove HTML tags
        if (cleaned.length() <= 100) {
            return cleaned;
        }
        return cleaned.substring(0, 97) + "...";
    }
}
