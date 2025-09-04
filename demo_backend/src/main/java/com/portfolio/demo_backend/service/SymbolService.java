package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.SymbolEntity;
import com.portfolio.demo_backend.dto.SymbolDTO;
import com.portfolio.demo_backend.exception.symbol.ImportInProgressException;
import com.portfolio.demo_backend.exception.symbol.SymbolInUseException;
import com.portfolio.demo_backend.dto.ImportStatusDTO;
import com.portfolio.demo_backend.dto.ImportSummaryDTO;
import com.portfolio.demo_backend.mapper.SymbolMapper;
import com.portfolio.demo_backend.repository.SymbolRepository;
import com.portfolio.demo_backend.marketdata.integration.RapidApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
@Slf4j
public class SymbolService {

    private final SymbolRepository symbolRepository;
    private final SymbolInUseChecker inUseChecker;
    private final RapidApiClient rapidApiClient;

    private final AtomicBoolean importRunning = new AtomicBoolean(false);
    private volatile Instant lastImportedAt;
    private volatile ImportSummaryDTO lastSummary;

    public ImportSummaryDTO importUniverse(String universe) throws IOException {
        if (!importRunning.compareAndSet(false, true)) {
            throw new ImportInProgressException();
        }
        try {
            var summary = importFromRapidApi(universe);
            lastImportedAt = Instant.now();
            lastSummary = summary;
            return summary;
        } finally {
            importRunning.set(false);
        }
    }

    private ImportSummaryDTO importFromRapidApi(String universe) throws IOException {
        log.info("Importing symbols from RapidAPI for universe: {}", universe);

        List<RapidApiClient.SymbolInfo> symbols = rapidApiClient.getTopSymbols(universe, 50);

        if (symbols.isEmpty()) {
            log.warn("No symbols returned from RapidAPI for universe: {}", universe);
            return new ImportSummaryDTO(0, 0, 0);
        }

        int imported = 0, updated = 0;

        for (RapidApiClient.SymbolInfo symbolInfo : symbols) {
            SymbolEntity e = symbolRepository.findBySymbol(symbolInfo.symbol).orElseGet(SymbolEntity::new);
            boolean isNew = (e.getId() == null);

            if (isNew) {
                e.setSymbol(symbolInfo.symbol);
                e.setEnabled(true);
                imported++;
            } else {
                updated++;
            }

            e.setName(symbolInfo.name);
            e.setExchange(symbolInfo.exchange);
            e.setMic(symbolInfo.mic);
            e.setCurrency(symbolInfo.currency);

            symbolRepository.save(e);
        }

        log.info("Import completed: {} new, {} updated, {} total symbols from RapidAPI",
                imported, updated, symbols.size());
        return new ImportSummaryDTO(imported, updated, 0);
    }

    public Page<SymbolDTO> list(String q, Boolean enabled, Pageable pageable) {
        Page<SymbolEntity> page = symbolRepository.search(emptyToNull(q), enabled, ensureSort(pageable));
        return page.map(e -> SymbolMapper.toSymbol(e, inUseChecker.isInUse(e.getSymbol())));
    }

    public SymbolDTO setEnabled(Long id, boolean enabled) {
        SymbolEntity e = symbolRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Symbol not found"));

        boolean inUse = inUseChecker.isInUse(e.getSymbol());
        if (!enabled && inUse) {
            throw new SymbolInUseException(e.getSymbol());
        }

        e.setEnabled(enabled);
        symbolRepository.save(e);
        return SymbolMapper.toSymbol(e, inUse);
    }

    private String emptyToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }

    private Pageable ensureSort(Pageable p) {
        if (p.getSort().isUnsorted()) {
            return PageRequest.of(p.getPageNumber(), p.getPageSize(),
                    Sort.by(Sort.Order.asc("symbol")));
        }
        return p;
    }

    public ImportStatusDTO importStatus() {
        return new ImportStatusDTO(importRunning.get(),
                lastImportedAt != null ? lastImportedAt.toString() : null,
                lastSummary);
    }
}
