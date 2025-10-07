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

/**
 * Symbol catalog service.
 * <p>
 * Responsibilities:
 * - Import/refresh symbols from external sources
 * - Search, paginate and toggle symbol availability
 * - Provide import status (last summary and time)
 * <p>
 * Concurrency:
 * - Import operations are guarded by an {@link java.util.concurrent.atomic.AtomicBoolean} to ensure only one
 *   import runs at a time; attempting a concurrent import results in
 *   {@link com.portfolio.demo_backend.exception.symbol.ImportInProgressException}.
 */
@Service
@RequiredArgsConstructor
public class SymbolService {

    private final SymbolRepository symbolRepository;
    private final FinnhubClient finnhub;

    private final AtomicBoolean importRunning = new AtomicBoolean(false);
    private volatile Instant lastImportedAt;
    private volatile ImportSummaryDTO lastSummary;

    /**
     * Imports a universe of symbols from the configured provider.
     * Ensures only one import runs at a time. Existing symbols are updated; new symbols are created
     * subject to a global capacity limit. Basic filtering excludes non-USD, SPACs, warrants, and
     * non-common stock instrument types.
     *
     * @param universe optional universe key (e.g., NDX, GSPC)
     * @return summary with imported/updated counts
     * @throws IOException               when remote calls fail
     * @throws ImportInProgressException if an import is already running
     */
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

    /**
     * Imports symbols from the free Finnhub universe.
     * <p>
     * Note: this method is synchronous and blocking; network errors are propagated.
     *
     * @param universe optional universe key (e.g., NDX, GSPC)
     * @return import summary
     * @throws IOException when remote calls fail
     */
    private ImportSummaryDTO importFromFreeUniverse(String universe) throws IOException {
        List<SymbolItem> all = finnhub.listSymbolsByExchange("US");
        List<NormItem> selected = selectAndFilterSymbols(all, universe);
        ImportCounts counts = saveSelectedSymbols(selected);

        int skipped = Math.max(0, all.size() - selected.size());
        return new ImportSummaryDTO(counts.imported, counts.updated, skipped);
    }

    /**
     * Normalizes, filters, deduplicates and capacity-limits the provided symbol list
     * according to business rules (USD, common stock, allowed exchanges, no SPACs/warrants,
     * no numeric tickers), and separates existing vs new.
     *
     * @param allSymbols raw symbols from provider
     * @param universe   optional universe key affecting allowed exchanges
     * @return ordered list of normalized items (existing first, then new limited by capacity)
     */
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

    /**
     * Validates a provider symbol item meets business constraints (non-empty fields,
     * USD, common stock, filters out SPAC-related and warrant/unit indicators, removes
     * numeric or very short tickers).
     *
     * @param item provider item
     * @return true if valid per rules, else false
     */
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

    /**
     * Checks whether the item's MIC is in the allowed set for the selected universe.
     * If the MIC is missing, the item is considered allowed.
     *
     * @param item        provider item
     * @param allowedMics allowed MIC set (may be empty to allow all)
     * @return true if allowed
     */
    private boolean isAllowedExchange(SymbolItem item, Set<String> allowedMics) {
        if (ObjectUtils.isEmpty(item.mic)) {
            return true;
        }
        return allowedMics.isEmpty() || allowedMics.contains(item.mic);
    }

    /**
     * Persists selected symbols by creating new records or updating existing ones.
     *
     * @param selected normalized and filtered items
     * @return counts of imported and updated items
     */
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

    /**
     * Updates a {@link Symbol} entity with fields derived from the provider item.
     *
     * @param entity symbol entity to update
     * @param item   provider item
     */
    private void updateSymbolEntity(Symbol entity, SymbolItem item) {
        entity.setName(item.description);
        entity.setExchange(item.mic != null ? item.mic : "US");
        entity.setCurrency(item.currency);
        entity.setMic(item.mic);
    }

    /**
     * Simple value object holding import vs update counts.
     */
    private static class ImportCounts {
        final int imported;
        final int updated;

        ImportCounts(int imported, int updated) {
            this.imported = imported;
            this.updated = updated;
        }
    }

    /**
     * Lists symbols matching an optional query and enabled flag with paging.
     *
     * @param q        optional text to search (symbol/name)
     * @param enabled  optional enabled flag filter
     * @param pageable page request (defaults to sort by symbol ASC if unsorted)
     * @return page of symbols
     */
    public Page<Symbol> list(String q, Boolean enabled, Pageable pageable) {
        Page<Symbol> page = symbolRepository.search(emptyToNull(q), enabled, ensureSort(pageable));
        return page;
    }

    /**
     * Enables or disables a symbol.
     *
     * @param id      symbol id
     * @param enabled new enabled value
     * @return the updated symbol
     * @throws org.springframework.web.server.ResponseStatusException if symbol not found
     */
    public Symbol setEnabled(Long id, boolean enabled) {
        Symbol e = symbolRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Symbol not found"));

        e.setEnabled(enabled);
        symbolRepository.save(e);
        return e;
    }

    /**
     * Converts blank strings to null.
     *
     * @param s input string
     * @return null if blank, otherwise the same string
     */
    private String emptyToNull(String s) {
        return StringUtils.hasText(s) ? s : null;
    }

    /**
     * Ensures a default sort by symbol ASC when the incoming pageable is unsorted.
     *
     * @param p incoming pageable
     * @return pageable with default sort applied if needed
     */
    private Pageable ensureSort(Pageable p) {
        if (p.getSort().isUnsorted()) {
            return PageRequest.of(p.getPageNumber(), p.getPageSize(),
                    Sort.by(Sort.Order.asc("symbol")));
        }
        return p;
    }

    /**
     * Returns the last import status including whether an import is running, the last import time,
     * and the last summary (imported/updated/skipped counts). Values may be null if no import has occurred.
     *
     * @return {@link ImportData} snapshot of import state
     */
    public ImportData importStatus() {
        return new ImportData(importRunning.get(), lastImportedAt, lastSummary);
    }

    /**
     * Normalizes a symbol/string to upper case and trims whitespace.
     *
     * @param s input
     * @return normalized string or null
     */
    private String norm(String s) {
        return s == null ? null : s.trim().toUpperCase(Locale.ROOT);
    }

    /**
     * Computes remaining capacity for new symbols considering a per-import cap and a
     * global total symbol limit.
     *
     * @return max number of new symbols allowed in this import
     */
    private int calculateRemainingCapacity() {
        final int MAX_SYMBOLS_PER_IMPORT = 25;
        final int TOTAL_SYMBOL_LIMIT = 50;
        long currentTotalCount = symbolRepository.count();
        int remainingGlobalCapacity = Math.max(0, TOTAL_SYMBOL_LIMIT - (int) currentTotalCount);
        return Math.min(MAX_SYMBOLS_PER_IMPORT, remainingGlobalCapacity);
    }

    /**
     * Retrieves the existing symbols for the allowed MICs to prefer updating those first.
     *
     * @param allowedMics allowed MICs
     * @return set of existing symbol tickers
     */
    private Set<String> getExistingSymbolsForUniverse(Set<String> allowedMics) {
        return symbolRepository.findAll().stream()
                .filter(entity -> allowedMics.isEmpty() || allowedMics.contains(entity.getMic()))
                .map(Symbol::getSymbol)
                .collect(Collectors.toSet());
    }

    /**
     * Returns the allowed exchange MICs for a given universe identifier.
     *
     * @param universe optional universe code (e.g., NDX, GSPC)
     * @return allowed MIC set
     */
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

    /**
     * Normalized symbol record with provider payload.
     */
    private static class NormItem {
        final String sym;
        final SymbolItem raw;

        NormItem(String sym, SymbolItem raw) {
            this.sym = sym;
            this.raw = raw;
        }
    }
}
