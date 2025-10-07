package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for {@link Notification} entities.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    /**
     * Returns notifications for a receiver ordered newest-first.
     *
     * @param receiverUserId the user receiving notifications
     * @return ordered list (may be empty)
     */
    List<Notification> findByReceiverUserIdOrderByCreatedAtDesc(Long receiverUserId);

}
