package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.SymbolDTO;
import com.portfolio.demo_backend.dto.ImportStatusDTO;
import com.portfolio.demo_backend.dto.ImportSummaryDTO;
import com.portfolio.demo_backend.service.SymbolService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/symbols")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SymbolController {

    private final SymbolService service;

    @PostMapping("/import")
    public ResponseEntity<ImportSummaryDTO> importSymbols(
            @RequestParam(defaultValue = "NDX") String universe) throws IOException {
        return ResponseEntity.ok(service.importUniverse(universe));
    }

    @GetMapping
    public Page<SymbolDTO> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "25") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return service.list(q, enabled, pageable);
    }

    @PutMapping("/{id}/enabled")
    public SymbolDTO setEnabled(@PathVariable Long id, @RequestBody ToggleBody body) {
        return service.setEnabled(id, body.enabled);
    }

    public static class ToggleBody {
        public boolean enabled;
    }

    @GetMapping("/import/status")
    public ImportStatusDTO status() {
        return service.importStatus();
    }
}
