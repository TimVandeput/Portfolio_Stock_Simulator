package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.notification.NotificationResponse;
import com.portfolio.demo_backend.model.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "senderUserId", source = "senderUserId")
    @Mapping(target = "receiverUserId", source = "receiverUserId")
    @Mapping(target = "subject", source = "subject")
    @Mapping(target = "body", source = "body")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "read", source = "read")
    NotificationResponse toDTO(Notification notification);

    List<NotificationResponse> toDTOList(List<Notification> notifications);
}
