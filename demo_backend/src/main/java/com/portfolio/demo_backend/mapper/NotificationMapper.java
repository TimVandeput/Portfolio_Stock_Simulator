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

/**
 * Maps Notification entities to API-friendly response objects.
 *
 * Resolves sender usernames and generates a short plain-text preview from the
 * HTML body for list views.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public abstract class NotificationMapper {

    @Autowired
    protected UserService userService;

    /**
     * Maps a {@link Notification} entity to a response DTO. Sender name is resolved from the user service.
     * Also produces a short plain-text preview from the HTML body.
     */
    @Mapping(target = "id", source = "id")
    @Mapping(target = "senderName", source = "senderUserId", qualifiedByName = "mapSenderName")
    @Mapping(target = "receiverUserId", source = "receiverUserId")
    @Mapping(target = "subject", source = "subject")
    @Mapping(target = "body", source = "body")
    @Mapping(target = "preview", source = "body", qualifiedByName = "createPreview")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "read", source = "read")
    public abstract NotificationResponse toDTO(Notification notification);

    /**
     * Bulk mapping convenience for lists.
     */
    public abstract List<NotificationResponse> toDTOList(List<Notification> notifications);

    /**
     * Resolves a sender username from an ID. Returns fallback labels when missing/unknown.
     */
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

    /**
     * Creates a 100-char plain-text preview by stripping HTML from the body.
     */
    @Named("createPreview")
    protected String createPreview(String body) {
        if (body == null || body.trim().isEmpty()) {
            return "";
        }
        String cleaned = body.replaceAll("<[^>]*>", "").trim();
        if (cleaned.length() <= 100) {
            return cleaned;
        }
        return cleaned.substring(0, 97) + "...";
    }
}
