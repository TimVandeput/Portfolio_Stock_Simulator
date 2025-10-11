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

/**
 * Unit tests for {@link JwtService} covering token generation and claim
 * extraction.
 */
class JwtServiceUnitTest {

    private JwtService newSvc(long expMs) {
        JwtProperties props = new JwtProperties();
        props.setSecret("TestSecretKeyForJwtThatIsLongEnough_1234567890");
        props.setExpiration(expMs);
        props.setRefreshExpiration(604800000L);
        return new JwtService(props);
    }

    /**
     * Generates a token and validates subject, role, and expiry claims.
     */
    @Test
    void generate_and_extract_username_and_role() {
        // Given: A JWT service with a short expiration
        JwtService svc = newSvc(900_000);
        String token = svc.generateAccessToken("alice", Role.ROLE_ADMIN);

        // When: Parsing the generated token
        assertThat(token).isNotBlank();

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(
                        "TestSecretKeyForJwtThatIsLongEnough_1234567890".getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody();

        // Then: Claims match the inputs and temporal constraints
        assertThat(claims.getSubject()).isEqualTo("alice");
        assertThat(claims.get("role", String.class)).isEqualTo("ROLE_ADMIN");
        assertThat(claims.getIssuedAt()).isBefore(claims.getExpiration());
        assertThat(claims.getExpiration()).isAfter(new Date());
    }

    @Test
    void extractUsername_works() {
        // Given: A valid token for user bob
        JwtService svc = newSvc(900_000);
        String token = svc.generateAccessToken("bob", Role.ROLE_USER);

        // When/Then: Username can be extracted
        assertThat(svc.extractUsername(token)).isEqualTo("bob");
    }

    @Test
    void extractUsername_fails_for_tampered_token() {
        // Given: A valid token that is then tampered with
        JwtService svc = newSvc(900_000);
        String token = svc.generateAccessToken("eve", Role.ROLE_USER);

        String broken = token.substring(0, token.length() - 2) + "xx";

        // When/Then: Extraction throws due to signature mismatch
        assertThatThrownBy(() -> svc.extractUsername(broken))
                .isInstanceOf(Exception.class);
    }
}
