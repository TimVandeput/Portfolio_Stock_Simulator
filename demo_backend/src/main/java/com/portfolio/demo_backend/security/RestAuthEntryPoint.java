package com.portfolio.demo_backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;
import java.util.Map;

/**
 * Authentication entry point that returns a compact JSON body for 401
 * responses.
 * Structure: { "status": 401, "error": "Unauthorized", "path":
 * "/requested/path" }
 */
public class RestAuthEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        var body = Map.of(
                "status", 401,
                "error", "Unauthorized",
                "path", request.getRequestURI());
        mapper.writeValue(response.getOutputStream(), body);
    }
}
