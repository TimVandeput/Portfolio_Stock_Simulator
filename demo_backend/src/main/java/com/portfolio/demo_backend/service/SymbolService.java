package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.SymbolEntity;
import com.portfolio.demo_backend.dto.SymbolDTO;
import com.portfolio.demo_backend.exception.symbol.ImportInProgressException;
import com.portfolio.demo_backend.exception.symbol.SymbolInUseException;
import com.portfolio.demo_backend.dto.ImportStatusDTO;
import com.portfolio.demo_backend.dto.ImportSummaryDTO;
import com.portfolio.demo_backend.mapper.SymbolMapper;
import com.portfolio.demo_backend.marketdata.integration.FinnhubClient;
import com.portfolio.demo_backend.marketdata.integration.FinnhubClient.SymbolItem;
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
    private final FinnhubClient finnhub;
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
        List<NormItem> selected = selectAndFilterSymbols(all, universe);
        ImportCounts counts = saveSelectedSymbols(selected);

        int skipped = Math.max(0, all.size() - selected.size());
        return new ImportSummaryDTO(counts.imported, counts.updated, skipped);
    }

    private List<NormItem> selectAndFilterSymbols(List<SymbolItem> allSymbols, String universe) {
        final Set<String> allowedMics = allowedMicsFor(universe);
        final int limit = capFor(universe);

        return allSymbols.stream()
                .filter(Objects::nonNull)
                .filter(this::isValidSymbolItem)
                .filter(it -> isAllowedExchange(it, allowedMics))
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
    }

    private boolean isValidSymbolItem(SymbolItem item) {
        return item.symbol != null && !item.symbol.isBlank() &&
                item.description != null && !item.description.isBlank() &&
                (item.type == null || "Common Stock".equalsIgnoreCase(item.type)) &&
                (item.currency == null || "USD".equalsIgnoreCase(item.currency));
    }

    private boolean isAllowedExchange(SymbolItem item, Set<String> allowedMics) {
        if (item.mic == null) {
            return true;
        }
        return allowedMics.isEmpty() || allowedMics.contains(item.mic);
    }

    private ImportCounts saveSelectedSymbols(List<NormItem> selected) {
        int imported = 0, updated = 0;

        for (NormItem ni : selected) {
            SymbolItem item = ni.raw;
            String symbol = ni.sym;

            SymbolEntity entity = symbolRepository.findBySymbol(symbol).orElseGet(SymbolEntity::new);
            boolean isNew = (entity.getId() == null);

            if (isNew) {
                entity.setSymbol(symbol);
                entity.setEnabled(true);
                imported++;
            } else {
                updated++;
            }

            updateSymbolEntity(entity, item);
            symbolRepository.save(entity);
        }

        return new ImportCounts(imported, updated);
    }

    private void updateSymbolEntity(SymbolEntity entity, SymbolItem item) {
        entity.setName(item.description);
        entity.setExchange(item.mic != null ? item.mic : "US");
        entity.setCurrency(item.currency);
        entity.setMic(item.mic);
    }

    private static class ImportCounts {
        final int imported;
        final int updated;

        ImportCounts(int imported, int updated) {
            this.imported = imported;
            this.updated = updated;
        }
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

    public List<String> getEnabledSymbols() {
        return symbolRepository.findEnabledSymbols();
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
