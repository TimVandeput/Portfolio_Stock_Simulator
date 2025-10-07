package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.dto.symbol.ImportSummaryDTO;
import com.portfolio.demo_backend.exception.symbol.ImportInProgressException;
import com.portfolio.demo_backend.service.data.ImportData;
import com.portfolio.demo_backend.marketdata.integration.FinnhubClient;
import com.portfolio.demo_backend.marketdata.integration.FinnhubClient.SymbolItem;
import com.portfolio.demo_backend.repository.SymbolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
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
        final int remainingCapacity = calculateRemainingCapacity();

        Set<String> existingSymbols = getExistingSymbolsForUniverse(allowedMics);

        return allSymbols.stream()
                .filter(Objects::nonNull)
                .filter(this::isValidSymbolItem)
                .filter(it -> isAllowedExchange(it, allowedMics))
                .map(it -> new NormItem(norm(it.symbol), it))
                .filter(ni -> StringUtils.hasText(ni.sym))
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(
                                ni -> ni.sym,
                                ni -> ni,
                                (a, b) -> a,
                                LinkedHashMap::new),
                        m -> {
                            List<NormItem> result = new ArrayList<>();
                            List<NormItem> newSymbols = new ArrayList<>();
                            List<NormItem> existingUpdates = new ArrayList<>();

                            for (NormItem ni : m.values()) {
                                if (existingSymbols.contains(ni.sym)) {
                                    existingUpdates.add(ni);
                                } else {
                                    newSymbols.add(ni);
                                }
                            }

                            result.addAll(existingUpdates);

                            newSymbols.stream()
                                    .sorted(Comparator.comparing(ni -> ni.sym))
                                    .limit(remainingCapacity)
                                    .forEach(result::add);

                            return result;
                        }));
    }

    private boolean isValidSymbolItem(SymbolItem item) {
        // Basic validation
        if (!StringUtils.hasText(item.symbol) || !StringUtils.hasText(item.description)) {
            return false;
        }

        // Only USD common stocks
        if (item.type != null && !"Common Stock".equalsIgnoreCase(item.type)) {
            return false;
        }
        if (item.currency != null && !"USD".equalsIgnoreCase(item.currency)) {
            return false;
        }

        // Filter out SPACs and acquisition companies
        String description = item.description.toUpperCase();
        if (description.contains("ACQUISITION") ||
                description.contains("SPAC") ||
                description.contains("SPECIAL PURPOSE") ||
                description.contains("-A") ||
                description.contains("CORP-A") ||
                description.contains("INC-A")) {
            return false;
        }

        // Filter out symbols with numbers (often indicate different share classes or
        // warrants)
        String symbol = item.symbol.toUpperCase();
        if (symbol.matches(".*[0-9].*")) {
            return false;
        }

        // Filter out warrants and units (common SPAC indicators)
        if (symbol.endsWith("W") || symbol.endsWith("U") || symbol.contains(".")) {
            return false;
        }

        // Filter out very short symbols (often ETFs or unusual instruments)
        if (symbol.length() < 2) {
            return false;
        }

        return true;
    }

    private boolean isAllowedExchange(SymbolItem item, Set<String> allowedMics) {
        if (ObjectUtils.isEmpty(item.mic)) {
            return true;
        }
        return allowedMics.isEmpty() || allowedMics.contains(item.mic);
    }

    private ImportCounts saveSelectedSymbols(List<NormItem> selected) {
        int imported = 0, updated = 0;

        for (NormItem ni : selected) {
            SymbolItem item = ni.raw;
            String symbol = ni.sym;

            Symbol entity = symbolRepository.findBySymbol(symbol).orElseGet(Symbol::new);
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

    private void updateSymbolEntity(Symbol entity, SymbolItem item) {
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

    public Page<Symbol> list(String q, Boolean enabled, Pageable pageable) {
        Page<Symbol> page = symbolRepository.search(emptyToNull(q), enabled, ensureSort(pageable));
        return page;
    }

    public Symbol setEnabled(Long id, boolean enabled) {
        Symbol e = symbolRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Symbol not found"));

        e.setEnabled(enabled);
        symbolRepository.save(e);
        return e;
    }

    private String emptyToNull(String s) {
        return StringUtils.hasText(s) ? s : null;
    }

    private Pageable ensureSort(Pageable p) {
        if (p.getSort().isUnsorted()) {
            return PageRequest.of(p.getPageNumber(), p.getPageSize(),
                    Sort.by(Sort.Order.asc("symbol")));
        }
        return p;
    }

    public ImportData importStatus() {
        return new ImportData(importRunning.get(), lastImportedAt, lastSummary);
    }

    public List<String> getEnabledSymbols() {
        return symbolRepository.findEnabledSymbols();
    }

    private String norm(String s) {
        return s == null ? null : s.trim().toUpperCase(Locale.ROOT);
    }

    private int calculateRemainingCapacity() {
        final int MAX_SYMBOLS_PER_IMPORT = 25;
        final int TOTAL_SYMBOL_LIMIT = 50;
        long currentTotalCount = symbolRepository.count();
        int remainingGlobalCapacity = Math.max(0, TOTAL_SYMBOL_LIMIT - (int) currentTotalCount);
        return Math.min(MAX_SYMBOLS_PER_IMPORT, remainingGlobalCapacity);
    }

    private Set<String> getExistingSymbolsForUniverse(Set<String> allowedMics) {
        return symbolRepository.findAll().stream()
                .filter(entity -> allowedMics.isEmpty() || allowedMics.contains(entity.getMic()))
                .map(Symbol::getSymbol)
                .collect(Collectors.toSet());
    }

    private Set<String> allowedMicsFor(String universe) {
        if (!StringUtils.hasText(universe))
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

    private static class NormItem {
        final String sym;
        final SymbolItem raw;

        NormItem(String sym, SymbolItem raw) {
            this.sym = sym;
            this.raw = raw;
        }
    }
}
