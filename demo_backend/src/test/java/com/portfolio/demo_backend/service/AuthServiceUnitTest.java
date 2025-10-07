package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.service.data.AuthTokensData;
import com.portfolio.demo_backend.dto.auth.LoginRequest;
import com.portfolio.demo_backend.dto.auth.RefreshRequest;
import com.portfolio.demo_backend.dto.auth.RegisterRequest;
import com.portfolio.demo_backend.service.data.RegistrationData;
import com.portfolio.demo_backend.exception.auth.InvalidCredentialsException;
import com.portfolio.demo_backend.exception.auth.InvalidRefreshTokenException;
import com.portfolio.demo_backend.model.RefreshToken;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.repository.UserRepository;
import com.portfolio.demo_backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.EnumSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
/**
 * Unit tests for {@link AuthService} covering registration, login, refresh,
 * logout and notification side-effects, with error mapping and validation.
 */
class AuthServiceUnitTest {

    private UserService userService;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private RefreshTokenService refreshTokenService;
    private NotificationService notificationService;

    private AuthService authService;

    @BeforeEach
    void setup() {
        userService = mock(UserService.class);
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        refreshTokenService = mock(RefreshTokenService.class);
        notificationService = mock(NotificationService.class);
        authService = new AuthService(
                userService, userRepository, passwordEncoder, jwtService, refreshTokenService, notificationService);
    }

    private static User user(String username, String email, Set<Role> roles, String hashedPwd) {
        return User.builder()
                .id(42L)
                .username(username)
                .email(email)
                .password(hashedPwd)
                .roles(roles)
                .build();
    }

    /**
     * Registers a new user and returns registration data.
     */
    @Test
    void register_creates_user_with_both_roles_and_returns_registration_response() {
        // Given
        RegisterRequest req = new RegisterRequest();
        req.setUsername(" tim  ");
        req.setEmail("tim@example.com");
        req.setPassword("Pass1234");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        when(userService.createUser(userCaptor.capture()))
                .thenReturn(user("tim", "tim@example.com", EnumSet.of(Role.ROLE_USER), "$2a..."));

        // When
        RegistrationData out = authService.register(req);

        // Then
        User createdArg = userCaptor.getValue();
        assertThat(createdArg.getUsername()).isEqualTo("tim");
        assertThat(createdArg.getEmail()).isEqualTo("tim@example.com");
        assertThat(createdArg.getRoles()).containsExactlyInAnyOrder(Role.ROLE_USER);

        assertThat(out.id()).isEqualTo(42L);
        assertThat(out.username()).isEqualTo("tim");
        assertThat(out.roles()).containsExactlyInAnyOrder(Role.ROLE_USER);
    }

    /**
     * Logs in a user, validates password, and returns tokens.
     */
    @Test
    void login_happy_path_checks_password_and_returns_tokens() {
        // Given
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("alice");
        req.setPassword("Plain123");

        User u = user("alice", "alice@example.com", EnumSet.of(Role.ROLE_USER), "$2aHash");
        when(userRepository.findByUsernameOrEmail("alice")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("Plain123", "$2aHash")).thenReturn(true);
        when(jwtService.generateAccessToken("alice", 42L, Role.ROLE_USER)).thenReturn("jwt-access");
        when(refreshTokenService.create(u)).thenReturn(
                RefreshToken.builder().token("refresh-1").user(u).build());

        // When
        AuthTokensData out = authService.login(req);

        // Then
        assertThat(out.accessToken()).isEqualTo("jwt-access");
        assertThat(out.refreshToken()).isEqualTo("refresh-1");
        assertThat(out.tokenType()).isEqualTo("Bearer");
        assertThat(out.username()).isEqualTo("alice");
        assertThat(out.roles()).contains(Role.ROLE_USER);
        assertThat(out.authenticatedAs()).isEqualTo(Role.ROLE_USER);
    }

    /**
     * Throws InvalidCredentialsException when username/email not found.
     */
    @Test
    void login_throws_InvalidCredentials_when_user_not_found() {
        // Given
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("ghost");
        req.setPassword("x");

        when(userRepository.findByUsernameOrEmail("ghost")).thenReturn(Optional.empty());

        // When/Then
        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    /**
     * Throws InvalidCredentialsException when password mismatches stored hash.
     */
    @Test
    void login_throws_InvalidCredentials_when_password_mismatch() {
        // Given
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("bob");
        req.setPassword("wrong");

        User u = user("bob", "bob@example.com", EnumSet.of(Role.ROLE_ADMIN), "$2aHash");
        when(userRepository.findByUsernameOrEmail("bob")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("wrong", "$2aHash")).thenReturn(false);

        // When/Then
        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    /**
     * Rotates refresh token and generates new access token, authenticating as user.
     */
    @Test
    void refresh_success_rotates_and_returns_new_tokens_authenticated_as_user() {
        // Given
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("old");

        User u = user("dave", "dave@example.com", EnumSet.of(Role.ROLE_USER, Role.ROLE_ADMIN), "$2aHash");

        RefreshToken old = RefreshToken.builder().token("old").user(u).build();
        RefreshToken fresh = RefreshToken.builder().token("new").user(u).build();

        when(refreshTokenService.validateUsable("old")).thenReturn(old);
        when(refreshTokenService.rotate(old)).thenReturn(fresh);
        when(jwtService.generateAccessToken("dave", 42L, Role.ROLE_USER)).thenReturn("access-new");

        // When
        AuthTokensData out = authService.refresh(req);

        // Then
        assertThat(out.accessToken()).isEqualTo("access-new");
        assertThat(out.refreshToken()).isEqualTo("new");
        assertThat(out.authenticatedAs()).isEqualTo(Role.ROLE_USER);
        assertThat(out.username()).isEqualTo("dave");
        verify(refreshTokenService).rotate(old);
    }

    /**
     * Maps IllegalArgumentException to InvalidRefreshTokenException.
     */
    @Test
    void refresh_maps_IllegalArgument_to_InvalidRefreshTokenException() {
        // Given
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("bad");

        when(refreshTokenService.validateUsable("bad"))
                .thenThrow(new IllegalArgumentException("nope"));

        // When/Then
        assertThatThrownBy(() -> authService.refresh(req))
                .isInstanceOf(InvalidRefreshTokenException.class);
    }

    /**
     * Revokes refresh token on logout.
     */
    @Test
    void logout_revokes_refresh_token() {
        // Given
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("bye");

        // When
        authService.logout(req);

        // Then
        verify(refreshTokenService).revoke("bye");
    }

    /**
     * Sends a welcome notification after successful registration.
     */
    @Test
    void register_sendsWelcomeNotification() {
        // Given
        RegisterRequest req = new RegisterRequest();
        req.setUsername("newuser");
        req.setEmail("newuser@test.com");
        req.setPassword("password123");

        User createdUser = user("newuser", "newuser@test.com", EnumSet.of(Role.ROLE_USER), "hashedpwd");
        createdUser.setId(123L);

        when(userService.createUser(any(User.class))).thenReturn(createdUser);
        when(userRepository.findByRole(Role.ROLE_ADMIN)).thenReturn(java.util.List.of(
                user("admin", "admin@test.com", EnumSet.of(Role.ROLE_ADMIN), "adminpwd")));

        // When
        RegistrationData result = authService.register(req);

        // Then
        assertThat(result.id()).isEqualTo(123L);
        assertThat(result.username()).isEqualTo("newuser");

        verify(notificationService).sendToUser(
                anyLong(),
                eq(123L),
                eq("Welcome to Portfolio Stock Simulator! 🎉"),
                argThat(body -> body.contains("Hi newuser! Welcome to our platform!") &&
                        body.contains("<a href='/market'>Explore the Market</a>") &&
                        body.contains("<a href='/dashboard'>Your Dashboard</a>") &&
                        body.contains("Stock Simulator Team")));
    }

    /**
     * Continues registration even if notification sending fails.
     */
    @Test
    void register_notificationFails_stillRegistersUser() {
        // Given
        RegisterRequest req = new RegisterRequest();
        req.setUsername("newuser");
        req.setEmail("newuser@test.com");
        req.setPassword("password123");

        User createdUser = user("newuser", "newuser@test.com", EnumSet.of(Role.ROLE_USER), "hashedpwd");
        createdUser.setId(123L);

        when(userService.createUser(any(User.class))).thenReturn(createdUser);
        when(userRepository.findByRole(Role.ROLE_ADMIN)).thenReturn(java.util.List.of());

        doThrow(new RuntimeException("Notification failed")).when(notificationService)
                .sendToUser(anyLong(), anyLong(), anyString(), anyString());

        // When
        RegistrationData result = assertDoesNotThrow(() -> authService.register(req));

        // Then
        assertThat(result.id()).isEqualTo(123L);
        assertThat(result.username()).isEqualTo("newuser");

        verify(userService).createUser(any(User.class));
        verify(notificationService).sendToUser(anyLong(), anyLong(), anyString(), anyString());
    }

    /**
     * Falls back to system user when no admins are present for welcome message.
     */
    @Test
    void register_noAdminUsers_usesDefaultSystemUser() {
        // Given
        RegisterRequest req = new RegisterRequest();
        req.setUsername("newuser");
        req.setEmail("newuser@test.com");
        req.setPassword("password123");

        User createdUser = user("newuser", "newuser@test.com", EnumSet.of(Role.ROLE_USER), "hashedpwd");
        createdUser.setId(123L);

        when(userService.createUser(any(User.class))).thenReturn(createdUser);
        when(userRepository.findByRole(Role.ROLE_ADMIN)).thenReturn(java.util.List.of()); // No admin users

        // When
        authService.register(req);

        // Then
        verify(notificationService).sendToUser(
                eq(1L),
                eq(123L),
                anyString(),
                anyString());
    }
}
