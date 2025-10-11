package com.portfolio.demo_backend.dto.symbol;

import jakarta.validation.constraints.Min;

/**
 * Summary counters produced after a symbol universe import.
 */
public class ImportSummaryDTO {
    @Min(0)
    public int imported;
    @Min(0)
    public int updated;
    @Min(0)
    public int skipped;

    public ImportSummaryDTO(int imported, int updated, int skipped) {
        this.imported = imported;
        this.updated = updated;
        this.skipped = skipped;
    }
}
