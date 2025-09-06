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
class PriceStreamControllerUnitTest {

    @Mock
    private FinnhubStreamService finnhubStreamService;

    @Mock
    private StreamAuthenticationService authService;

    @Mock
    private HttpServletResponse response;

    @InjectMocks
    private PriceStreamController controller;

    @Test
    void streamPrices_validToken_callsAuthService() {
        String symbols = "AAPL,MSFT";
        String token = "valid-token";
        when(authService.validateToken(token)).thenReturn("testuser");
        when(finnhubStreamService.getLastPrice(anyString())).thenReturn(150.0);
        when(finnhubStreamService.getPercentChange(anyString())).thenReturn(2.5);

        SseEmitter result = controller.streamPrices(symbols, token, response);

        assertThat(result).isNotNull();
        verify(authService).validateToken(token);
        verify(response).addHeader("Cache-Control", "no-cache");
        verify(response).addHeader("X-Accel-Buffering", "no");
    }

    @Test
    void streamPrices_invalidToken_throwsException() {
        String symbols = "AAPL,MSFT";
        String token = "invalid-token";
        when(authService.validateToken(token))
                .thenThrow(new StreamAuthenticationException("Token validation failed"));

        assertThatThrownBy(() -> controller.streamPrices(symbols, token, response))
                .isInstanceOf(StreamAuthenticationException.class)
                .hasMessage("Token validation failed");

        verify(authService).validateToken(token);
        verifyNoInteractions(response);
    }

    @Test
    void streamPrices_emptySymbols_returnsEmitterWithError() {
        String symbols = "";
        String token = "valid-token";
        when(authService.validateToken(token)).thenReturn("testuser");

        SseEmitter result = controller.streamPrices(symbols, token, response);

        assertThat(result).isNotNull();
        verify(authService).validateToken(token);
    }
}
