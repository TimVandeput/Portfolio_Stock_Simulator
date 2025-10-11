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

/**
 * Authentication service orchestrating user registration and token issuance.
 * <p>
 * Responsibilities:
 * - Register new users (delegates to {@link UserService})
 * - Authenticate credentials and produce access/refresh token pairs
 * - Refresh and revoke tokens
 * - Send onboarding notifications (best-effort; failures are logged and do not affect flow)
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final NotificationService notificationService;

    /**
     * Registers a new user and sends a welcome notification.
     *
     * @param req registration payload
     * @return minimal registration data for response mapping
     * @throws com.portfolio.demo_backend.exception.user.UserAlreadyExistsException if username exists
     * @throws com.portfolio.demo_backend.exception.user.EmailAlreadyExistsException if email exists
     * @throws com.portfolio.demo_backend.exception.user.WeakPasswordException if password policy fails
     */
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

    /**
     * Validates credentials and returns tokens and user context.
     *
     * @param req login payload
     * @return tokens + user metadata
     * @throws InvalidCredentialsException if user not found or password mismatch
     */
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

    /**
     * Exchanges a refresh token for a new access token and (optionally) a rotated
     * refresh token.
     * <p>
     * Rotation policy: if the remaining lifetime is <= 25% of its total lifetime,
     * a new refresh token is issued and the old one is revoked; otherwise the same
     * refresh token is returned.
     *
     * @param req refresh token request
     * @return new token tuple
     * @throws InvalidRefreshTokenException if validation fails
     */
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

    /**
     * Revokes the supplied refresh token if present. No-op if the token is unknown.
     */
    public void logout(RefreshRequest req) {
        refreshTokenService.revoke(req.getRefreshToken());
    }

    /**
     * Sends a best-effort welcome notification to the specified user. Errors are
     * logged and ignored so registration flow is unaffected.
     *
     * @param user newly registered user
     */
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

    /**
     * Returns the ID of a system/admin user to be used as the notification sender.
     * If no admin exists, falls back to {@code 1L}.
     *
     * @return system/admin user id
     */
    private Long getOrCreateSystemUser() {
        return userRepository.findByRole(Role.ROLE_ADMIN)
                .stream()
                .findFirst()
                .map(User::getId)
                .orElse(1L);
    }
}
