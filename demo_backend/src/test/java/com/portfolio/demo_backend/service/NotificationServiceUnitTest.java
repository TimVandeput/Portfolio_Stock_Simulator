package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.Notification;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.repository.NotificationRepository;
import com.portfolio.demo_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceUnitTest {

    @Mock
    NotificationRepository notificationRepository;

    @Mock
    UserRepository userRepository;

    @InjectMocks
    NotificationService notificationService;

    private User user;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);
        user.setUsername("u1");
    }

    @Test
    void sendToUser_savesNotification() {
        Notification n = new Notification(0L, 1L, "S", "B");
        when(notificationRepository.save(any())).thenReturn(n);

        Notification saved = notificationService.sendToUser(0L, 1L, "S", "B");

        assertThat(saved).isNotNull();
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void sendToRole_createsForEachUser() {
        User a = new User();
        a.setId(2L);
        User b = new User();
        b.setId(3L);
        when(userRepository.findByRole(Role.ROLE_ADMIN)).thenReturn(List.of(a, b));
        when(notificationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        List<Notification> created = notificationService.sendToRole(0L, Role.ROLE_ADMIN, "S", "B");

        assertThat(created).hasSize(2);
        verify(userRepository).findByRole(Role.ROLE_ADMIN);
    }

    @Test
    void sendToRole_noUsers_returnsEmptyAndSavesNothing() {
        when(userRepository.findByRole(Role.ROLE_ADMIN)).thenReturn(List.of());

        List<Notification> created = notificationService.sendToRole(0L, Role.ROLE_ADMIN, "S", "B");

        assertThat(created).isEmpty();
        verify(notificationRepository, never()).save(any());
    }

    @Test
    void sendToAllUsers_createsForEachUser() {
        User a = new User();
        a.setId(2L);
        User b = new User();
        b.setId(3L);
        when(userRepository.findAll()).thenReturn(List.of(a, b));
        when(notificationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        List<Notification> created = notificationService.sendToAllUsers(0L, "S", "B");

        assertThat(created).hasSize(2);
        verify(userRepository).findAll();
    }

    @Test
    void markAsRead_marksNotificationAndSaves() {
        Notification n = new Notification(0L, 1L, "S", "B");
        n.setId(5L);
        when(notificationRepository.findById(5L)).thenReturn(java.util.Optional.of(n));
        when(notificationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        notificationService.markAsRead(5L);

        assertThat(n.isRead()).isTrue();
        verify(notificationRepository).save(n);
    }
}
