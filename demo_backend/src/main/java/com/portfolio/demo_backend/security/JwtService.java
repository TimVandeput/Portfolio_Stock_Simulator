package com.portfolio.demo_backend.security;

import com.portfolio.demo_backend.config.JwtProperties;
import com.portfolio.demo_backend.model.Role;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

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

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(keyBytes))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
