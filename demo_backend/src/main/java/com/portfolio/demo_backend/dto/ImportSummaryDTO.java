package com.portfolio.demo_backend.dto;

public class ImportSummaryDTO {
    public int imported;
    public int updated;
    public int skipped;

    public ImportSummaryDTO(int imported, int updated, int skipped) {
        this.imported = imported;
        this.updated = updated;
        this.skipped = skipped;
    }
}
