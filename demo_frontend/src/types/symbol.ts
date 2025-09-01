export type Universe = "NDX" | "GSPC";

export interface SymbolDTO {
  id: number;
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  enabled: boolean;
  inUse: boolean;
}

export interface ImportSummaryDTO {
  imported: number;
  updated: number;
  skipped: number;
}

export interface ImportStatusDTO {
  running: boolean;
  lastImportedAt?: string | null;
  lastSummary?: ImportSummaryDTO | null;
}
