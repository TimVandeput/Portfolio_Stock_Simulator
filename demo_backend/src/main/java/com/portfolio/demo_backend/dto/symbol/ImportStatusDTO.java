package com.portfolio.demo_backend.dto.symbol;

public class ImportStatusDTO {
    public boolean running;
    public String lastImportedAt;
    public ImportSummaryDTO lastSummary;
    public String status;

    public ImportStatusDTO(boolean running, String lastImportedAt, ImportSummaryDTO lastSummary) {
        this.running = running;
        this.lastImportedAt = lastImportedAt;
        this.lastSummary = lastSummary;

        if (running) {
            this.status = "Import in progress...";
        } else if (lastImportedAt == null) {
            this.status = "No imports performed yet";
        } else if (lastSummary != null && (lastSummary.imported + lastSummary.updated) > 0) {
            this.status = "Last import successful";
        } else {
            this.status = "Last import failed - no symbols imported";
        }
    }
}