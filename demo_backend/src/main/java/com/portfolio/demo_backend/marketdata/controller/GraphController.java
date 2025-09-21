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
public class GraphController {

    private final GraphService graphService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getChartsForUserPortfolio(@PathVariable Long userId) {

        log.info("Getting chart data for user portfolio: userId={}", userId);

        try {
            List<Map<String, Object>> charts = graphService.getCharts(userId);
            log.info("Successfully retrieved chart data for {} symbols for user {}", charts.size(), userId);
            return ResponseEntity.ok(charts);
        } catch (Exception e) {
            log.error("Error retrieving chart data for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
