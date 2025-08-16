package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.*;
import com.portfolio.demo_backend.model.RefreshToken;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.repository.UserRepository;
import com.portfolio.demo_backend.security.JwtService;
import com.portfolio.demo_backend.service.PasscodeService;
import com.portfolio.demo_backend.service.RefreshTokenService;
import com.portfolio.demo_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasscodeService passcodeService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(UserService userService,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            PasscodeService passcodeService,
            JwtService jwtService,
            RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passcodeService = passcodeService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@Valid @RequestBody RegisterRequest req) {
        passcodeService.validate(req.getPasscode());

        User created = userService.createUser(
                User.builder()
                        .username(req.getUsername().trim())
                        .password(req.getPassword())
                        .build());

        String access = jwtService.generateAccessToken(created.getUsername());
        RefreshToken refresh = refreshTokenService.create(created);
        return ResponseEntity.ok(new TokenResponse(access, refresh.getToken()));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest req) {
        User user = userRepository.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String access = jwtService.generateAccessToken(user.getUsername());
        RefreshToken refresh = refreshTokenService.create(user);
        return ResponseEntity.ok(new TokenResponse(access, refresh.getToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(@Valid @RequestBody RefreshRequest req) {
        RefreshToken old = refreshTokenService.validateUsable(req.getRefreshToken());
        RefreshToken fresh = refreshTokenService.rotate(old);
        String access = jwtService.generateAccessToken(fresh.getUser().getUsername());
        return ResponseEntity.ok(new TokenResponse(access, fresh.getToken()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest req) {
        refreshTokenService.revoke(req.getRefreshToken());
        return ResponseEntity.noContent().build();
    }
}
