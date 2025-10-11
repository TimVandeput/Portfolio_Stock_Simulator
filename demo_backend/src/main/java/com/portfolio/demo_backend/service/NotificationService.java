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

/**
 * Application service for user-to-user notifications.
 * <p>
 * Responsibilities:
 * - Validate input and existence of receiver user
 * - Create and persist {@link com.portfolio.demo_backend.model.Notification}
 * entities
 * - Retrieve notifications ordered by creation time and mark them as read
 * <p>
 * Transactionality: write operations are transactional; read operations are
 * read-only.
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    /**
     * Sends a notification from one user to another and persists it.
     *
     * @param senderUserId   the sender's user id (may be a system user)
     * @param receiverUserId the receiver's user id; must exist
     * @param subject        non-blank subject line
     * @param body           non-blank body (HTML allowed)
     * @return the persisted {@link Notification}
     * @throws com.portfolio.demo_backend.exception.user.UserNotFoundException if the receiver user id is unknown
     * @throws com.portfolio.demo_backend.exception.notification.EmptyNotificationSubjectException if the subject is blank
     * @throws com.portfolio.demo_backend.exception.notification.EmptyNotificationBodyException if the body is blank
     */
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

    /**
     * Returns the user's notifications ordered by newest first.
     *
     * @param userId the user id
     * @return list of notifications for the user, newest first (empty if none)
     */
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByReceiverUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Marks the notification as read.
     *
     * @param notificationId the notification id
     * @throws NotificationNotFoundException if the notification doesn't exist
     */
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotificationNotFoundException(notificationId));
        n.setRead(true);
        notificationRepository.save(n);
    }
}
