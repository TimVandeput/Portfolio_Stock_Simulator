package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.integration.RapidApiClient;
import com.portfolio.demo_backend.marketdata.mapper.MarketDataMapper;
import com.portfolio.demo_backend.exception.marketdata.ApiRateLimitException;
import com.portfolio.demo_backend.exception.marketdata.MarketDataUnavailableException;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.repository.SymbolRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
/**
 * Unit tests for {@link PriceService} covering current price retrieval for
 * single symbols and all enabled symbols, including error propagation.
 */
class PriceServiceUnitTest {

    @Mock
    private RapidApiClient rapidApiClient;

    @Mock
    private SymbolRepository symbolRepository;

    @Mock
    private MarketDataMapper marketDataMapper;

    @InjectMocks
    private PriceService priceService;

    /**
     * Aggregates quotes for all enabled symbols and maps to DTOs.
     */
    @Test
    void getAllCurrentPrices_success_returnsQuoteMap() throws IOException {
        // Given: Two enabled symbols and one disabled, with quotes available
        Symbol symbol1 = createSymbol("AAPL", "Apple Inc", true);
        Symbol symbol2 = createSymbol("MSFT", "Microsoft", true);
        Symbol symbol3 = createSymbol("GOOGL", "Google", false); // disabled

        when(symbolRepository.findAll()).thenReturn(List.of(symbol1, symbol2, symbol3));

        RapidApiClient.Quote quote1 = createQuote("AAPL", 150.0, 2.5, 1.69);
        RapidApiClient.Quote quote2 = createQuote("MSFT", 300.0, -5.0, -1.64);

        when(rapidApiClient.getQuotes(List.of("AAPL", "MSFT"))).thenReturn(List.of(quote1, quote2));

        YahooQuoteDTO dto1 = createYahooQuoteDTO("AAPL", 150.0, 2.5, 1.69);
        YahooQuoteDTO dto2 = createYahooQuoteDTO("MSFT", 300.0, -5.0, -1.64);
        when(marketDataMapper.toYahooQuoteDTO(quote1)).thenReturn(dto1);
        when(marketDataMapper.toYahooQuoteDTO(quote2)).thenReturn(dto2);

        // When: Fetching all current prices
        Map<String, YahooQuoteDTO> result = priceService.getAllCurrentPrices();

        // Then: Only enabled symbols are returned and mapped
        assertThat(result).hasSize(2);
        assertThat(result).containsKey("AAPL");
        assertThat(result).containsKey("MSFT");
        assertThat(result.get("AAPL").getPrice()).isEqualTo(150.0);
        assertThat(result.get("MSFT").getPrice()).isEqualTo(300.0);

        verify(rapidApiClient).getQuotes(List.of("AAPL", "MSFT"));
    }

    /**
     * Returns empty map when no enabled symbols exist.
     */
    @Test
    void getAllCurrentPrices_noEnabledSymbols_returnsEmptyMap() {
        // Given: Only disabled symbols in repository
        Symbol disabledSymbol = createSymbol("AAPL", "Apple Inc", false);
        when(symbolRepository.findAll()).thenReturn(List.of(disabledSymbol));

        // When: Fetching all prices
        Map<String, YahooQuoteDTO> result = priceService.getAllCurrentPrices();

        // Then: No calls to rapid client and result is empty
        assertThat(result).isEmpty();
        verifyNoInteractions(rapidApiClient);
    }

    /**
     * Returns empty map when repository has no symbols.
     */
    @Test
    void getAllCurrentPrices_emptyDatabase_returnsEmptyMap() {
        // Given: Empty repository
        when(symbolRepository.findAll()).thenReturn(List.of());

        // When: Fetching
        Map<String, YahooQuoteDTO> result = priceService.getAllCurrentPrices();

        // Then: Empty
        assertThat(result).isEmpty();
        verifyNoInteractions(rapidApiClient);
    }

    /**
     * Propagates API rate limit exceptions from the client.
     */
    @Test
    void getAllCurrentPrices_rapidApiRateLimitException_propagatesException() throws IOException {
        // Given: Enabled symbol and client throws rate limit
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findAll()).thenReturn(List.of(symbol));
        when(rapidApiClient.getQuotes(List.of("AAPL"))).thenThrow(new ApiRateLimitException("RapidAPI Yahoo Finance"));

        // When/Then: Exception is propagated
        assertThatThrownBy(() -> priceService.getAllCurrentPrices())
                .isInstanceOf(ApiRateLimitException.class)
                .hasMessageContaining("RapidAPI Yahoo Finance");
    }

    /**
     * Propagates market data exceptions from the client.
     */
    @Test
    void getAllCurrentPrices_rapidApiMarketDataException_propagatesException() throws IOException {
        // Given: Enabled symbol and client throws market data exception
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findAll()).thenReturn(List.of(symbol));
        when(rapidApiClient.getQuotes(List.of("AAPL")))
                .thenThrow(new MarketDataUnavailableException("RapidAPI Yahoo Finance", "Server error"));

        // When/Then: Exception bubbles up
        assertThatThrownBy(() -> priceService.getAllCurrentPrices())
                .isInstanceOf(MarketDataUnavailableException.class)
                .hasMessageContaining("Server error");
    }

    /**
     * Wraps IOExceptions from the client into MarketDataUnavailableException.
     */
    @Test
    void getAllCurrentPrices_rapidApiIOException_wrapsInMarketDataException() throws IOException {
        // Given: Enabled symbol and client throws IO exception
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findAll()).thenReturn(List.of(symbol));
        when(rapidApiClient.getQuotes(List.of("AAPL"))).thenThrow(new IOException("Connection timeout"));

        // When/Then: IOException is wrapped
        assertThatThrownBy(() -> priceService.getAllCurrentPrices())
                .isInstanceOf(MarketDataUnavailableException.class)
                .hasMessageContaining("Failed to fetch price data")
                .hasMessageContaining("Connection timeout");
    }

    /**
     * Returns current price for a single enabled symbol.
     */
    @Test
    void getCurrentPrice_success_returnsQuoteDTO() throws IOException {
        // Given: Enabled symbol exists and quote is returned
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(symbol));

        RapidApiClient.Quote quote = createQuote("AAPL", 150.0, 2.5, 1.69);
        when(rapidApiClient.getQuote("AAPL")).thenReturn(quote);

        YahooQuoteDTO expectedDto = createYahooQuoteDTO("AAPL", 150.0, 2.5, 1.69);
        when(marketDataMapper.toYahooQuoteDTO(quote)).thenReturn(expectedDto);

        // When: Fetching current price
        YahooQuoteDTO result = priceService.getCurrentPrice("AAPL");

        // Then: Mapped DTO is returned
        assertThat(result).isNotNull();
        assertThat(result.getSymbol()).isEqualTo("AAPL");
        assertThat(result.getPrice()).isEqualTo(150.0);
        assertThat(result.getChange()).isEqualTo(2.5);
        assertThat(result.getChangePercent()).isEqualTo(1.69);
        assertThat(result.getCurrency()).isEqualTo("USD");
    }

    /**
     * Returns null when the symbol is not found.
     */
    @Test
    void getCurrentPrice_symbolNotFound_returnsNull() {
        // Given: Repository doesn't contain the symbol
        when(symbolRepository.findBySymbol("INVALID")).thenReturn(Optional.empty());

        // When: Fetching price
        YahooQuoteDTO result = priceService.getCurrentPrice("INVALID");

        // Then: Null is returned and client is not called
        assertThat(result).isNull();
        verifyNoInteractions(rapidApiClient);
    }

    /**
     * Returns null when the symbol is disabled.
     */
    @Test
    void getCurrentPrice_symbolDisabled_returnsNull() {
        // Given: Symbol exists but is disabled
        Symbol disabledSymbol = createSymbol("AAPL", "Apple Inc", false);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(disabledSymbol));

        // When: Fetching price
        YahooQuoteDTO result = priceService.getCurrentPrice("AAPL");

        // Then: Null is returned and client is not called
        assertThat(result).isNull();
        verifyNoInteractions(rapidApiClient);
    }

    /**
     * Returns null when the client returns no data for the symbol.
     */
    @Test
    void getCurrentPrice_rapidApiReturnsNull_returnsNull() throws IOException {
        // Given: Enabled symbol exists but client returns null quote
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(symbol));
        when(rapidApiClient.getQuote("AAPL")).thenReturn(null);

        // When: Fetching price
        YahooQuoteDTO result = priceService.getCurrentPrice("AAPL");

        // Then: Null is returned
        assertThat(result).isNull();
    }

    /**
     * Propagates API rate limit exception for single symbol.
     */
    @Test
    void getCurrentPrice_rapidApiRateLimitException_propagatesException() throws IOException {
        // Given: Enabled symbol and client throws rate limit
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(symbol));
        when(rapidApiClient.getQuote("AAPL")).thenThrow(new ApiRateLimitException("RapidAPI Yahoo Finance"));

        // When/Then
        assertThatThrownBy(() -> priceService.getCurrentPrice("AAPL"))
                .isInstanceOf(ApiRateLimitException.class)
                .hasMessageContaining("RapidAPI Yahoo Finance");
    }

    /**
     * Propagates market data exception for single symbol.
     */
    @Test
    void getCurrentPrice_rapidApiMarketDataException_propagatesException() throws IOException {
        // Given: Enabled symbol and client throws market data exception
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(symbol));
        when(rapidApiClient.getQuote("AAPL"))
                .thenThrow(new MarketDataUnavailableException("RapidAPI Yahoo Finance", "Server error"));

        // When/Then
        assertThatThrownBy(() -> priceService.getCurrentPrice("AAPL"))
                .isInstanceOf(MarketDataUnavailableException.class)
                .hasMessageContaining("Server error");
    }

    /**
     * Wraps IOException into MarketDataUnavailableException for single symbol.
     */
    @Test
    void getCurrentPrice_rapidApiIOException_wrapsInMarketDataException() throws IOException {
        // Given: Enabled symbol and client throws IO exception
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(symbol));
        when(rapidApiClient.getQuote("AAPL")).thenThrow(new IOException("Connection timeout"));

        // When/Then
        assertThatThrownBy(() -> priceService.getCurrentPrice("AAPL"))
                .isInstanceOf(MarketDataUnavailableException.class)
                .hasMessageContaining("Failed to fetch price data for AAPL")
                .hasMessageContaining("Connection timeout");
    }

    private Symbol createSymbol(String symbol, String name, boolean enabled) {
        Symbol entity = new Symbol();
        entity.setId(1L);
        entity.setSymbol(symbol);
        entity.setName(name);
        entity.setEnabled(enabled);
        entity.setExchange("NASDAQ");
        entity.setCurrency("USD");
        entity.setMic("XNAS");
        return entity;
    }

    private RapidApiClient.Quote createQuote(String symbol, Double price, Double change, Double changePercent) {
        RapidApiClient.Quote quote = new RapidApiClient.Quote();
        quote.symbol = symbol;
        quote.price = price;
        quote.change = change;
        quote.changePercent = changePercent;
        quote.dayHigh = price + 5.0;
        quote.dayLow = price - 5.0;
        quote.previousClose = price - change;
        return quote;
    }

    private YahooQuoteDTO createYahooQuoteDTO(String symbol, Double price, Double change, Double changePercent) {
        YahooQuoteDTO dto = new YahooQuoteDTO();
        dto.setSymbol(symbol);
        dto.setPrice(price);
        dto.setChange(change);
        dto.setChangePercent(changePercent);
        dto.setCurrency("USD");
        dto.setDayHigh(price + 5.0);
        dto.setDayLow(price - 5.0);
        dto.setPreviousClose(price - change);
        return dto;
    }
}
