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
            var summary = importFromFreeUniverse(universe);
            lastImportedAt = Instant.now();
            lastSummary = summary;
            return summary;
        } finally {
            importRunning.set(false);
        }
    }

    private ImportSummaryDTO importFromFreeUniverse(String universe) throws IOException {
        final int LIMIT = 150;
        List<SymbolItem> all = finnhub.listSymbolsByExchange("US");

        int imported = 0, updated = 0, skipped = 0, taken = 0;

        for (SymbolItem it : all) {
            if (it == null || it.symbol == null || it.symbol.isBlank())
                continue;
            if (it.description == null || it.description.isBlank())
                continue;

            if (it.type != null && !"Common Stock".equalsIgnoreCase(it.type))
                continue;
            if (it.currency != null && !"USD".equalsIgnoreCase(it.currency))
                continue;
            if (it.mic != null && !(it.mic.equals("XNAS") || it.mic.equals("XNYS")))
                continue;

            if (taken >= LIMIT)
                break;
            taken++;

            SymbolEntity e = symbolRepository.findBySymbol(it.symbol)
                    .orElseGet(SymbolEntity::new);
            boolean isNew = (e.getId() == null);

            e.setSymbol(it.symbol);
            e.setName(it.description);
            e.setExchange(it.mic != null ? it.mic : "US");
            e.setCurrency(it.currency);
            e.setMic(it.mic);
            if (isNew)
                e.setEnabled(true);

            symbolRepository.save(e);
            if (isNew)
                imported++;
            else
                updated++;
        }

        skipped = Math.max(0, all.size() - taken);
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
}
