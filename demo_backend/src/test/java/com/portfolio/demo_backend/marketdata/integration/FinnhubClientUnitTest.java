package com.portfolio.demo_backend.marketdata.integration;

import com.portfolio.demo_backend.config.FinnhubProperties;
import com.portfolio.demo_backend.exception.marketdata.ApiRateLimitException;
import com.portfolio.demo_backend.exception.marketdata.MarketDataUnavailableException;
import okhttp3.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FinnhubClientUnitTest {

    @Mock
    private OkHttpClient mockHttpClient;

    @Mock
    private Call mockCall;

    @Mock
    private Response mockResponse;

    @Mock
    private ResponseBody mockResponseBody;

    private FinnhubProperties properties;
    private FinnhubClient finnhubClient;

    @BeforeEach
    void setUp() {
        properties = new FinnhubProperties();
        properties.setToken("test-token");
        properties.setApiBase("https://finnhub.io/api/v1");

        finnhubClient = new FinnhubClient(properties);
        ReflectionTestUtils.setField(finnhubClient, "http", mockHttpClient);
    }

    @Test
    void getIndexConstituents_success_returnsList() throws IOException {
        String jsonResponse = "{\"constituents\":[\"AAPL\",\"MSFT\",\"GOOGL\"]}";
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(true);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string()).thenReturn(jsonResponse);

        List<String> result = finnhubClient.getIndexConstituents("NDX");

        assertThat(result).containsExactly("AAPL", "MSFT", "GOOGL");
        verify(mockHttpClient).newCall(any(Request.class));
    }

    @Test
    void getIndexConstituents_emptyResponse_returnsEmptyList() throws IOException {
        String jsonResponse = "{\"constituents\":null}";
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(true);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string()).thenReturn(jsonResponse);

        List<String> result = finnhubClient.getIndexConstituents("INVALID");

        assertThat(result).isEmpty();
    }

    @Test
    void getIndexConstituents_rateLimitError_throwsApiRateLimitException() throws IOException {
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(false);
        when(mockResponse.code()).thenReturn(429);

        assertThatThrownBy(() -> finnhubClient.getIndexConstituents("NDX"))
                .isInstanceOf(ApiRateLimitException.class)
                .hasMessageContaining("Finnhub");
    }

    @Test
    void getIndexConstituents_serverError_throwsMarketDataUnavailableException() throws IOException {
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(false);
        when(mockResponse.code()).thenReturn(500);

        assertThatThrownBy(() -> finnhubClient.getIndexConstituents("NDX"))
                .isInstanceOf(MarketDataUnavailableException.class)
                .hasMessageContaining("Server error: 500");
    }

    @Test
    void getProfile2_success_returnsProfile() throws IOException {
        String jsonResponse = """
                {
                    "name": "Apple Inc",
                    "exchange": "NASDAQ",
                    "ticker": "AAPL",
                    "currency": "USD",
                    "mic": "XNAS"
                }
                """;
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(true);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string()).thenReturn(jsonResponse);

        FinnhubClient.Profile2 result = finnhubClient.getProfile2("AAPL");

        assertThat(result).isNotNull();
        assertThat(result.name).isEqualTo("Apple Inc");
        assertThat(result.exchange).isEqualTo("NASDAQ");
        assertThat(result.ticker).isEqualTo("AAPL");
        assertThat(result.currency).isEqualTo("USD");
        assertThat(result.mic).isEqualTo("XNAS");
    }

    @Test
    void getProfile2_rateLimitError_throwsApiRateLimitException() throws IOException {
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(false);
        when(mockResponse.code()).thenReturn(429);

        assertThatThrownBy(() -> finnhubClient.getProfile2("AAPL"))
                .isInstanceOf(ApiRateLimitException.class)
                .hasMessageContaining("Finnhub");
    }

    @Test
    void listSymbolsByExchange_success_returnsList() throws IOException {
        String jsonResponse = """
                [
                    {
                        "symbol": "AAPL",
                        "description": "Apple Inc",
                        "currency": "USD",
                        "mic": "XNAS",
                        "type": "Common Stock"
                    },
                    {
                        "symbol": "MSFT",
                        "description": "Microsoft Corporation",
                        "currency": "USD",
                        "mic": "XNAS",
                        "type": "Common Stock"
                    }
                ]
                """;
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(true);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string()).thenReturn(jsonResponse);

        List<FinnhubClient.SymbolItem> result = finnhubClient.listSymbolsByExchange("US");

        assertThat(result).hasSize(2);
        assertThat(result.get(0).symbol).isEqualTo("AAPL");
        assertThat(result.get(0).description).isEqualTo("Apple Inc");
        assertThat(result.get(0).currency).isEqualTo("USD");
        assertThat(result.get(0).mic).isEqualTo("XNAS");
        assertThat(result.get(1).symbol).isEqualTo("MSFT");
    }

    @Test
    void listSymbolsByExchange_rateLimitError_throwsApiRateLimitException() throws IOException {
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(false);
        when(mockResponse.code()).thenReturn(429);

        assertThatThrownBy(() -> finnhubClient.listSymbolsByExchange("US"))
                .isInstanceOf(ApiRateLimitException.class)
                .hasMessageContaining("Finnhub");
    }

    @Test
    void listSymbolsByExchange_serverError_throwsMarketDataUnavailableException() throws IOException {
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(false);
        when(mockResponse.code()).thenReturn(500);

        assertThatThrownBy(() -> finnhubClient.listSymbolsByExchange("US"))
                .isInstanceOf(MarketDataUnavailableException.class)
                .hasMessageContaining("Server error: 500");
    }

    @Test
    void listSymbolsByExchange_nullResponse_returnsEmptyList() throws IOException {
        String jsonResponse = "null";
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(true);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string()).thenReturn(jsonResponse);

        List<FinnhubClient.SymbolItem> result = finnhubClient.listSymbolsByExchange("INVALID");

        assertThat(result).isEmpty();
    }

    @Test
    void throttled_executesSupplierAfterDelay() throws IOException {
        String expectedResult = "test result";
        FinnhubClient.CallSupplier<String> supplier = () -> expectedResult;

        long startTime = System.currentTimeMillis();
        String result = finnhubClient.throttled(supplier);
        long endTime = System.currentTimeMillis();

        assertThat(result).isEqualTo(expectedResult);
        assertThat(endTime - startTime).isGreaterThanOrEqualTo(1600);
    }
}
