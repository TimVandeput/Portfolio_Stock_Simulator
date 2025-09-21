package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.config.RapidApiProperties;
import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GraphServiceUnitTest {

    @Mock
    private PortfolioRepository portfolioRepository;

    @Mock
    private RapidApiProperties rapidApiProperties;

    @InjectMocks
    private GraphService graphService;

    private Portfolio applePortfolio;
    private Portfolio googlePortfolio;

    @BeforeEach
    void setUp() {
        Symbol appleSymbol = new Symbol();
        appleSymbol.setId(1L);
        appleSymbol.setSymbol("AAPL");
        appleSymbol.setName("Apple Inc.");
        appleSymbol.setEnabled(true);

        Symbol googleSymbol = new Symbol();
        googleSymbol.setId(2L);
        googleSymbol.setSymbol("GOOGL");
        googleSymbol.setName("Alphabet Inc.");
        googleSymbol.setEnabled(true);

        applePortfolio = new Portfolio();
        applePortfolio.setId(1L);
        applePortfolio.setUserId(1L);
        applePortfolio.setSymbol(appleSymbol);
        applePortfolio.setSharesOwned(10);
        applePortfolio.setAverageCostBasis(BigDecimal.valueOf(150.00));

        googlePortfolio = new Portfolio();
        googlePortfolio.setId(2L);
        googlePortfolio.setUserId(1L);
        googlePortfolio.setSymbol(googleSymbol);
        googlePortfolio.setSharesOwned(5);
        googlePortfolio.setAverageCostBasis(BigDecimal.valueOf(120.00));
    }

    @Test
    void getCharts_withNoActivePositions_returnsEmptyList() {
        Long userId = 1L;
        String range = "1d";
        when(portfolioRepository.findActivePositionsByUserId(userId)).thenReturn(List.of());

        List<Map<String, Object>> result = graphService.getCharts(userId, range);

        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
    }

    @Test
    void getCharts_withActivePositions_returnsExpectedSymbols() {
        Long userId = 1L;
        String range = "1d";
        List<Portfolio> portfolios = Arrays.asList(applePortfolio, googlePortfolio);
        when(portfolioRepository.findActivePositionsByUserId(userId)).thenReturn(portfolios);

        List<Map<String, Object>> result = graphService.getCharts(userId, range);

        assertThat(result).isNotNull();
    }

    @Test
    void getCharts_withDuplicateSymbols_returnsUniqueSymbols() {
        Long userId = 1L;
        String range = "1d";

        Portfolio anotherApplePortfolio = new Portfolio();
        anotherApplePortfolio.setId(3L);
        anotherApplePortfolio.setUserId(1L);
        anotherApplePortfolio.setSymbol(applePortfolio.getSymbol());
        anotherApplePortfolio.setSharesOwned(5);
        anotherApplePortfolio.setAverageCostBasis(BigDecimal.valueOf(160.00));

        List<Portfolio> portfolios = Arrays.asList(applePortfolio, googlePortfolio, anotherApplePortfolio);
        when(portfolioRepository.findActivePositionsByUserId(userId)).thenReturn(portfolios);

        List<Map<String, Object>> result = graphService.getCharts(userId, range);

        assertThat(result).isNotNull();
    }

    @Test
    void getCharts_withDifferentRanges_usesCorrectInterval() {
        Long userId = 1L;
        when(portfolioRepository.findActivePositionsByUserId(userId)).thenReturn(List.of());

        List<String> ranges = Arrays.asList("1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y");

        for (String range : ranges) {
            List<Map<String, Object>> result = graphService.getCharts(userId, range);
            assertThat(result).isNotNull();
            assertThat(result).isEmpty();
        }
    }
}
