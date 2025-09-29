package com.portfolio.demo_backend.controller;

import com.portfolio.demo_backend.dto.symbol.ImportStatusDTO;
import com.portfolio.demo_backend.dto.symbol.ImportSummaryDTO;
import com.portfolio.demo_backend.dto.symbol.SymbolDTO;
import com.portfolio.demo_backend.mapper.SymbolMapper;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.service.SymbolService;
import com.portfolio.demo_backend.service.data.ImportData;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/symbols")
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
        Page<Symbol> symbols = service.list(q, enabled, pageable);
        return symbols.map(SymbolMapper::toSymbol);
    }

    @PutMapping("/{id}/enabled")
    public SymbolDTO setEnabled(@PathVariable Long id, @RequestBody ToggleBody body) {
        Symbol symbol = service.setEnabled(id, body.enabled);
        return SymbolMapper.toSymbol(symbol);
    }

    public static class ToggleBody {
        public boolean enabled;
    }

    @GetMapping("/import/status")
    public ImportStatusDTO status() {
        ImportData data = service.importStatus();
        return new ImportStatusDTO(
                data.isRunning(),
                data.getLastImportedAt() != null ? data.getLastImportedAt().toString() : null,
                data.getLastSummary());
    }
}
