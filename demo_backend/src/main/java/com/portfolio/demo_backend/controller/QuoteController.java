package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.QuoteDTO;
import com.portfolio.demo_backend.service.QuoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @GetMapping("/last")
    public ResponseEntity<QuoteDTO> getLastQuote(@RequestParam String symbol) {
        try {
            return ResponseEntity.ok(quoteService.getLastQuote(symbol));
        } catch (Exception e) {
            return ResponseEntity.status(502).build();
        }
    }
}
