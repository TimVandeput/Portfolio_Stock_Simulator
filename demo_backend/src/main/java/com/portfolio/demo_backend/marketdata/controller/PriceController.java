package com.portfolio.demo_backend.marketdata.controller;

import com.portfolio.demo_backend.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
@Slf4j
public class PriceController {

    private final PriceService priceService;

    @GetMapping("/current")
    public ResponseEntity<Map<String, YahooQuoteDTO>> getAllCurrentPrices() {
        try {
            log.info("Fetching current prices for all enabled symbols");
            Map<String, YahooQuoteDTO> prices = priceService.getAllCurrentPrices();
            log.info("Successfully fetched prices for {} symbols", prices.size());
            return ResponseEntity.ok(prices);
        } catch (IOException e) {
            log.error("Failed to fetch current prices: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            log.error("Unexpected error fetching current prices: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/current/{symbol}")
    public ResponseEntity<YahooQuoteDTO> getCurrentPrice(@PathVariable String symbol) {
        try {
            log.info("Fetching current price for symbol: {}", symbol);
            YahooQuoteDTO quote = priceService.getCurrentPrice(symbol.toUpperCase());
            if (quote == null) {
                log.warn("No price data found for symbol: {}", symbol);
                return ResponseEntity.notFound().build();
            }
            log.info("Successfully fetched price for {}: ${}", symbol, quote.getPrice());
            return ResponseEntity.ok(quote);
        } catch (IOException e) {
            log.error("Failed to fetch price for {}: {}", symbol, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        } catch (Exception e) {
            log.error("Unexpected error fetching price for {}: {}", symbol, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
