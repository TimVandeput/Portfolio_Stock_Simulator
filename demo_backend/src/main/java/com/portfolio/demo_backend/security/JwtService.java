package com.portfolio.demo_backend.security;

import com.portfolio.demo_backend.config.JwtProperties;
import com.portfolio.demo_backend.model.enums.Role;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Small utility service for issuing and parsing HMAC-SHA256 JWT access tokens.
 *
 * Token shape:
 * - subject: username
 * - claims: role (String), optionally userId (Long)
 * - expiration: configured via
 * {@link com.portfolio.demo_backend.config.JwtProperties}
 */
@Service
public class JwtService {

    private final JwtProperties props;
    private final byte[] keyBytes;

    public JwtService(JwtProperties props) {
        this.props = props;
        this.keyBytes = props.getSecret().getBytes(StandardCharsets.UTF_8);
    }

    public String generateAccessToken(String username, Role role) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role.name())
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + props.getExpiration()))
                .signWith(Keys.hmacShaKeyFor(keyBytes), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateAccessToken(String username, Long userId, Role role) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role.name())
                .claim("userId", userId)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + props.getExpiration()))
                .signWith(Keys.hmacShaKeyFor(keyBytes), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(keyBytes))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    byte[] getKeyBytes() {
        return keyBytes;
    }
}
