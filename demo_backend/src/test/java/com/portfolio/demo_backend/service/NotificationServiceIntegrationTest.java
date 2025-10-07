package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.Notification;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.repository.NotificationRepository;
import com.portfolio.demo_backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class NotificationServiceIntegrationTest {

    @Autowired
    NotificationService notificationService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    NotificationRepository notificationRepository;

    @Test
    void sendAndFetch_notificationsPersistedAndOrdered() {
        User u1 = User.builder().username("nuser1").email("u1@x.com").password("p").roles(EnumSet.of(Role.ROLE_USER))
                .build();
        User u2 = User.builder().username("nadmin").email("a@x.com").password("p").roles(EnumSet.of(Role.ROLE_ADMIN))
                .build();
        userRepository.save(u1);
        userRepository.save(u2);

        notificationService.sendToUser(0L, u1.getId(), "sub1", "body1");
        notificationService.sendToRole(0L, Role.ROLE_ADMIN, "sub2", "body2");
        notificationService.sendToAllUsers(0L, "sub3", "body3");

        List<Notification> fetched = notificationService.getNotificationsForUser(u1.getId());
        assertThat(fetched).isNotEmpty();
        for (int i = 1; i < fetched.size(); i++) {
            assertThat(fetched.get(i - 1).getCreatedAt()).isAfterOrEqualTo(fetched.get(i).getCreatedAt());
        }
    }

    @Test
    void fetchUnread_onlyReturnsUnreadOrdered() {
        User u1 = User.builder().username("unreaduser").email("u1@x.com").password("p")
                .roles(EnumSet.of(Role.ROLE_USER))
                .build();
        userRepository.save(u1);

        Notification r = notificationService.sendToUser(0L, u1.getId(), "read", "r");
        @SuppressWarnings("unused")
        Notification u = notificationService.sendToUser(0L, u1.getId(), "unread", "u");

        notificationService.markAsRead(r.getId());

        List<Notification> unread = notificationRepository
                .findByReceiverUserIdAndReadFalseOrderByCreatedAtDesc(u1.getId());
        assertThat(unread).extracting(Notification::getSubject).containsExactly("unread");
    }

    @Test
    void notificationMapper_integrationWithUserService() {
        User sender = User.builder()
                .username("sender_user")
                .email("sender@test.com")
                .password("password")
                .roles(EnumSet.of(Role.ROLE_USER))
                .build();
        User receiver = User.builder()
                .username("receiver_user")
                .email("receiver@test.com")
                .password("password")
                .roles(EnumSet.of(Role.ROLE_USER))
                .build();

        userRepository.save(sender);
        userRepository.save(receiver);

        Notification notification = notificationService.sendToUser(
                sender.getId(),
                receiver.getId(),
                "Integration Test",
                "This is a test notification with <strong>HTML</strong> content that should be longer than 100 characters to test the preview functionality properly.");

        assertThat(notification).isNotNull();
        assertThat(notification.getSenderUserId()).isEqualTo(sender.getId());
        assertThat(notification.getReceiverUserId()).isEqualTo(receiver.getId());
        assertThat(notification.getSubject()).isEqualTo("Integration Test");
        assertThat(notification.getBody()).contains("<strong>HTML</strong>");
        assertThat(notification.isRead()).isFalse();
    }

}
