package com.portfolio.demo_backend.marketdata.controller;

import com.portfolio.demo_backend.marketdata.service.FinnhubStreamService;
import com.portfolio.demo_backend.marketdata.service.StreamAuthenticationService;
import com.portfolio.demo_backend.exception.marketdata.StreamAuthenticationException;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
/**
 * Unit tests for {@link PriceStreamController} verifying SSE setup and token
 * validation behavior under valid and invalid scenarios.
 */
class PriceStreamControllerUnitTest {

    @Mock
    private FinnhubStreamService finnhubStreamService;

    @Mock
    private StreamAuthenticationService authService;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private PriceStreamController controller;

    /**
     * Returns an SSE emitter when token is valid and sets appropriate headers.
     */
    @Test
    void streamPrices_validToken_callsAuthService() {
        // Given: Valid token and symbols with mocked downstream services
        String symbols = "AAPL,MSFT";
        String token = "valid-token";
        when(authService.validateToken(token)).thenReturn("testuser");
        when(finnhubStreamService.getLastPrice(anyString())).thenReturn(150.0);
        when(finnhubStreamService.getPercentChange(anyString())).thenReturn(2.5);

        // When: Streaming prices is invoked
        SseEmitter result = controller.streamPrices(symbols, token, response);

        // Then: An emitter is returned and headers are set
        assertThat(result).isNotNull();
        verify(authService).validateToken(token);
        verify(response).addHeader("Cache-Control", "no-cache");
        verify(response).addHeader("X-Accel-Buffering", "no");
    }

    /**
     * Throws when the provided token is invalid.
     */
    @Test
    void streamPrices_invalidToken_throwsException() {
        // Given: Invalid token triggers auth exception
        String symbols = "AAPL,MSFT";
        String token = "invalid-token";
        when(authService.validateToken(token))
                .thenThrow(new StreamAuthenticationException("Token validation failed"));

        // When/Then: Controller propagates the exception and doesn't touch response
        assertThatThrownBy(() -> controller.streamPrices(symbols, token, response))
                .isInstanceOf(StreamAuthenticationException.class)
                .hasMessage("Token validation failed");

        verify(authService).validateToken(token);
        verifyNoInteractions(response);
    }

    /**
     * Handles empty symbols gracefully by still creating an emitter.
     */
    @Test
    void streamPrices_emptySymbols_returnsEmitterWithError() {
        // Given: Empty symbol list but valid token
        String symbols = "";
        String token = "valid-token";
        when(authService.validateToken(token)).thenReturn("testuser");

        // When: Streaming with empty symbols
        SseEmitter result = controller.streamPrices(symbols, token, response);

        // Then: An emitter object is still returned
        assertThat(result).isNotNull();
        verify(authService).validateToken(token);
    }
}
