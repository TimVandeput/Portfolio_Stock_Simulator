package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverUserIdOrderByCreatedAtDesc(Long receiverUserId);

    List<Notification> findByReceiverUserIdAndReadFalseOrderByCreatedAtDesc(Long receiverUserId);

    List<Notification> findBySenderUserIdOrderByCreatedAtDesc(Long senderUserId);

}
