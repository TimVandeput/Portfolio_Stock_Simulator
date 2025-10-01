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

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;
    private final AuthMapper authMapper;

    public AuthController(AuthService auth, AuthMapper authMapper) {
        this.auth = auth;
        this.authMapper = authMapper;
    }

    @PostMapping("/register")
    public ResponseEntity<RegistrationResponse> register(@Valid @RequestBody RegisterRequest req) {
        var data = auth.register(req);
        return ResponseEntity.ok(authMapper.toRegistrationResponse(data));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        var data = auth.login(req);
        return ResponseEntity.ok(authMapper.toAuthResponse(data));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshRequest req) {
        var data = auth.refresh(req);
        return ResponseEntity.ok(authMapper.toAuthResponse(data));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest req) {
        auth.logout(req);
        return ResponseEntity.noContent().build();
    }
}
