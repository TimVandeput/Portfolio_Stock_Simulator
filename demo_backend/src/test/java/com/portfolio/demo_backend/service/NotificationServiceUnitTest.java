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

/**
 * Unit tests for {@link NotificationService} focusing on sending and marking
 * notifications.
 *
 * Includes class/method Javadoc and Given/When/Then inline comments.
 */
@ExtendWith(MockitoExtension.class)
class NotificationServiceUnitTest {

    @Mock
    NotificationRepository notificationRepository;

    @Mock
    UserRepository userRepository;

    @InjectMocks
    NotificationService notificationService;

    private User user;

    /**
     * Given a user fixture for tests.
     */
    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);
        user.setUsername("u1");
    }

    /**
     * Given receiver exists
     * When sendToUser is invoked with subject and body
     * Then notification is saved and returned
     */
    @Test
    void sendToUser_savesNotification() {
        when(userRepository.existsById(1L)).thenReturn(true);
        Notification n = new Notification(0L, 1L, "S", "B");
        when(notificationRepository.save(any())).thenReturn(n);

        // When
        Notification saved = notificationService.sendToUser(0L, 1L, "S", "B");

        // Then
        assertThat(saved).isNotNull();
        verify(notificationRepository).save(any(Notification.class));
    }

    /**
     * Given a stored notification
     * When markAsRead is called
     * Then it becomes read and is persisted
     */
    @Test
    void markAsRead_marksNotificationAndSaves() {
        Notification n = new Notification(0L, 1L, "S", "B");
        n.setId(5L);
        when(notificationRepository.findById(5L)).thenReturn(java.util.Optional.of(n));
        when(notificationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        // When
        notificationService.markAsRead(5L);

        // Then
        assertThat(n.isRead()).isTrue();
        verify(notificationRepository).save(n);
    }

    /**
     * Given an unknown id
     * When markAsRead is invoked
     * Then NotificationNotFoundException is thrown
     */
    @Test
    void markAsRead_unknownId_throws() {
        when(notificationRepository.findById(999L)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> notificationService.markAsRead(999L))
                .isInstanceOf(NotificationNotFoundException.class);
    }

    /**
     * Given a non-existing receiver id
     * When sendToUser is called
     * Then UserNotFoundException is thrown and nothing is saved
     */
    @Test
    void sendToUser_unknownReceiver_throwsUserNotFound() {
        when(userRepository.existsById(123L)).thenReturn(false);

        assertThatThrownBy(() -> notificationService.sendToUser(0L, 123L, "S", "B"))
                .isInstanceOf(UserNotFoundException.class);
        verify(notificationRepository, never()).save(any());
    }

    /**
     * Given an existing receiver
     * When sendToUser is called with a blank subject
     * Then EmptyNotificationSubjectException is thrown
     */
    @Test
    void sendToUser_blankSubject_throwsInvalidContent() {
        when(userRepository.existsById(1L)).thenReturn(true);

        assertThatThrownBy(() -> notificationService.sendToUser(0L, 1L, "  ", "B"))
                .isInstanceOf(EmptyNotificationSubjectException.class);
    }
}
