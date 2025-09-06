package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.security.JwtService;
import com.portfolio.demo_backend.exception.marketdata.StreamAuthenticationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StreamAuthenticationServiceUnitTest {

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private StreamAuthenticationService authService;

    @Test
    void validateToken_success_returnsUsername() {
        String token = "valid-jwt-token";
        String expectedUsername = "testuser";
        when(jwtService.extractUsername(token)).thenReturn(expectedUsername);

        String result = authService.validateToken(token);

        assertThat(result).isEqualTo(expectedUsername);
        verify(jwtService).extractUsername(token);
    }

    @Test
    void validateToken_nullToken_throwsException() {
        assertThatThrownBy(() -> authService.validateToken(null))
                .isInstanceOf(StreamAuthenticationException.class)
                .hasMessage("Token is required");

        verifyNoInteractions(jwtService);
    }

    @Test
    void validateToken_emptyToken_throwsException() {
        assertThatThrownBy(() -> authService.validateToken("  "))
                .isInstanceOf(StreamAuthenticationException.class)
                .hasMessage("Token is required");

        verifyNoInteractions(jwtService);
    }

    @Test
    void validateToken_nullUsername_throwsException() {
        String token = "valid-token";
        when(jwtService.extractUsername(token)).thenReturn(null);

        assertThatThrownBy(() -> authService.validateToken(token))
                .isInstanceOf(StreamAuthenticationException.class)
                .hasMessage("Invalid token");
    }

    @Test
    void validateToken_emptyUsername_throwsException() {
        String token = "valid-token";
        when(jwtService.extractUsername(token)).thenReturn("  ");

        assertThatThrownBy(() -> authService.validateToken(token))
                .isInstanceOf(StreamAuthenticationException.class)
                .hasMessage("Invalid token");
    }

    @Test
    void validateToken_jwtServiceThrowsException_throwsStreamAuthException() {
        String token = "invalid-token";
        when(jwtService.extractUsername(token)).thenThrow(new RuntimeException("JWT parsing failed"));

        assertThatThrownBy(() -> authService.validateToken(token))
                .isInstanceOf(StreamAuthenticationException.class)
                .hasMessage("Token validation failed");
    }

    @Test
    void streamAuthenticationException_hasCorrectAnnotation() {
        ResponseStatus annotation = StreamAuthenticationException.class
                .getAnnotation(ResponseStatus.class);

        assertThat(annotation).isNotNull();
        assertThat(annotation.value()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void streamAuthenticationException_constructorWithMessage() {
        String message = "Token is invalid";

        StreamAuthenticationException exception = new StreamAuthenticationException(message);

        assertThat(exception.getMessage()).isEqualTo(message);
    }

    @Test
    void streamAuthenticationException_constructorWithMessageAndCause() {
        String message = "Token validation failed";
        RuntimeException cause = new RuntimeException("JWT parsing error");

        StreamAuthenticationException exception = new StreamAuthenticationException(message, cause);

        assertThat(exception.getMessage()).isEqualTo(message);
        assertThat(exception.getCause()).isEqualTo(cause);
    }
}
