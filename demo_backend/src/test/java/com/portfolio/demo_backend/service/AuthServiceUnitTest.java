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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceUnitTest {

    private UserService userService;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private RefreshTokenService refreshTokenService;

    private AuthService authService;

    @BeforeEach
    void setup() {
        userService = mock(UserService.class);
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        refreshTokenService = mock(RefreshTokenService.class);
        authService = new AuthService(
                userService, userRepository, passwordEncoder, jwtService, refreshTokenService, null);
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

    @Test
    void register_creates_user_with_both_roles_and_returns_registration_response() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername(" tim  ");
        req.setEmail("tim@example.com");
        req.setPassword("Pass1234");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        when(userService.createUser(userCaptor.capture()))
                .thenReturn(user("tim", "tim@example.com", EnumSet.of(Role.ROLE_USER), "$2a..."));

        RegistrationData out = authService.register(req);

        User createdArg = userCaptor.getValue();
        assertThat(createdArg.getUsername()).isEqualTo("tim");
        assertThat(createdArg.getEmail()).isEqualTo("tim@example.com");
        assertThat(createdArg.getRoles()).containsExactlyInAnyOrder(Role.ROLE_USER);

        assertThat(out.id()).isEqualTo(42L);
        assertThat(out.username()).isEqualTo("tim");
        assertThat(out.roles()).containsExactlyInAnyOrder(Role.ROLE_USER);
    }

    @Test
    void login_happy_path_checks_password_and_returns_tokens() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("alice");
        req.setPassword("Plain123");

        User u = user("alice", "alice@example.com", EnumSet.of(Role.ROLE_USER), "$2aHash");
        when(userRepository.findByUsernameOrEmail("alice")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("Plain123", "$2aHash")).thenReturn(true);
        when(jwtService.generateAccessToken("alice", 42L, Role.ROLE_USER)).thenReturn("jwt-access");
        when(refreshTokenService.create(u)).thenReturn(
                RefreshToken.builder().token("refresh-1").user(u).build());

        AuthTokensData out = authService.login(req);

        assertThat(out.accessToken()).isEqualTo("jwt-access");
        assertThat(out.refreshToken()).isEqualTo("refresh-1");
        assertThat(out.tokenType()).isEqualTo("Bearer");
        assertThat(out.username()).isEqualTo("alice");
        assertThat(out.roles()).contains(Role.ROLE_USER);
        assertThat(out.authenticatedAs()).isEqualTo(Role.ROLE_USER);
    }

    @Test
    void login_throws_InvalidCredentials_when_user_not_found() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("ghost");
        req.setPassword("x");

        when(userRepository.findByUsernameOrEmail("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void login_throws_InvalidCredentials_when_password_mismatch() {
        LoginRequest req = new LoginRequest();
        req.setUsernameOrEmail("bob");
        req.setPassword("wrong");

        User u = user("bob", "bob@example.com", EnumSet.of(Role.ROLE_ADMIN), "$2aHash");
        when(userRepository.findByUsernameOrEmail("bob")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("wrong", "$2aHash")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void refresh_success_rotates_and_returns_new_tokens_authenticated_as_user() {
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("old");

        User u = user("dave", "dave@example.com", EnumSet.of(Role.ROLE_USER, Role.ROLE_ADMIN), "$2aHash");

        RefreshToken old = RefreshToken.builder().token("old").user(u).build();
        RefreshToken fresh = RefreshToken.builder().token("new").user(u).build();

        when(refreshTokenService.validateUsable("old")).thenReturn(old);
        when(refreshTokenService.rotate(old)).thenReturn(fresh);
        when(jwtService.generateAccessToken("dave", 42L, Role.ROLE_USER)).thenReturn("access-new");

        AuthTokensData out = authService.refresh(req);

        assertThat(out.accessToken()).isEqualTo("access-new");
        assertThat(out.refreshToken()).isEqualTo("new");
        assertThat(out.authenticatedAs()).isEqualTo(Role.ROLE_USER);
        assertThat(out.username()).isEqualTo("dave");
        verify(refreshTokenService).rotate(old);
    }

    @Test
    void refresh_maps_IllegalArgument_to_InvalidRefreshTokenException() {
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("bad");

        when(refreshTokenService.validateUsable("bad"))
                .thenThrow(new IllegalArgumentException("nope"));

        assertThatThrownBy(() -> authService.refresh(req))
                .isInstanceOf(InvalidRefreshTokenException.class);
    }

    @Test
    void logout_revokes_refresh_token() {
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("bye");

        authService.logout(req);

        verify(refreshTokenService).revoke("bye");
    }
}
