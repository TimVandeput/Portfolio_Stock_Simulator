package com.portfolio.demo_backend.security;

import com.portfolio.demo_backend.config.JwtProperties;
import com.portfolio.demo_backend.model.Role;
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

    @Test
    void authenticates_fromAuthorizationHeader() throws ServletException, IOException {
        JwtService jwt = realJwtService();
        JwtAuthenticationFilter f = new JwtAuthenticationFilter(jwt);

        String token = jwt.generateAccessToken("tim", Role.ROLE_USER);

        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/symbols");
        req.addHeader("Authorization", "Bearer " + token);
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        f.doFilter(req, res, chain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
    }

    @Test
    void authenticates_fromCookie() throws ServletException, IOException {
        JwtService jwt = realJwtService();
        JwtAuthenticationFilter f = new JwtAuthenticationFilter(jwt);

        String token = jwt.generateAccessToken("tim", Role.ROLE_USER);

        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/stream/prices");
        req.setCookies(new Cookie("auth.access", token));
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        f.doFilter(req, res, chain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
    }

    @Test
    void authenticates_fromQueryParam() throws ServletException, IOException {
        JwtService jwt = realJwtService();
        JwtAuthenticationFilter f = new JwtAuthenticationFilter(jwt);

        String token = jwt.generateAccessToken("tim", Role.ROLE_USER);

        MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/stream/prices");
        req.setParameter("access_token", token);
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        f.doFilter(req, res, chain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
    }

    @Test
    void skips_authEndpoints() throws ServletException, IOException {
        JwtService jwt = realJwtService();
        JwtAuthenticationFilter f = new JwtAuthenticationFilter(jwt);

        MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/auth/login");
        MockHttpServletResponse res = new MockHttpServletResponse();
        FilterChain chain = mock(FilterChain.class);

        f.doFilter(req, res, chain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(chain, times(1)).doFilter(req, res);
    }
}
