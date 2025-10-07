package com.portfolio.demo_backend.security;

import com.portfolio.demo_backend.config.JwtProperties;
import com.portfolio.demo_backend.model.enums.Role;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

/**
 * Unit tests for {@link JwtAuthenticationFilter} ensuring authentication is
 * established from headers, cookies, and query params, and excluded paths are
 * bypassed.
 */
class JwtAuthenticationFilterTest {

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private static JwtService realJwtService() {
        JwtProperties props = new JwtProperties();
        props.setSecret("TestSecretKeyForJwtThatIsLongEnough_1234567890");
        props.setExpiration(900_000L);
        props.setRefreshExpiration(604_800_000L);
        return new JwtService(props);
    }

    /**
     * Extracts bearer token from Authorization header and authenticates.
     */
    @Test
    void authenticates_fromAuthorizationHeader() throws ServletException, IOException {
        // Given: A valid access token in the Authorization header
        JwtService jwt = realJwtService();
        JwtAuthenticationFilter f = new JwtAuthenticationFilter(jwt);

        String token = jwt.generateAccessToken("tim", Role.ROLE_USER);

        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/symbols");
        req.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        // When: The filter is executed
        f.doFilter(req, res, chain);

        // Then: Authentication is present in the security context
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
    }

    /**
     * Extracts token from auth.access cookie and authenticates.
     */
    @Test
    void authenticates_fromCookie() throws ServletException, IOException {
        // Given: A valid access token in the cookie
        JwtService jwt = realJwtService();
        JwtAuthenticationFilter f = new JwtAuthenticationFilter(jwt);

        String token = jwt.generateAccessToken("tim", Role.ROLE_USER);

        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/stream/prices");
        req.setCookies(new Cookie("auth.access", token));
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        // When: The filter runs
        f.doFilter(req, res, chain);

        // Then: Authentication is established
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
    }

    /**
     * Extracts token from access_token query parameter and authenticates.
     */
    @Test
    void authenticates_fromQueryParam() throws ServletException, IOException {
        // Given: A valid token passed via query string
        JwtService jwt = realJwtService();
        JwtAuthenticationFilter f = new JwtAuthenticationFilter(jwt);

        String token = jwt.generateAccessToken("tim", Role.ROLE_USER);

        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/stream/prices");
        req.setParameter("access_token", token);
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        // When: The filter executes
        f.doFilter(req, res, chain);

        // Then: Authentication is set
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
    }

    /**
     * Skips authentication for auth endpoints.
     */
    @Test
    void skips_authEndpoints() throws ServletException, IOException {
        // Given: A request to the login endpoint without a token
        JwtService jwt = realJwtService();
        JwtAuthenticationFilter f = new JwtAuthenticationFilter(jwt);

        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/auth/login");
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        // When: The filter runs on the auth endpoint
        f.doFilter(req, res, chain);

        // Then: No authentication is set and chain continues
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(chain, times(1)).doFilter(req, res);
    }
}
