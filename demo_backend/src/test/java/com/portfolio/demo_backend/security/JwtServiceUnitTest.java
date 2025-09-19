package com.portfolio.demo_backend.security;

import com.portfolio.demo_backend.config.JwtProperties;
import com.portfolio.demo_backend.model.enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.assertj.core.api.Assertions.*;

class JwtServiceUnitTest {

    private JwtService newSvc(long expMs) {
        JwtProperties props = new JwtProperties();
        props.setSecret("TestSecretKeyForJwtThatIsLongEnough_1234567890");
        props.setExpiration(expMs);
        props.setRefreshExpiration(604800000L);
        return new JwtService(props);
    }

    @Test
    void generate_and_extract_username_and_role() {
        JwtService svc = newSvc(900_000);
        String token = svc.generateAccessToken("alice", Role.ROLE_ADMIN);

        assertThat(token).isNotBlank();

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(
                        "TestSecretKeyForJwtThatIsLongEnough_1234567890".getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertThat(claims.getSubject()).isEqualTo("alice");
        assertThat(claims.get("role", String.class)).isEqualTo("ROLE_ADMIN");
        assertThat(claims.getIssuedAt()).isBefore(claims.getExpiration());
        assertThat(claims.getExpiration()).isAfter(new Date());
    }

    @Test
    void extractUsername_works() {
        JwtService svc = newSvc(900_000);
        String token = svc.generateAccessToken("bob", Role.ROLE_USER);

        assertThat(svc.extractUsername(token)).isEqualTo("bob");
    }

    @Test
    void extractUsername_fails_for_tampered_token() {
        JwtService svc = newSvc(900_000);
        String token = svc.generateAccessToken("eve", Role.ROLE_USER);

        String broken = token.substring(0, token.length() - 2) + "xx";

        assertThatThrownBy(() -> svc.extractUsername(broken))
                .isInstanceOf(Exception.class);
    }
}
