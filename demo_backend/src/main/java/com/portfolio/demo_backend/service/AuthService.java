package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.auth.AuthResponse;
import com.portfolio.demo_backend.dto.auth.LoginRequest;
import com.portfolio.demo_backend.dto.auth.RefreshRequest;
import com.portfolio.demo_backend.dto.auth.RegisterRequest;
import com.portfolio.demo_backend.dto.auth.RegistrationResponse;
import com.portfolio.demo_backend.exception.auth.InvalidCredentialsException;
import com.portfolio.demo_backend.exception.auth.InvalidRefreshTokenException;
import com.portfolio.demo_backend.model.RefreshToken;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.repository.UserRepository;
import com.portfolio.demo_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.EnumSet;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public RegistrationResponse register(RegisterRequest req) {
        User created = userService.createUser(
                User.builder()
                        .username(req.getUsername().trim())
                        .email(req.getEmail().trim().toLowerCase())
                        .password(req.getPassword())
                        .roles(EnumSet.of(Role.ROLE_USER))
                        .build());

        return new RegistrationResponse(created.getId(), created.getUsername(), created.getRoles());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsernameOrEmail(req.getUsernameOrEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        Role userRole = user.getRoles().iterator().next();

        String access = jwtService.generateAccessToken(user.getUsername(), user.getId(), userRole);
        RefreshToken refresh = refreshTokenService.create(user);
        refreshTokenService.setAuthenticatedAs(refresh.getToken(), userRole);

        return new AuthResponse(access, refresh.getToken(), "Bearer",
                user.getUsername(), user.getRoles(), userRole);
    }

    public AuthResponse refresh(RefreshRequest req) {
        final RefreshToken old;
        try {
            old = refreshTokenService.validateUsable(req.getRefreshToken());
        } catch (IllegalArgumentException ex) {
            throw new InvalidRefreshTokenException();
        }
        RefreshToken fresh = refreshTokenService.rotate(old);
        Role authenticatedAs = fresh.getAuthenticatedAs() != null ? fresh.getAuthenticatedAs() : Role.ROLE_USER;
        String access = jwtService.generateAccessToken(fresh.getUser().getUsername(), fresh.getUser().getId(),
                authenticatedAs);
        return new AuthResponse(access, fresh.getToken(), "Bearer",
                fresh.getUser().getUsername(), fresh.getUser().getRoles(), authenticatedAs);
    }

    public void logout(RefreshRequest req) {
        refreshTokenService.revoke(req.getRefreshToken());
    }
}
