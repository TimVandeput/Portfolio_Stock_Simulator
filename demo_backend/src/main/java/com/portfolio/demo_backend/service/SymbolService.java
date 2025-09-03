package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.SymbolEntity;
import com.portfolio.demo_backend.dto.SymbolDTO;
import com.portfolio.demo_backend.exception.symbol.ImportInProgressException;
import com.portfolio.demo_backend.exception.symbol.SymbolInUseException;
import com.portfolio.demo_backend.dto.ImportStatusDTO;
import com.portfolio.demo_backend.dto.ImportSummaryDTO;
import com.portfolio.demo_backend.integration.finnhub.FinnhubAdminClient;
import com.portfolio.demo_backend.integration.finnhub.FinnhubAdminClient.SymbolItem;
import com.portfolio.demo_backend.mapper.SymbolMapper;
import com.portfolio.demo_backend.repository.SymbolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

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
            var summary = importFromFreeUniverse(universe);
            lastImportedAt = Instant.now();
            lastSummary = summary;
            return summary;
        } finally {
            importRunning.set(false);
        }
    }

    private ImportSummaryDTO importFromFreeUniverse(String universe) throws IOException {
        List<SymbolItem> all = finnhub.listSymbolsByExchange("US");
        final Set<String> allowedMics = allowedMicsFor(universe);
        final int limit = capFor(universe);

        List<NormItem> selected = all.stream()
                .filter(Objects::nonNull)
                .filter(it -> it.symbol != null && !it.symbol.isBlank())
                .filter(it -> it.description != null && !it.description.isBlank())
                .filter(it -> it.type == null || "Common Stock".equalsIgnoreCase(it.type))
                .filter(it -> it.currency == null || "USD".equalsIgnoreCase(it.currency))
                .filter(it -> {
                    if (it.mic == null)
                        return true;
                    return allowedMics.isEmpty() || allowedMics.contains(it.mic);
                })
                .map(it -> new NormItem(norm(it.symbol), it))
                .filter(ni -> ni.sym != null && !ni.sym.isBlank())
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(
                                ni -> ni.sym,
                                ni -> ni,
                                (a, b) -> a,
                                LinkedHashMap::new),
                        m -> m.values().stream()
                                .sorted(Comparator.comparing(ni -> ni.sym))
                                .limit(limit)
                                .collect(Collectors.toList())));

        int imported = 0, updated = 0;

        for (NormItem ni : selected) {
            SymbolItem it = ni.raw;
            String sym = ni.sym;

            SymbolEntity e = symbolRepository.findBySymbol(sym).orElseGet(SymbolEntity::new);
            boolean isNew = (e.getId() == null);

            if (isNew) {
                e.setSymbol(sym);
                e.setEnabled(true);
            }

            e.setName(it.description);
            e.setExchange(it.mic != null ? it.mic : "US");
            e.setCurrency(it.currency);
            e.setMic(it.mic);

            symbolRepository.save(e);
            if (isNew)
                imported++;
            else
                updated++;
        }

        int skipped = Math.max(0, all.size() - selected.size());
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

    private String norm(String s) {
        return s == null ? null : s.trim().toUpperCase(Locale.ROOT);
    }

    private Set<String> allowedMicsFor(String universe) {
        if (universe == null)
            return Set.of("XNAS", "XNYS");
        switch (universe.toUpperCase(Locale.ROOT)) {
            case "NDX":
                return Set.of("XNAS");
            case "GSPC":
                return Set.of("XNAS", "XNYS");
            default:
                return Set.of("XNAS", "XNYS");
        }
    }

    private int capFor(String universe) {
        if (universe == null)
            return 50;
        switch (universe.toUpperCase(Locale.ROOT)) {
            case "NDX":
                return 50;
            case "GSPC":
                return 50;
            default:
                return 50;
        }
    }

    private static class NormItem {
        final String sym;
        final SymbolItem raw;

        NormItem(String sym, SymbolItem raw) {
            this.sym = sym;
            this.raw = raw;
        }
    }
}
