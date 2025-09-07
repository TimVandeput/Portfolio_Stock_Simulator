package com.portfolio.demo_backend.marketdata.service;

import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.mapper.MarketDataMapper;
import com.portfolio.demo_backend.marketdata.integration.RapidApiClient;
import com.portfolio.demo_backend.exception.marketdata.ApiRateLimitException;
import com.portfolio.demo_backend.exception.marketdata.MarketDataUnavailableException;
import com.portfolio.demo_backend.model.SymbolEntity;
import com.portfolio.demo_backend.repository.SymbolRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PriceService {

    private final RapidApiClient rapidApiClient;
    private final SymbolRepository symbolRepository;

    public Map<String, YahooQuoteDTO> getAllCurrentPrices() {
        log.info("Fetching all enabled symbols from database");

        List<SymbolEntity> enabledSymbols = symbolRepository.findAll().stream()
                .filter(SymbolEntity::isEnabled)
                .collect(Collectors.toList());
        List<String> symbolNames = enabledSymbols.stream()
                .map(SymbolEntity::getSymbol)
                .collect(Collectors.toList());

        log.info("Found {} enabled symbols, fetching quotes from RapidAPI", symbolNames.size());

        if (symbolNames.isEmpty()) {
            log.warn("No enabled symbols found in database");
            return new HashMap<>();
        }

        try {
            List<RapidApiClient.Quote> quotes = rapidApiClient.getQuotes(symbolNames);
            log.info("Successfully fetched {} quotes from RapidAPI", quotes.size());

            Map<String, YahooQuoteDTO> result = new HashMap<>();
            for (RapidApiClient.Quote quote : quotes) {
                YahooQuoteDTO dto = MarketDataMapper.toYahooQuoteDTO(quote);
                result.put(quote.symbol, dto);
            }

            int missingQuotes = symbolNames.size() - quotes.size();
            if (missingQuotes > 0) {
                log.warn("Missing {} quotes from RapidAPI response", missingQuotes);
            }

            return result;
        } catch (ApiRateLimitException e) {
            log.error("Rate limit exceeded while fetching all current prices: {}", e.getMessage());
            throw e;
        } catch (MarketDataUnavailableException e) {
            log.error("Market data unavailable while fetching all current prices: {}", e.getMessage());
            throw e;
        } catch (IOException e) {
            log.error("IO error while fetching all current prices: {}", e.getMessage(), e);
            throw new MarketDataUnavailableException("RapidAPI Yahoo Finance",
                    "Failed to fetch price data: " + e.getMessage());
        }
    }

    public YahooQuoteDTO getCurrentPrice(String symbol) {
        log.info("Fetching current price for symbol: {}", symbol);

        SymbolEntity symbolEntity = symbolRepository.findBySymbol(symbol).orElse(null);
        if (symbolEntity == null) {
            log.warn("Symbol {} not found in database", symbol);
            return null;
        }

        if (!symbolEntity.isEnabled()) {
            log.warn("Symbol {} is disabled", symbol);
            return null;
        }

        try {
            RapidApiClient.Quote quote = rapidApiClient.getQuote(symbol);
            if (quote == null) {
                log.warn("No quote returned from RapidAPI for symbol: {}", symbol);
                return null;
            }

            return MarketDataMapper.toYahooQuoteDTO(quote);
        } catch (ApiRateLimitException e) {
            log.error("Rate limit exceeded while fetching price for symbol {}: {}", symbol, e.getMessage());
            throw e;
        } catch (MarketDataUnavailableException e) {
            log.error("Market data unavailable while fetching price for symbol {}: {}", symbol, e.getMessage());
            throw e;
        } catch (IOException e) {
            log.error("IO error while fetching price for symbol {}: {}", symbol, e.getMessage(), e);
            throw new MarketDataUnavailableException("RapidAPI Yahoo Finance",
                    "Failed to fetch price data for " + symbol + ": " + e.getMessage());
        }
    }
}
