package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.notification.NotificationResponse;
import com.portfolio.demo_backend.model.Notification;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
/**
 * Unit tests for {@link NotificationMapper} verifying mapping from
 * {@link com.portfolio.demo_backend.model.Notification} to
 * {@link com.portfolio.demo_backend.dto.notification.NotificationResponse},
 * including sender name resolution and preview generation.
 */
class NotificationMapperTest {

    @Mock
    private UserService userService;

    private NotificationMapper notificationMapper;

    @BeforeEach
    void setUp() {
        notificationMapper = new NotificationMapperImpl();
        ReflectionTestUtils.setField(notificationMapper, "userService", userService);
    }

    /**
     * Maps all fields correctly including preview truncation and sender name
     * resolution.
     */
    @Test
    void toDTO_mapsAllFieldsCorrectly() {
        // Given: Sender user exists and a populated notification
        User sender = new User();
        sender.setId(1L);
        sender.setUsername("john_doe");
        when(userService.getUserById(1L)).thenReturn(sender);

        Notification notification = new Notification();
        notification.setId(123L);
        notification.setSenderUserId(1L);
        notification.setReceiverUserId(456L);
        notification.setSubject("Test Subject");
        notification.setBody(
                "This is a test notification with some content that should be truncated if it's too long for the preview.");
        notification.setCreatedAt(Instant.parse("2025-10-06T10:15:30.00Z"));
        notification.setRead(false);

        // When: Mapping to DTO
        NotificationResponse result = notificationMapper.toDTO(notification);

        // Then: All fields and preview are mapped correctly
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(123L);
        assertThat(result.getSenderName()).isEqualTo("john_doe");
        assertThat(result.getReceiverUserId()).isEqualTo(456L);
        assertThat(result.getSubject()).isEqualTo("Test Subject");
        assertThat(result.getBody()).isEqualTo(
                "This is a test notification with some content that should be truncated if it's too long for the preview.");
        assertThat(result.getPreview()).isEqualTo(
                "This is a test notification with some content that should be truncated if it's too long for the p...");
        assertThat(result.getCreatedAt()).isEqualTo(Instant.parse("2025-10-06T10:15:30.00Z"));
        assertThat(result.isRead()).isFalse();

        verify(userService).getUserById(1L);
    }

    /**
     * Maps to "System" sender when senderUserId is null, without calling
     * userService.
     */
    @Test
    void toDTO_nullSenderUserId_returnsSystemSender() {
        // Given: Notification without sender user id
        Notification notification = new Notification();
        notification.setId(123L);
        notification.setSenderUserId(null);
        notification.setReceiverUserId(456L);
        notification.setSubject("System Notification");
        notification.setBody("System message");
        notification.setCreatedAt(Instant.now());
        notification.setRead(true);

        // When: Mapping to DTO
        NotificationResponse result = notificationMapper.toDTO(notification);

        // Then: Sender is set to System and no userService call made
        assertThat(result.getSenderName()).isEqualTo("System");
        verifyNoInteractions(userService);
    }

    /**
     * Maps to "Unknown User" sender when userService throws exception looking up
     * sender.
     */
    @Test
    void toDTO_userServiceThrowsException_returnsUnknownUser() {
        // Given: userService throws when looking up sender
        when(userService.getUserById(999L)).thenThrow(new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setId(123L);
        notification.setSenderUserId(999L);
        notification.setReceiverUserId(456L);
        notification.setSubject("Test");
        notification.setBody("Test");
        notification.setCreatedAt(Instant.now());
        notification.setRead(false);

        // When: Mapping to DTO
        NotificationResponse result = notificationMapper.toDTO(notification);

        // Then: Sender name falls back to Unknown User
        assertThat(result.getSenderName()).isEqualTo("Unknown User");
        verify(userService).getUserById(999L);
    }

    /**
     * Cleans HTML tags from body in preview, but leaves body intact.
     */
    @Test
    void toDTO_bodyWithHtmlTags_previewCleansHtml() {
        // Given: Body contains HTML and sender exists
        User sender = new User();
        sender.setUsername("admin");
        when(userService.getUserById(1L)).thenReturn(sender);

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setSenderUserId(1L);
        notification.setReceiverUserId(2L);
        notification.setSubject("HTML Test");
        notification.setBody(
                "Welcome to our platform! <br><br>Here are some links:<br>• <a href='/dashboard'>Dashboard</a><br>• <strong>Important!</strong>");
        notification.setCreatedAt(Instant.now());
        notification.setRead(false);

        // When: Mapping to DTO
        NotificationResponse result = notificationMapper.toDTO(notification);

        // Then: Body remains as is, preview strips HTML and truncates
        assertThat(result.getBody()).contains("<br>").contains("<a href").contains("<strong>");
        assertThat(result.getPreview())
                .isEqualTo("Welcome to our platform! Here are some links:• Dashboard• Important!");
        assertThat(result.getPreview()).doesNotContain("<").doesNotContain(">");
    }

    /**
     * If body is shorter than 100 chars, preview equals body without ellipsis.
     */
    @Test
    void toDTO_shortBody_previewEqualsBody() {
        // Given: Short body and sender exists
        User sender = new User();
        sender.setUsername("user1");
        when(userService.getUserById(1L)).thenReturn(sender);

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setSenderUserId(1L);
        notification.setReceiverUserId(2L);
        notification.setSubject("Short");
        notification.setBody("Short message");
        notification.setCreatedAt(Instant.now());
        notification.setRead(false);

        // When: Mapping to DTO
        NotificationResponse result = notificationMapper.toDTO(notification);

        // Then: Preview equals full body without ellipsis
        assertThat(result.getPreview()).isEqualTo("Short message");
        assertThat(result.getPreview()).doesNotContain("...");
    }

    /**
     * If body is empty, preview is also empty string.
     */
    @Test
    void toDTO_emptyBody_emptyPreview() {
        // Given: Empty body and sender exists
        User sender = new User();
        sender.setUsername("user1");
        when(userService.getUserById(1L)).thenReturn(sender);

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setSenderUserId(1L);
        notification.setReceiverUserId(2L);
        notification.setSubject("Empty Body");
        notification.setBody("");
        notification.setCreatedAt(Instant.now());
        notification.setRead(false);

        // When: Mapping to DTO
        NotificationResponse result = notificationMapper.toDTO(notification);

        // Then: Empty preview string
        assertThat(result.getPreview()).isEmpty();
    }

    /**
     * Maps a list of notifications correctly, resolving sender names.
     */
    @Test
    void toDTOList_mapsAllNotifications() {
        // Given: Two notifications with different senders
        User sender1 = new User();
        sender1.setUsername("user1");
        User sender2 = new User();
        sender2.setUsername("user2");

        when(userService.getUserById(1L)).thenReturn(sender1);
        when(userService.getUserById(2L)).thenReturn(sender2);

        Notification notification1 = new Notification();
        notification1.setId(1L);
        notification1.setSenderUserId(1L);
        notification1.setReceiverUserId(3L);
        notification1.setSubject("First");
        notification1.setBody("First notification");
        notification1.setCreatedAt(Instant.now());
        notification1.setRead(false);

        Notification notification2 = new Notification();
        notification2.setId(2L);
        notification2.setSenderUserId(2L);
        notification2.setReceiverUserId(3L);
        notification2.setSubject("Second");
        notification2.setBody("Second notification");
        notification2.setCreatedAt(Instant.now());
        notification2.setRead(true);

        List<Notification> notifications = List.of(notification1, notification2);

        // When: Mapping list to responses
        List<NotificationResponse> result = notificationMapper.toDTOList(notifications);

        // Then: Both notifications mapped correctly with sender names
        assertThat(result).hasSize(2);
        assertThat(result.get(0).getSenderName()).isEqualTo("user1");
        assertThat(result.get(0).getSubject()).isEqualTo("First");
        assertThat(result.get(1).getSenderName()).isEqualTo("user2");
        assertThat(result.get(1).getSubject()).isEqualTo("Second");

        verify(userService).getUserById(1L);
        verify(userService).getUserById(2L);
    }
}