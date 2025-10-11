package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.auth.RegisterRequest;
import com.portfolio.demo_backend.service.data.RegistrationData;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.enums.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.portfolio.demo_backend.security.JwtService;

import java.util.EnumSet;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link AuthService} covering registration behavior.
 *
 * Conventions applied:
 * - Class-level and method-level Javadoc
 * - Inline Given/When/Then comments for test flow
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserService userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthService authService;

    /**
     * Verifies that registering a new user creates the user and returns
     * registration data.
     *
     * Given a valid register request and userService saving successfully
     * When register is invoked
     * Then the created user is passed with correct fields and a non-null response
     * is returned
     */
    @Test
    void register_createsUserSuccessfully() {
        // Given: a valid registration request and mocked persistence result
        RegisterRequest req = new RegisterRequest();
        req.setUsername("newuser");
        req.setEmail("test@example.com");
        req.setPassword("Password1");

        User saved = User.builder()
                .id(10L)
                .username("newuser")
                .email("test@example.com")
                .roles(EnumSet.of(Role.ROLE_USER))
                .build();

        when(userService.createUser(any(User.class))).thenReturn(saved);

        // When: performing registration
        RegistrationData resp = authService.register(req);

        // Then: user is persisted with expected attributes and response contains
        // created id
        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userService).createUser(captor.capture());

        User passed = captor.getValue();
        assertThat(passed.getEmail()).isEqualTo("test@example.com");
        assertThat(resp).isNotNull();
        assertThat(resp.id()).isEqualTo(10L);
    }
}
