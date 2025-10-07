package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.Notification;
import com.portfolio.demo_backend.repository.NotificationRepository;
import com.portfolio.demo_backend.repository.UserRepository;
import com.portfolio.demo_backend.exception.notification.NotificationNotFoundException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.exception.notification.EmptyNotificationSubjectException;
import com.portfolio.demo_backend.exception.notification.EmptyNotificationBodyException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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
        if (!StringUtils.hasText(subject)) {
            throw new EmptyNotificationSubjectException();
        }
        if (!StringUtils.hasText(body)) {
            throw new EmptyNotificationBodyException();
        }
        Notification n = Notification.create(senderUserId, receiverUserId, subject, body);
        return notificationRepository.save(n);
    }

    @Transactional(readOnly = true)
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByReceiverUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));
        n.setRead(true);
        notificationRepository.save(n);
    }
}
