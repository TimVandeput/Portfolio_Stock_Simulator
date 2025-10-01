package com.portfolio.demo_backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_user_id", nullable = false)
    private Long senderUserId;

    @Column(name = "receiver_user_id")
    private Long receiverUserId;

    @Column(name = "subject")
    private String subject;

    @Column(name = "body", columnDefinition = "TEXT")
    private String body;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    public Notification() {
        this.createdAt = Instant.now();
    }

    public Notification(Long senderUserId, Long receiverUserId, String subject, String body) {
        this.senderUserId = senderUserId;
        this.receiverUserId = receiverUserId;
        this.subject = subject;
        this.body = body;
        this.createdAt = Instant.now();
        this.read = false;
    }
}
