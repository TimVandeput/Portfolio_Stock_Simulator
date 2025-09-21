package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import com.portfolio.demo_backend.repository.SymbolRepository;
import com.portfolio.demo_backend.repository.UserRepository;
import okhttp3.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
@Transactional
class GraphServiceIntegrationTest {

    @Autowired
    private GraphService graphService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SymbolRepository symbolRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Mock
    private OkHttpClient mockHttpClient;

    @Mock
    private Call mockCall;

    @Mock
    private Response mockResponse;

    @Mock
    private ResponseBody mockResponseBody;

    private User testUser;
    private Symbol appleSymbol;
    private Symbol googleSymbol;
    private Symbol microsoftSymbol;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(graphService, "http", mockHttpClient);

        testUser = User.builder()
                .username("testuser")
                .password("encodedpassword")
                .roles(EnumSet.of(Role.ROLE_USER))
                .build();
        testUser = userRepository.save(testUser);

        appleSymbol = new Symbol();
        appleSymbol.setSymbol("AAPL");
        appleSymbol.setName("Apple Inc.");
        appleSymbol.setEnabled(true);
        appleSymbol = symbolRepository.save(appleSymbol);

        googleSymbol = new Symbol();
        googleSymbol.setSymbol("GOOGL");
        googleSymbol.setName("Alphabet Inc.");
        googleSymbol.setEnabled(true);
        googleSymbol = symbolRepository.save(googleSymbol);

        microsoftSymbol = new Symbol();
        microsoftSymbol.setSymbol("MSFT");
        microsoftSymbol.setName("Microsoft Corporation");
        microsoftSymbol.setEnabled(true);
        microsoftSymbol = symbolRepository.save(microsoftSymbol);
    }

    @Test
    void getCharts_withEmptyPortfolio_returnsEmptyList() {
        List<Map<String, Object>> charts = graphService.getCharts(testUser.getId());

        assertThat(charts).isEmpty();
        verifyNoInteractions(mockHttpClient);
    }

    @Test
    void getCharts_withSingleHolding_returnsSingleChart() throws IOException {
        Portfolio portfolio = createPortfolio(appleSymbol, 10, BigDecimal.valueOf(150.00));
        portfolioRepository.save(portfolio);

        String appleChartResponse = createMockChartResponse("AAPL");
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        lenient().when(mockResponse.isSuccessful()).thenReturn(true);
        lenient().when(mockResponse.code()).thenReturn(200);
        lenient().when(mockResponse.body()).thenReturn(mockResponseBody);
        lenient().when(mockResponseBody.string()).thenReturn(appleChartResponse);

        List<Map<String, Object>> charts = graphService.getCharts(testUser.getId());

        assertThat(charts).hasSize(1);
        Map<String, Object> chart = charts.get(0);
        assertThat(chart.get("symbol")).isEqualTo("AAPL");
        assertThat(chart.get("chart")).isNotNull();

        verify(mockHttpClient).newCall(any(Request.class));
    }

    @Test
    void getCharts_withMultipleHoldings_returnsMultipleCharts() throws IOException {
        Portfolio applePortfolio = createPortfolio(appleSymbol, 10, BigDecimal.valueOf(150.00));
        Portfolio googlePortfolio = createPortfolio(googleSymbol, 5, BigDecimal.valueOf(120.00));
        portfolioRepository.saveAll(List.of(applePortfolio, googlePortfolio));

        String appleChartResponse = createMockChartResponse("AAPL");
        String googleChartResponse = createMockChartResponse("GOOGL");

        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(true);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string())
                .thenReturn(appleChartResponse)
                .thenReturn(googleChartResponse);

        List<Map<String, Object>> charts = graphService.getCharts(testUser.getId());

        assertThat(charts).hasSize(2);
        assertThat(charts.stream().map(chart -> chart.get("symbol")))
                .containsExactlyInAnyOrder("AAPL", "GOOGL");

        verify(mockHttpClient, times(2)).newCall(any(Request.class));
    }

    @Test
    void getCharts_withDuplicateSymbols_returnsUniqueCharts() throws IOException {
        User anotherUser = User.builder()
                .username("anotheruser")
                .password("encodedpassword")
                .roles(EnumSet.of(Role.ROLE_USER))
                .build();
        anotherUser = userRepository.save(anotherUser);

        Portfolio applePortfolio1 = createPortfolio(appleSymbol, 10, BigDecimal.valueOf(150.00));
        Portfolio applePortfolio2 = createPortfolio(anotherUser, appleSymbol, 5, BigDecimal.valueOf(160.00));
        portfolioRepository.saveAll(List.of(applePortfolio1, applePortfolio2));

        String appleChartResponse = createMockChartResponse("AAPL");
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        lenient().when(mockResponse.isSuccessful()).thenReturn(true);
        lenient().when(mockResponse.code()).thenReturn(200);
        lenient().when(mockResponse.body()).thenReturn(mockResponseBody);
        lenient().when(mockResponseBody.string()).thenReturn(appleChartResponse);

        List<Map<String, Object>> charts = graphService.getCharts(testUser.getId());

        assertThat(charts).hasSize(1);
        assertThat(charts.get(0).get("symbol")).isEqualTo("AAPL");

        verify(mockHttpClient, times(1)).newCall(any(Request.class));
    }

    @Test
    void getCharts_withApiError_continuesWithOtherSymbols() throws IOException {
        Portfolio applePortfolio = createPortfolio(appleSymbol, 10, BigDecimal.valueOf(150.00));
        Portfolio googlePortfolio = createPortfolio(googleSymbol, 5, BigDecimal.valueOf(120.00));
        portfolioRepository.saveAll(List.of(applePortfolio, googlePortfolio));

        String googleChartResponse = createMockChartResponse("GOOGL");

        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful())
                .thenReturn(false)
                .thenReturn(true);
        when(mockResponse.code()).thenReturn(500);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string())
                .thenReturn("Server Error")
                .thenReturn(googleChartResponse);

        List<Map<String, Object>> charts = graphService.getCharts(testUser.getId());

        assertThat(charts).hasSize(1);
        assertThat(charts.get(0).get("symbol")).isEqualTo("GOOGL");

        verify(mockHttpClient, times(2)).newCall(any(Request.class));
    }

    @Test
    void getCharts_withRateLimitError_continuesWithOtherSymbols() throws IOException {
        Portfolio applePortfolio = createPortfolio(appleSymbol, 10, BigDecimal.valueOf(150.00));
        Portfolio microsoftPortfolio = createPortfolio(microsoftSymbol, 3, BigDecimal.valueOf(300.00));
        portfolioRepository.saveAll(List.of(applePortfolio, microsoftPortfolio));

        String microsoftChartResponse = createMockChartResponse("MSFT");

        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful())
                .thenReturn(false)
                .thenReturn(true);
        when(mockResponse.code()).thenReturn(429);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string())
                .thenReturn("Rate limit exceeded")
                .thenReturn(microsoftChartResponse);

        List<Map<String, Object>> charts = graphService.getCharts(testUser.getId());

        assertThat(charts).hasSize(1);
        assertThat(charts.get(0).get("symbol")).isEqualTo("MSFT");

        verify(mockHttpClient, times(2)).newCall(any(Request.class));
    }

    @Test
    void getCharts_withInvalidJsonResponse_continuesWithOtherSymbols() throws IOException {
        Portfolio applePortfolio = createPortfolio(appleSymbol, 10, BigDecimal.valueOf(150.00));
        Portfolio googlePortfolio = createPortfolio(googleSymbol, 5, BigDecimal.valueOf(120.00));
        portfolioRepository.saveAll(List.of(applePortfolio, googlePortfolio));

        String googleChartResponse = createMockChartResponse("GOOGL");

        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        when(mockResponse.isSuccessful()).thenReturn(true);
        when(mockResponse.body()).thenReturn(mockResponseBody);
        when(mockResponseBody.string())
                .thenReturn("invalid json")
                .thenReturn(googleChartResponse);

        List<Map<String, Object>> charts = graphService.getCharts(testUser.getId());

        assertThat(charts).hasSize(1);
        assertThat(charts.get(0).get("symbol")).isEqualTo("GOOGL");

        verify(mockHttpClient, times(2)).newCall(any(Request.class));
    }

    @Test
    void getCharts_verifyCorrectApiUrl() throws IOException {
        Portfolio portfolio = createPortfolio(appleSymbol, 10, BigDecimal.valueOf(150.00));
        portfolioRepository.save(portfolio);

        String appleChartResponse = createMockChartResponse("AAPL");
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        lenient().when(mockResponse.isSuccessful()).thenReturn(true);
        lenient().when(mockResponse.code()).thenReturn(200);
        lenient().when(mockResponse.body()).thenReturn(mockResponseBody);
        lenient().when(mockResponseBody.string()).thenReturn(appleChartResponse);

        graphService.getCharts(testUser.getId());

        verify(mockHttpClient).newCall(argThat(request -> {
            String url = request.url().toString();
            return url.contains("/stock/v3/get-chart") &&
                    url.contains("interval=5m") &&
                    url.contains("symbol=AAPL") &&
                    url.contains("range=1d") &&
                    url.contains("region=US") &&
                    url.contains("includePrePost=false") &&
                    url.contains("useYfid=true") &&
                    url.contains("includeAdjustedClose=true");
        }));
    }

    @Test
    void getCharts_verifyCorrectHeaders() throws IOException {
        Portfolio portfolio = createPortfolio(appleSymbol, 10, BigDecimal.valueOf(150.00));
        portfolioRepository.save(portfolio);

        String appleChartResponse = createMockChartResponse("AAPL");
        when(mockHttpClient.newCall(any(Request.class))).thenReturn(mockCall);
        when(mockCall.execute()).thenReturn(mockResponse);
        lenient().when(mockResponse.isSuccessful()).thenReturn(true);
        lenient().when(mockResponse.code()).thenReturn(200);
        lenient().when(mockResponse.body()).thenReturn(mockResponseBody);
        lenient().when(mockResponseBody.string()).thenReturn(appleChartResponse);

        graphService.getCharts(testUser.getId());

        verify(mockHttpClient).newCall(argThat(request -> {
            Headers headers = request.headers();
            return headers.get("x-rapidapi-key") != null &&
                    headers.get("x-rapidapi-host") != null &&
                    headers.get("User-Agent") != null &&
                    headers.get("User-Agent").equals("Portfolio-Backend/1.0");
        }));
    }

    private Portfolio createPortfolio(Symbol symbol, int shares, BigDecimal avgCost) {
        return createPortfolio(testUser, symbol, shares, avgCost);
    }

    private Portfolio createPortfolio(User user, Symbol symbol, int shares, BigDecimal avgCost) {
        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(user.getId());
        portfolio.setUser(user);
        portfolio.setSymbol(symbol);
        portfolio.setSharesOwned(shares);
        portfolio.setAverageCostBasis(avgCost);
        return portfolio;
    }

    private String createMockChartResponse(String symbol) {
        return String.format("""
                {
                    "chart": {
                        "result": [{
                            "meta": {
                                "currency": "USD",
                                "symbol": "%s",
                                "exchangeName": "NMS",
                                "fullExchangeName": "NASDAQ",
                                "instrumentType": "EQUITY",
                                "firstTradeDate": 345479400,
                                "regularMarketTime": 1674576000,
                                "regularMarketPrice": 150.82,
                                "chartPreviousClose": 148.48
                            },
                            "timestamp": [1674576000, 1674576300, 1674576600],
                            "indicators": {
                                "quote": [{
                                    "open": [148.89, 149.25, 149.40],
                                    "high": [149.20, 149.75, 149.60],
                                    "low": [148.50, 149.00, 149.20],
                                    "close": [149.00, 149.50, 149.35],
                                    "volume": [1000000, 950000, 1100000]
                                }],
                                "adjclose": [{
                                    "adjclose": [149.00, 149.50, 149.35]
                                }]
                            }
                        }],
                        "error": null
                    }
                }
                """, symbol);
    }
}
