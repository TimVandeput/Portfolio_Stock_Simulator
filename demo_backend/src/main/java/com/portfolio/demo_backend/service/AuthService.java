package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.auth.LoginRequest;
import com.portfolio.demo_backend.dto.auth.RefreshRequest;
import com.portfolio.demo_backend.dto.auth.RegisterRequest;
import com.portfolio.demo_backend.exception.auth.InvalidCredentialsException;
import com.portfolio.demo_backend.exception.auth.InvalidRefreshTokenException;
import com.portfolio.demo_backend.model.RefreshToken;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.repository.UserRepository;
import com.portfolio.demo_backend.security.JwtService;
import com.portfolio.demo_backend.service.data.AuthTokensData;
import com.portfolio.demo_backend.service.data.RegistrationData;
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
    private final NotificationService notificationService;

    public RegistrationData register(RegisterRequest req) {
        User created = userService.createUser(
                User.builder()
                        .username(req.getUsername().trim())
                        .email(req.getEmail().trim().toLowerCase())
                        .password(req.getPassword())
                        .roles(EnumSet.of(Role.ROLE_USER))
                        .build());

        sendWelcomeNotification(created);

        return new RegistrationData(created.getId(), created.getUsername(), created.getRoles());
    }

    public AuthTokensData login(LoginRequest req) {
        User user = userRepository.findByUsernameOrEmail(req.getUsernameOrEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        Role userRole = user.getRoles().iterator().next();

        String access = jwtService.generateAccessToken(user.getUsername(), user.getId(), userRole);
        RefreshToken refresh = refreshTokenService.create(user);
        refreshTokenService.setAuthenticatedAs(refresh.getToken(), userRole);

        return new AuthTokensData(access, refresh.getToken(), "Bearer",
                user.getId(), user.getUsername(), user.getRoles(), userRole);
    }

    public AuthTokensData refresh(RefreshRequest req) {
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
        return new AuthTokensData(access, fresh.getToken(), "Bearer",
                fresh.getUser().getId(), fresh.getUser().getUsername(), fresh.getUser().getRoles(), authenticatedAs);
    }

    public void logout(RefreshRequest req) {
        refreshTokenService.revoke(req.getRefreshToken());
    }

    private void sendWelcomeNotification(User user) {
        String welcomeSubject = "Welcome to Portfolio Stock Simulator! 🎉";
        String welcomeBody = String.format(
                "Hi %s! Welcome to our platform! 🎉<br><br>" +
                        "We're excited to have you on board. Here are some great places to get started:<br><br>" +
                        "📈 <a href='/market'>Explore the Market</a> - Discover and buy your first stocks<br>" +
                        "💼 <a href='/dashboard'>Your Dashboard</a> - View your portfolio and performance<br>" +
                        "💰 <a href='/trading'>Start Trading</a> - Make your first trades<br>" +
                        "ℹ️ <a href='/about'>Learn About Us</a> - Understand how our platform works<br>" +
                        "❓ <a href='/help'>Need Help?</a> - Find answers to common questions<br><br>" +
                        "Happy trading! 🚀<br><br>" +
                        "Best regards,<br>" +
                        "<strong>Stock Simulator Team</strong>",
                user.getUsername());

        try {
            Long systemUserId = getOrCreateSystemUser();
            notificationService.sendToUser(systemUserId, user.getId(), welcomeSubject, welcomeBody);
        } catch (Exception e) {
            System.err.println(
                    "Failed to send welcome notification to user " + user.getUsername() + ": " + e.getMessage());
        }
    }

    private Long getOrCreateSystemUser() {
        return userRepository.findByRole(Role.ROLE_ADMIN)
                .stream()
                .findFirst()
                .map(User::getId)
                .orElse(1L);
    }
}
