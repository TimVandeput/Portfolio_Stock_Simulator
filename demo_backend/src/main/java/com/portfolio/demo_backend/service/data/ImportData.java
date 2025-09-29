package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.dto.symbol.ImportSummaryDTO;
import lombok.Data;
import lombok.AllArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ImportData {
    private final boolean running;
    private final Instant lastImportedAt;
    private final ImportSummaryDTO lastSummary;
}
