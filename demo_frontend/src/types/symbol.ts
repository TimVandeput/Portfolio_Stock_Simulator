/**
 * @fileoverview Stock Symbol and Market Universe Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * Market universe types for symbol categorization.
 *
 * Defines supported market indices/universes for symbol filtering
 * and categorization. Used for importing specific sets of stocks
 * and organizing market data by major index membership.
 *
 * @typedef {("NDX" | "GSPC")} Universe
 *
 * @example
 * ```typescript
 * // Import NASDAQ 100 symbols
 * const nasdaq100: Universe = "NDX";
 * await importSymbols(nasdaq100);
 *
 * // Import S&P 500 symbols
 * const sp500: Universe = "GSPC";
 * await importSymbols(sp500);
 * ```
 */
export type Universe = "NDX" | "GSPC";

/**
 * Stock symbol data transfer object with trading status.
 *
 * Represents a tradeable stock symbol with metadata including
 * exchange information, trading status, and usage tracking.
 * Used for symbol management, filtering, and trading operations.
 *
 * @interface SymbolDTO
 * @property {number} id - Unique identifier for the symbol record
 * @property {string} symbol - Stock ticker symbol (e.g., "AAPL", "GOOGL")
 * @property {string} name - Full company name
 * @property {string} exchange - Stock exchange where symbol is traded
 * @property {string} currency - Trading currency (e.g., "USD", "EUR")
 * @property {boolean} enabled - Whether symbol is available for trading
 * @property {boolean} inUse - Whether symbol is currently held in portfolios
 *
 * @example
 * ```typescript
 * const appleSymbol: SymbolDTO = {
 *   id: 1,
 *   symbol: "AAPL",
 *   name: "Apple Inc.",
 *   exchange: "NASDAQ",
 *   currency: "USD",
 *   enabled: true,
 *   inUse: true
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Filter tradeable symbols
 * function getTradeableSymbols(symbols: SymbolDTO[]): SymbolDTO[] {
 *   return symbols.filter(symbol => symbol.enabled);
 * }
 *
 * // Get symbols in use
 * function getActiveSymbols(symbols: SymbolDTO[]): SymbolDTO[] {
 *   return symbols.filter(symbol => symbol.inUse);
 * }
 * ```
 */
export interface SymbolDTO {
  id: number;
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  enabled: boolean;
  inUse: boolean;
}

/**
 * Symbol import operation summary statistics.
 *
 * Provides metrics about a completed symbol import operation,
 * including counts of imported, updated, and skipped symbols.
 * Used for displaying import results and tracking data freshness.
 *
 * @interface ImportSummaryDTO
 * @property {number} imported - Number of new symbols added
 * @property {number} updated - Number of existing symbols updated
 * @property {number} skipped - Number of symbols skipped (no changes needed)
 *
 * @example
 * ```typescript
 * const importResult: ImportSummaryDTO = {
 *   imported: 25,
 *   updated: 12,
 *   skipped: 463
 * };
 *
 * console.log(`Import completed: ${importResult.imported} new, ${importResult.updated} updated`);
 * ```
 *
 * @example
 * ```typescript
 * // Display import summary
 * function ImportSummary({ summary }: { summary: ImportSummaryDTO }) {
 *   const total = summary.imported + summary.updated + summary.skipped;
 *
 *   return (
 *     <div className="import-summary">
 *       <h3>Import Summary</h3>
 *       <p>Total processed: {total}</p>
 *       <ul>
 *         <li className="success">New symbols: {summary.imported}</li>
 *         <li className="info">Updated: {summary.updated}</li>
 *         <li className="muted">Skipped: {summary.skipped}</li>
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export interface ImportSummaryDTO {
  imported: number;
  updated: number;
  skipped: number;
}

/**
 * Symbol import operation status and history.
 *
 * Tracks the current state of symbol import operations including
 * whether an import is currently running and the results of the
 * most recent import. Used for UI status updates and preventing
 * concurrent import operations.
 *
 * @interface ImportStatusDTO
 * @property {boolean} running - Whether a symbol import is currently in progress
 * @property {string | null} [lastImportedAt] - ISO timestamp of last completed import
 * @property {ImportSummaryDTO | null} [lastSummary] - Summary of the most recent import operation
 *
 * @example
 * ```typescript
 * const importStatus: ImportStatusDTO = {
 *   running: false,
 *   lastImportedAt: "2024-03-15T10:30:00Z",
 *   lastSummary: {
 *     imported: 25,
 *     updated: 12,
 *     skipped: 463
 *   }
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Import status component
 * function ImportStatus({ status }: { status: ImportStatusDTO }) {
 *   if (status.running) {
 *     return (
 *       <div className="import-status importing">
 *         <Spinner />
 *         <span>Importing symbols...</span>
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <div className="import-status idle">
 *       {status.lastImportedAt ? (
 *         <div>
 *           <p>Last import: {formatDate(status.lastImportedAt)}</p>
 *           {status.lastSummary && (
 *             <ImportSummary summary={status.lastSummary} />
 *           )}
 *         </div>
 *       ) : (
 *         <p>No imports completed yet</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export interface ImportStatusDTO {
  running: boolean;
  lastImportedAt?: string | null;
  lastSummary?: ImportSummaryDTO | null;
}
