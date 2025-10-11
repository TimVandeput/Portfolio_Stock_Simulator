package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.auth.AuthResponse;
import com.portfolio.demo_backend.dto.auth.LoginRequest;
import com.portfolio.demo_backend.dto.auth.RefreshRequest;
import com.portfolio.demo_backend.dto.auth.RegisterRequest;
import com.portfolio.demo_backend.dto.auth.RegistrationResponse;
import com.portfolio.demo_backend.mapper.AuthMapper;
import com.portfolio.demo_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication endpoints for registration, login, token refresh and logout.
 *
 * Base path: /api/auth
 */
@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final AuthService auth;
    private final AuthMapper authMapper;

    public AuthController(AuthService auth, AuthMapper authMapper) {
        this.auth = auth;
        this.authMapper = authMapper;
    }

    /**
     * Register a new user account.
     *
     * @param req validated registration request payload
     * @return newly created user projection with id, username and roles
     */
    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegisterRequest req) {
        var data = auth.register(req);
        return ResponseEntity.ok(authMapper.toRegistrationResponse(data));
    }

    /**
     * Authenticate user credentials and issue access/refresh tokens.
     *
     * @param req validated login request
     * @return access + refresh token bundle and user context
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        var data = auth.login(req);
        return ResponseEntity.ok(authMapper.toAuthResponse(data));
    }

    /**
     * Exchange a valid refresh token for a new access token (and rotated refresh
     * token).
     *
     * @param req request containing the refresh token
     * @return refreshed token bundle
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest req) {
        var data = auth.refresh(req);
        return ResponseEntity.ok(authMapper.toAuthResponse(data));
    }

    /**
     * Revoke the provided refresh token and invalidate the session.
     *
     * @param req request containing the refresh token to revoke
     * @return 204 No Content on success
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest req) {
        auth.logout(req);
        return ResponseEntity.noContent().build();
    }
}
