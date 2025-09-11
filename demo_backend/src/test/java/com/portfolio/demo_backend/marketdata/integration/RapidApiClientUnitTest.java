package com.portfolio.demo_backend.marketdata.integration;

import com.portfolio.demo_backend.config.RapidApiProperties;
import com.portfolio.demo_backend.exception.marketdata.ApiRateLimitException;
import com.portfolio.demo_backend.exception.marketdata.MarketDataUnavailableException;
import okhttp3.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RapidApiClientUnitTest {

    @Mock
    private OkHttpClient mockHttpClient;

    @Mock
    private Call mockCall;

    @Mock
    private Response mockResponse;

    @Mock
    private ResponseBody mockResponseBody;

    private RapidApiProperties properties;
    private RapidApiClient rapidApiClient;

    @BeforeEach
    void setUp() {
        properties = new RapidApiProperties();
        properties.setKey("test-key");
        properties.setHost("test-host");
        properties.setBaseUrl("https://test-api.com");

        rapidApiClient = new RapidApiClient(properties);

        ReflectionTestUtils.setField(rapidApiClient, "http", mockHttpClient);
    }

    @Test
    void getQuotes_success_returnsQuotesList() throws IOException {
        String jsonResponse = """
                {
                    "quoteResponse": {
                        "result": [
                            {
                                "symbol": "AAPL",
                                "regularMarketPrice": 150.00,
                                "regularMarketChange": 2.50,
                                "regularMarketChangePercent": 1.69,
                                "regularMarketDayHigh": 152.00,
                                "regularMarketDayLow": 148.00,
                                "regularMarketOpen": 149.00,
                                "regularMarketPreviousClose": 147.50
                            }
                        ]
                    }
                }
                """;

        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(true);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string()).thenReturn(jsonResponse);

        List<RapidApiClient.Quote> result = rapidApiClient.getQuotes(List.of("AAPL"));

        assertThat(result).hasSize(1);
        assertThat(result.get(0).symbol).isEqualTo("AAPL");
        assertThat(result.get(0).price).isEqualTo(150.00);
        assertThat(result.get(0).change).isEqualTo(2.50);
        assertThat(result.get(0).changePercent).isEqualTo(1.69);
    }

    @Test
    void getQuotes_emptySymbols_returnsEmptyList() throws IOException {
        List<RapidApiClient.Quote> result = rapidApiClient.getQuotes(List.of());

        assertThat(result).isEmpty();
        verifyNoInteractions(mockHttpClient);
    }

    @Test
    void getQuotes_nullSymbols_returnsEmptyList() throws IOException {
        List<RapidApiClient.Quote> result = rapidApiClient.getQuotes(null);

        assertThat(result).isEmpty();
        verifyNoInteractions(mockHttpClient);
    }

    @Test
    void getQuotes_rateLimitError_throwsApiRateLimitException() throws IOException {
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(false);
        when(mockResponse.code()).thenReturn(429);

        assertThatThrownBy(() -> rapidApiClient.getQuotes(List.of("AAPL")))
                .isInstanceOf(ApiRateLimitException.class)
                .hasMessageContaining("RapidAPI Yahoo Finance");
    }

    @Test
    void getQuotes_serverError_throwsMarketDataUnavailableException() throws IOException {
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(false);
        when(mockResponse.code()).thenReturn(500);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string()).thenReturn("Internal Server Error");

        assertThatThrownBy(() -> rapidApiClient.getQuotes(List.of("AAPL")))
                .isInstanceOf(MarketDataUnavailableException.class)
                .hasMessageContaining("Server error: 500");
    }

    @Test
    void getQuotes_authError_throwsIOException() throws IOException {
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(false);
        when(mockResponse.code()).thenReturn(401);

        assertThatThrownBy(() -> rapidApiClient.getQuotes(List.of("AAPL")))
                .isInstanceOf(IOException.class)
                .hasMessageContaining("RapidAPI authentication failed");
    }

    @Test
    void getQuotes_forbiddenError_throwsIOException() throws IOException {
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(false);
        when(mockResponse.code()).thenReturn(403);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string()).thenReturn("Forbidden");

        assertThatThrownBy(() -> rapidApiClient.getQuotes(List.of("AAPL")))
                .isInstanceOf(IOException.class)
                .hasMessageContaining("RapidAPI authentication/authorization failed");
    }

    @Test
    void getQuote_success_returnsSingleQuote() throws IOException {
        String jsonResponse = """
                {
                    "quoteResponse": {
                        "result": [
                            {
                                "symbol": "MSFT",
                                "regularMarketPrice": 300.00,
                                "regularMarketChange": -5.00,
                                "regularMarketChangePercent": -1.64
                            }
                        ]
                    }
                }
                """;

        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(true);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string()).thenReturn(jsonResponse);

        RapidApiClient.Quote result = rapidApiClient.getQuote("MSFT");

        assertThat(result).isNotNull();
        assertThat(result.symbol).isEqualTo("MSFT");
        assertThat(result.price).isEqualTo(300.00);
        assertThat(result.change).isEqualTo(-5.00);
    }

    @Test
    void getQuote_noResults_returnsNull() throws IOException {
        String jsonResponse = """
                {
                    "quoteResponse": {
                        "result": []
                    }
                }
                """;

        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(true);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string()).thenReturn(jsonResponse);

        RapidApiClient.Quote result = rapidApiClient.getQuote("INVALID");

        assertThat(result).isNull();
    }

    @Test
    void constructor_setsProperties() {
        assertThat(rapidApiClient).isNotNull();
    }

    @Test
    void apiRateLimitException_hasCorrectProvider() {
        ApiRateLimitException exception = new ApiRateLimitException("RapidAPI Yahoo Finance");

        assertThat(exception.getProvider()).isEqualTo("RapidAPI Yahoo Finance");
        assertThat(exception.getMessage()).contains("Rate limit exceeded");
    }

    @Test
    void marketDataUnavailableException_hasCorrectProvider() {
        MarketDataUnavailableException exception = new MarketDataUnavailableException(
                "RapidAPI Yahoo Finance", "Server error: 500");

        assertThat(exception.getProvider()).isEqualTo("RapidAPI Yahoo Finance");
        assertThat(exception.getMessage()).isEqualTo("Server error: 500");
    }

    @Test
    void apiRateLimitException_hasCorrectAnnotation() {
        ResponseStatus annotation = ApiRateLimitException.class
                .getAnnotation(ResponseStatus.class);

        assertThat(annotation).isNotNull();
        assertThat(annotation.value()).isEqualTo(HttpStatus.TOO_MANY_REQUESTS);
    }

    @Test
    void apiRateLimitException_constructorWithProvider() {
        String provider = "Finnhub";

        ApiRateLimitException exception = new ApiRateLimitException(provider);

        assertThat(exception.getProvider()).isEqualTo(provider);
        assertThat(exception.getMessage()).contains("Rate limit exceeded");
        assertThat(exception.getMessage()).contains(provider);
    }

    @Test
    void apiRateLimitException_constructorWithProviderAndMessage() {
        String provider = "RapidAPI";
        String message = "Custom rate limit message";

        ApiRateLimitException exception = new ApiRateLimitException(provider, message);

        assertThat(exception.getProvider()).isEqualTo(provider);
        assertThat(exception.getMessage()).isEqualTo(message);
    }

    @Test
    void marketDataUnavailableException_hasCorrectAnnotation() {
        ResponseStatus annotation = MarketDataUnavailableException.class
                .getAnnotation(ResponseStatus.class);

        assertThat(annotation).isNotNull();
        assertThat(annotation.value()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
    }

    @Test
    void marketDataUnavailableException_constructorWithProvider() {
        String provider = "Yahoo Finance";

        MarketDataUnavailableException exception = new MarketDataUnavailableException(provider);

        assertThat(exception.getProvider()).isEqualTo(provider);
        assertThat(exception.getMessage()).contains("Market data temporarily unavailable");
        assertThat(exception.getMessage()).contains(provider);
    }

    @Test
    void marketDataUnavailableException_constructorWithProviderAndMessage() {
        String provider = "Finnhub";
        String message = "Server maintenance";

        MarketDataUnavailableException exception = new MarketDataUnavailableException(provider, message);

        assertThat(exception.getProvider()).isEqualTo(provider);
        assertThat(exception.getMessage()).isEqualTo(message);
    }
}
