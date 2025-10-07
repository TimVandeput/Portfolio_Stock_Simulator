package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.Notification;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.exception.notification.EmptyNotificationSubjectException;
import com.portfolio.demo_backend.exception.notification.NotificationNotFoundException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.repository.NotificationRepository;
import com.portfolio.demo_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

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
        when(userRepository.existsById(1L)).thenReturn(true);
        Notification n = new Notification(0L, 1L, "S", "B");
        when(notificationRepository.save(any())).thenReturn(n);

        Notification saved = notificationService.sendToUser(0L, 1L, "S", "B");

        assertThat(saved).isNotNull();
        verify(notificationRepository).save(any(Notification.class));
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

    @Test
    void markAsRead_unknownId_throws() {
        when(notificationRepository.findById(999L)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> notificationService.markAsRead(999L))
                .isInstanceOf(NotificationNotFoundException.class);
    }

    @Test
    void sendToUser_unknownReceiver_throwsUserNotFound() {
        when(userRepository.existsById(123L)).thenReturn(false);

        assertThatThrownBy(() -> notificationService.sendToUser(0L, 123L, "S", "B"))
                .isInstanceOf(UserNotFoundException.class);
        verify(notificationRepository, never()).save(any());
    }

    @Test
    void sendToUser_blankSubject_throwsInvalidContent() {
        when(userRepository.existsById(1L)).thenReturn(true);

        assertThatThrownBy(() -> notificationService.sendToUser(0L, 1L, "  ", "B"))
                .isInstanceOf(EmptyNotificationSubjectException.class);
    }
}
