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
class PriceServiceUnitTest {

    @Mock
    private RapidApiClient rapidApiClient;

    @Mock
    private SymbolRepository symbolRepository;

    @Mock
    private MarketDataMapper marketDataMapper;

    @InjectMocks
    private PriceService priceService;

    @Test
    void getAllCurrentPrices_success_returnsQuoteMap() throws IOException {
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

        Map<String, YahooQuoteDTO> result = priceService.getAllCurrentPrices();

        assertThat(result).hasSize(2);
        assertThat(result).containsKey("AAPL");
        assertThat(result).containsKey("MSFT");
        assertThat(result.get("AAPL").getPrice()).isEqualTo(150.0);
        assertThat(result.get("MSFT").getPrice()).isEqualTo(300.0);

        verify(rapidApiClient).getQuotes(List.of("AAPL", "MSFT"));
    }

    @Test
    void getAllCurrentPrices_noEnabledSymbols_returnsEmptyMap() {
        Symbol disabledSymbol = createSymbol("AAPL", "Apple Inc", false);
        when(symbolRepository.findAll()).thenReturn(List.of(disabledSymbol));

        Map<String, YahooQuoteDTO> result = priceService.getAllCurrentPrices();

        assertThat(result).isEmpty();
        verifyNoInteractions(rapidApiClient);
    }

    @Test
    void getAllCurrentPrices_emptyDatabase_returnsEmptyMap() {
        when(symbolRepository.findAll()).thenReturn(List.of());

        Map<String, YahooQuoteDTO> result = priceService.getAllCurrentPrices();

        assertThat(result).isEmpty();
        verifyNoInteractions(rapidApiClient);
    }

    @Test
    void getAllCurrentPrices_rapidApiRateLimitException_propagatesException() throws IOException {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findAll()).thenReturn(List.of(symbol));
        when(rapidApiClient.getQuotes(List.of("AAPL"))).thenThrow(new ApiRateLimitException("RapidAPI Yahoo Finance"));

        assertThatThrownBy(() -> priceService.getAllCurrentPrices())
                .isInstanceOf(ApiRateLimitException.class)
                .hasMessageContaining("RapidAPI Yahoo Finance");
    }

    @Test
    void getAllCurrentPrices_rapidApiMarketDataException_propagatesException() throws IOException {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findAll()).thenReturn(List.of(symbol));
        when(rapidApiClient.getQuotes(List.of("AAPL")))
                .thenThrow(new MarketDataUnavailableException("RapidAPI Yahoo Finance", "Server error"));

        assertThatThrownBy(() -> priceService.getAllCurrentPrices())
                .isInstanceOf(MarketDataUnavailableException.class)
                .hasMessageContaining("Server error");
    }

    @Test
    void getAllCurrentPrices_rapidApiIOException_wrapsInMarketDataException() throws IOException {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findAll()).thenReturn(List.of(symbol));
        when(rapidApiClient.getQuotes(List.of("AAPL"))).thenThrow(new IOException("Connection timeout"));

        assertThatThrownBy(() -> priceService.getAllCurrentPrices())
                .isInstanceOf(MarketDataUnavailableException.class)
                .hasMessageContaining("Failed to fetch price data")
                .hasMessageContaining("Connection timeout");
    }

    @Test
    void getCurrentPrice_success_returnsQuoteDTO() throws IOException {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(symbol));

        RapidApiClient.Quote quote = createQuote("AAPL", 150.0, 2.5, 1.69);
        when(rapidApiClient.getQuote("AAPL")).thenReturn(quote);

        YahooQuoteDTO expectedDto = createYahooQuoteDTO("AAPL", 150.0, 2.5, 1.69);
        when(marketDataMapper.toYahooQuoteDTO(quote)).thenReturn(expectedDto);

        YahooQuoteDTO result = priceService.getCurrentPrice("AAPL");

        assertThat(result).isNotNull();
        assertThat(result.getSymbol()).isEqualTo("AAPL");
        assertThat(result.getPrice()).isEqualTo(150.0);
        assertThat(result.getChange()).isEqualTo(2.5);
        assertThat(result.getChangePercent()).isEqualTo(1.69);
        assertThat(result.getCurrency()).isEqualTo("USD");
    }

    @Test
    void getCurrentPrice_symbolNotFound_returnsNull() {
        when(symbolRepository.findBySymbol("INVALID")).thenReturn(Optional.empty());

        YahooQuoteDTO result = priceService.getCurrentPrice("INVALID");

        assertThat(result).isNull();
        verifyNoInteractions(rapidApiClient);
    }

    @Test
    void getCurrentPrice_symbolDisabled_returnsNull() {
        Symbol disabledSymbol = createSymbol("AAPL", "Apple Inc", false);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(disabledSymbol));

        YahooQuoteDTO result = priceService.getCurrentPrice("AAPL");

        assertThat(result).isNull();
        verifyNoInteractions(rapidApiClient);
    }

    @Test
    void getCurrentPrice_rapidApiReturnsNull_returnsNull() throws IOException {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(symbol));
        when(rapidApiClient.getQuote("AAPL")).thenReturn(null);

        YahooQuoteDTO result = priceService.getCurrentPrice("AAPL");

        assertThat(result).isNull();
    }

    @Test
    void getCurrentPrice_rapidApiRateLimitException_propagatesException() throws IOException {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(symbol));
        when(rapidApiClient.getQuote("AAPL")).thenThrow(new ApiRateLimitException("RapidAPI Yahoo Finance"));

        assertThatThrownBy(() -> priceService.getCurrentPrice("AAPL"))
                .isInstanceOf(ApiRateLimitException.class)
                .hasMessageContaining("RapidAPI Yahoo Finance");
    }

    @Test
    void getCurrentPrice_rapidApiMarketDataException_propagatesException() throws IOException {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(symbol));
        when(rapidApiClient.getQuote("AAPL"))
                .thenThrow(new MarketDataUnavailableException("RapidAPI Yahoo Finance", "Server error"));

        assertThatThrownBy(() -> priceService.getCurrentPrice("AAPL"))
                .isInstanceOf(MarketDataUnavailableException.class)
                .hasMessageContaining("Server error");
    }

    @Test
    void getCurrentPrice_rapidApiIOException_wrapsInMarketDataException() throws IOException {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(symbol));
        when(rapidApiClient.getQuote("AAPL")).thenThrow(new IOException("Connection timeout"));

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
