package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.auth.AuthResponse;
import com.portfolio.demo_backend.dto.auth.LoginRequest;
import com.portfolio.demo_backend.dto.auth.RefreshRequest;
import com.portfolio.demo_backend.dto.auth.RegisterRequest;
import com.portfolio.demo_backend.dto.auth.RegistrationResponse;
import com.portfolio.demo_backend.exception.auth.InvalidCredentialsException;
import com.portfolio.demo_backend.exception.auth.InvalidRefreshTokenException;
import com.portfolio.demo_backend.exception.auth.RoleNotAssignedException;
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
    private PasscodeService passcodeService;
    private JwtService jwtService;
    private RefreshTokenService refreshTokenService;

    private AuthService authService;

    @BeforeEach
    void setup() {
        userService = mock(UserService.class);
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        passcodeService = mock(PasscodeService.class);
        jwtService = mock(JwtService.class);
        refreshTokenService = mock(RefreshTokenService.class);
        authService = new AuthService(
                userService, userRepository, passwordEncoder, passcodeService, jwtService, refreshTokenService);
    }

    private static User user(String username, Set<Role> roles, String hashedPwd) {
        return User.builder()
                .id(42L)
                .username(username)
                .password(hashedPwd)
                .roles(roles)
                .build();
    }

    @Test
    void register_valid_passcode_creates_user_with_both_roles_and_returns_registration_response() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername(" tim  ");
        req.setPassword("Pass1234");
        req.setPasscode("ItWorks123");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        when(userService.createUser(userCaptor.capture()))
                .thenReturn(user("tim", EnumSet.of(Role.ROLE_USER, Role.ROLE_ADMIN), "$2a..."));

        RegistrationResponse out = authService.register(req);

        verify(passcodeService).validate("ItWorks123");

        User createdArg = userCaptor.getValue();
        assertThat(createdArg.getUsername()).isEqualTo("tim");
        assertThat(createdArg.getRoles()).containsExactlyInAnyOrder(Role.ROLE_USER, Role.ROLE_ADMIN);

        assertThat(out.getId()).isEqualTo(42L);
        assertThat(out.getUsername()).isEqualTo("tim");
        assertThat(out.getRoles()).containsExactlyInAnyOrder(Role.ROLE_USER, Role.ROLE_ADMIN);
    }

    @Test
    void login_happy_path_checks_password_role_and_returns_tokens() {
        LoginRequest req = new LoginRequest();
        req.setUsername("alice");
        req.setPassword("Plain123");
        req.setChosenRole("user");

        User u = user("alice", EnumSet.of(Role.ROLE_USER, Role.ROLE_ADMIN), "$2aHash");
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("Plain123", "$2aHash")).thenReturn(true);
        when(jwtService.generateAccessToken("alice", Role.ROLE_USER)).thenReturn("jwt-access");
        when(refreshTokenService.create(u)).thenReturn(
                RefreshToken.builder().token("refresh-1").user(u).build());

        AuthResponse out = authService.login(req);

        assertThat(out.getAccessToken()).isEqualTo("jwt-access");
        assertThat(out.getRefreshToken()).isEqualTo("refresh-1");
        assertThat(out.getTokenType()).isEqualTo("Bearer");
        assertThat(out.getUsername()).isEqualTo("alice");
        assertThat(out.getRoles()).contains(Role.ROLE_USER, Role.ROLE_ADMIN);
        assertThat(out.getAuthenticatedAs()).isEqualTo(Role.ROLE_USER);
    }

    @Test
    void login_throws_InvalidCredentials_when_user_not_found() {
        LoginRequest req = new LoginRequest();
        req.setUsername("ghost");
        req.setPassword("x");
        req.setChosenRole("USER");

        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void login_throws_InvalidCredentials_when_password_mismatch() {
        LoginRequest req = new LoginRequest();
        req.setUsername("bob");
        req.setPassword("wrong");
        req.setChosenRole("ADMIN");

        User u = user("bob", EnumSet.of(Role.ROLE_ADMIN), "$2aHash");
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("wrong", "$2aHash")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void login_throws_RoleNotAssigned_when_role_not_present() {
        LoginRequest req = new LoginRequest();
        req.setUsername("carol");
        req.setPassword("Pass1234");
        req.setChosenRole("ADMIN");

        User u = user("carol", EnumSet.of(Role.ROLE_USER), "$2aHash");
        when(userRepository.findByUsername("carol")).thenReturn(Optional.of(u));
        when(passwordEncoder.matches("Pass1234", "$2aHash")).thenReturn(true);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(RoleNotAssignedException.class);
    }

    @Test
    void refresh_success_rotates_and_returns_new_tokens_authenticated_as_user() {
        RefreshRequest req = new RefreshRequest();
        req.setRefreshToken("old");

        User u = user("dave", EnumSet.of(Role.ROLE_USER, Role.ROLE_ADMIN), "$2aHash");

        RefreshToken old = RefreshToken.builder().token("old").user(u).build();
        RefreshToken fresh = RefreshToken.builder().token("new").user(u).build();

        when(refreshTokenService.validateUsable("old")).thenReturn(old);
        when(refreshTokenService.rotate(old)).thenReturn(fresh);
        when(jwtService.generateAccessToken("dave", Role.ROLE_USER)).thenReturn("access-new");

        AuthResponse out = authService.refresh(req);

        assertThat(out.getAccessToken()).isEqualTo("access-new");
        assertThat(out.getRefreshToken()).isEqualTo("new");
        assertThat(out.getAuthenticatedAs()).isEqualTo(Role.ROLE_USER);
        assertThat(out.getUsername()).isEqualTo("dave");
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
