package com.portfolio.demo_backend.dto;

public class ImportStatusDTO {
    public boolean running;
    public String lastImportedAt;
    public ImportSummaryDTO lastSummary;

    public ImportStatusDTO(boolean running, String lastImportedAt, ImportSummaryDTO lastSummary) {
        this.running = running;
        this.lastImportedAt = lastImportedAt;
        this.lastSummary = lastSummary;
    }
}