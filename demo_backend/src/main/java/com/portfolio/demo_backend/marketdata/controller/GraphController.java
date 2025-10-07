package com.portfolio.demo_backend.marketdata.controller;

import com.portfolio.demo_backend.marketdata.service.GraphService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/market/charts")
@RequiredArgsConstructor
@Slf4j
/**
 * Market data endpoints for chart time-series per portfolio symbols.
 */
public class GraphController {

    private final GraphService graphService;

    /**
     * Get chart time-series for all symbols in a user's portfolio with a
     * specified time range (e.g., 1d, 5d, 1mo).
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getChartsForUserPortfolio(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "1d") String range) {

        log.info("Getting chart data for user portfolio: userId={}, range={}", userId, range);

        try {
            List<Map<String, Object>> charts = graphService.getCharts(userId, range);
            log.info("Successfully retrieved chart data for {} symbols for user {} with range {}", charts.size(),
                    userId, range);
            return ResponseEntity.ok(charts);
        } catch (Exception e) {
            log.error("Error retrieving chart data for user {} with range {}: {}", userId, range, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}