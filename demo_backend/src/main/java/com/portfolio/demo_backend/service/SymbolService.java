package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.SymbolEntity;
import com.portfolio.demo_backend.dto.SymbolDTO;
import com.portfolio.demo_backend.exception.symbol.ImportInProgressException;
import com.portfolio.demo_backend.exception.symbol.SymbolInUseException;
import com.portfolio.demo_backend.dto.ImportStatusDTO;
import com.portfolio.demo_backend.dto.ImportSummaryDTO;
import com.portfolio.demo_backend.integration.finnhub.FinnhubAdminClient;
import com.portfolio.demo_backend.integration.finnhub.FinnhubAdminClient.Profile2;
import com.portfolio.demo_backend.mapper.SymbolMapper;
import com.portfolio.demo_backend.repository.SymbolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class SymbolService {

    private final SymbolRepository symbolRepository;
    private final FinnhubAdminClient finnhub;
    private final SymbolInUseChecker inUseChecker;

    private final AtomicBoolean importRunning = new AtomicBoolean(false);
    private volatile Instant lastImportedAt;
    private volatile ImportSummaryDTO lastSummary;

    public ImportSummaryDTO importUniverse(String universe) throws IOException {
        if (!importRunning.compareAndSet(false, true)) {
            throw new ImportInProgressException();
        }
        try {
            var summary = doImport(mapUniverse(universe));
            lastImportedAt = Instant.now();
            lastSummary = summary;
            return summary;
        } finally {
            importRunning.set(false);
        }
    }

    public ImportSummaryDTO doImport(String universe) throws IOException {
        String idx = mapUniverse(universe);
        List<String> tickers = finnhub.getIndexConstituents(idx);

        int imported = 0, updated = 0, skipped = 0;
        for (String t : tickers) {
            Profile2 p;
            try {
                p = finnhub.throttled(() -> finnhub.getProfile2(t));
            } catch (IOException e) {
                skipped++;
                continue;
            }
            if (p == null || p.ticker == null || p.name == null) {
                skipped++;
                continue;
            }

            SymbolEntity e = symbolRepository.findBySymbol(p.ticker).orElse(null);
            if (e == null) {
                e = new SymbolEntity();
                e.setSymbol(p.ticker);
                e.setName(p.name);
                e.setExchange(p.exchange);
                e.setCurrency(p.currency);
                e.setMic(p.mic);
                e.setEnabled(true);
                symbolRepository.save(e);
                imported++;
            } else {
                e.setName(p.name);
                e.setExchange(p.exchange);
                e.setCurrency(p.currency);
                e.setMic(p.mic);
                symbolRepository.save(e);
                updated++;
            }
        }
        return new ImportSummaryDTO(imported, updated, skipped);
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

    private String mapUniverse(String u) {
        if (u == null)
            return "^NDX";
        return switch (u.toUpperCase()) {
            case "NDX" -> "^NDX";
            case "GSPC" -> "^GSPC";
            default -> "^NDX";
        };
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
