package com.portfolio.demo_backend.marketdata.controller;

import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
@Slf4j
public class PriceController {

    private final PriceService priceService;

    @GetMapping("/current")
    public ResponseEntity<Map<String, YahooQuoteDTO>> getAllCurrentPrices() {
        log.info("Fetching current prices for all enabled symbols");
        Map<String, YahooQuoteDTO> prices = priceService.getAllCurrentPrices();
        log.info("Successfully fetched prices for {} symbols", prices.size());
        return ResponseEntity.ok(prices);
    }
}
