package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.Notification;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.repository.NotificationRepository;
import com.portfolio.demo_backend.repository.UserRepository;
import com.portfolio.demo_backend.exception.notification.NotificationNotFoundException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.exception.notification.EmptyNotificationSubjectException;
import com.portfolio.demo_backend.exception.notification.EmptyNotificationBodyException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public Notification sendToUser(Long senderUserId, Long receiverUserId, String subject, String body) {
        if (!userRepository.existsById(receiverUserId)) {
            throw new UserNotFoundException(receiverUserId);
        }
        if (subject == null || subject.isBlank()) {
            throw new EmptyNotificationSubjectException();
        }
        if (body == null || body.isBlank()) {
            throw new EmptyNotificationBodyException();
        }
        Notification n = Notification.create(senderUserId, receiverUserId, subject, body);
        return notificationRepository.save(n);
    }

    @Transactional
    public List<Notification> sendToRole(Long senderUserId, Role role, String subject, String body) {
        if (subject == null || subject.isBlank()) {
            throw new EmptyNotificationSubjectException();
        }
        if (body == null || body.isBlank()) {
            throw new EmptyNotificationBodyException();
        }
        java.util.List<com.portfolio.demo_backend.model.User> users = userRepository.findByRole(role);
        List<Notification> created = new ArrayList<>();
        for (com.portfolio.demo_backend.model.User u : users) {
            Notification per = Notification.create(senderUserId, u.getId(), subject, body);
            created.add(notificationRepository.save(per));
        }

        return created;
    }

    @Transactional
    public List<Notification> sendToAllUsers(Long senderUserId, String subject, String body) {
        if (subject == null || subject.isBlank()) {
            throw new EmptyNotificationSubjectException();
        }
        if (body == null || body.isBlank()) {
            throw new EmptyNotificationBodyException();
        }
        java.util.List<com.portfolio.demo_backend.model.User> users = userRepository.findAll();
        List<Notification> created = new ArrayList<>();
        for (com.portfolio.demo_backend.model.User u : users) {
            Notification per = Notification.create(senderUserId, u.getId(), subject, body);
            created.add(notificationRepository.save(per));
        }
        return created;
    }

    @Transactional(readOnly = true)
    public List<Notification> getNotificationsForUser(Long userId) {
        List<Notification> out = new ArrayList<>();
        out.addAll(notificationRepository.findByReceiverUserIdOrderByCreatedAtDesc(userId));
        return out;
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));
        n.setRead(true);
        notificationRepository.save(n);
    }
}
