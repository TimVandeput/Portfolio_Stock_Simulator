package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.AuthResponse;
import com.portfolio.demo_backend.dto.LoginRequest;
import com.portfolio.demo_backend.dto.RefreshRequest;
import com.portfolio.demo_backend.dto.RegisterRequest;
import com.portfolio.demo_backend.dto.RegistrationResponse;
import com.portfolio.demo_backend.exception.auth.InvalidCredentialsException;
import com.portfolio.demo_backend.exception.auth.InvalidRefreshTokenException;
import com.portfolio.demo_backend.exception.auth.RoleNotAssignedException;
import com.portfolio.demo_backend.model.RefreshToken;
import com.portfolio.demo_backend.model.Role;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.repository.UserRepository;
import com.portfolio.demo_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasscodeService passcodeService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public RegistrationResponse register(RegisterRequest req) {
        passcodeService.validate(req.getPasscode());

        User created = userService.createUser(
                User.builder()
                        .username(req.getUsername().trim())
                        .password(req.getPassword())
                        .roles(EnumSet.of(Role.ROLE_USER, Role.ROLE_ADMIN))
                        .isFake(false)
                        .build());

        return new RegistrationResponse(created.getId(), created.getUsername(), created.getRoles());
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        Role chosen = parseRole(req.getChosenRole());
        if (!user.getRoles().contains(chosen)) {
            throw new RoleNotAssignedException(chosen.name());
        }

        String access = jwtService.generateAccessToken(user.getUsername(), chosen);
        RefreshToken refresh = refreshTokenService.create(user);

        return new AuthResponse(access, refresh.getToken(), "Bearer",
                user.getUsername(), user.getRoles(), chosen);
    }

    public AuthResponse refresh(RefreshRequest req) {
        final RefreshToken old;
        try {
            old = refreshTokenService.validateUsable(req.getRefreshToken());
        } catch (IllegalArgumentException ex) {
            throw new InvalidRefreshTokenException();
        }
        RefreshToken fresh = refreshTokenService.rotate(old);
        Role authenticatedAs = Role.ROLE_USER;
        String access = jwtService.generateAccessToken(fresh.getUser().getUsername(), authenticatedAs);
        return new AuthResponse(access, fresh.getToken(), "Bearer",
                fresh.getUser().getUsername(), fresh.getUser().getRoles(), authenticatedAs);
    }

    public void logout(RefreshRequest req) {
        refreshTokenService.revoke(req.getRefreshToken());
    }

    private Role parseRole(String input) {
        String norm = input.trim().toUpperCase(Locale.ROOT);
        if (!norm.startsWith("ROLE_")) {
            norm = "ROLE_" + norm;
        }
        return Role.valueOf(norm);
    }
}
