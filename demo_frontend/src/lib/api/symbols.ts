/**
 * @fileoverview Stock Symbols Management API Module
 *
 * Provides comprehensive functionality for managing stock symbols
 * within the Stock Simulator application. Handles symbol importing,
 * listing, filtering, and administrative operations for market data.
 *
 * @module lib/api/symbols
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @example
 * ```typescript
 * import { listSymbols, importSymbols, setSymbolEnabled } from '@/lib/api/symbols';
 *
 * // List available symbols with search
 * const symbols = await listSymbols({ q: 'AAPL', enabled: true });
 *
 * // Import new symbols from universe
 * const summary = await importSymbols('SPY');
 *
 * // Enable/disable symbol trading
 * await setSymbolEnabled(123, true);
 * ```
 */

import { HttpClient, ApiError } from "@/lib/api/http";
import type { Page } from "@/types/pagination";
import type {
  SymbolDTO,
  ImportSummaryDTO,
  ImportStatusDTO,
  Universe,
} from "@/types/symbol";

const client = new HttpClient();

/**
 * Builds query string from parameters, filtering out undefined/null/empty values.
 *
 * Utility function for constructing clean URL query strings by automatically
 * filtering out undefined, null, or empty parameter values to avoid cluttered URLs.
 *
 * @param params - Record of parameter keys and values
 * @returns Formatted query string with leading '?' or empty string
 *
 * @remarks
 * This helper function:
 * - Filters out undefined, null, and empty string values
 * - Properly URL-encodes parameter values
 * - Returns empty string if no valid parameters
 * - Includes leading '?' when parameters exist
 * - Handles boolean, number, and string parameter types
 *
 * @example
 * ```typescript
 * const query = qs({ q: 'AAPL', enabled: true, page: 0 });
 * // Returns: "?q=AAPL&enabled=true&page=0"
 *
 * const emptyQuery = qs({ q: undefined, enabled: null });
 * // Returns: ""
 * ```
 */
function qs(
  params: Record<string, string | number | boolean | undefined>
): string {
  const u = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}`.length > 0) u.set(k, String(v));
  });
  const s = u.toString();
  return s ? `?${s}` : "";
}

/**
 * Retrieves the current status of symbol import operations.
 *
 * Fetches information about ongoing or recent symbol import processes,
 * including import progress, status, completion time, and any error details.
 *
 * @returns Promise resolving to comprehensive import status information
 *
 * @throws {ApiError} When API request fails or import status unavailable
 * @throws {Error} When network or parsing errors occur
 *
 * @remarks
 * This function:
 * - Provides real-time import operation status
 * - Includes progress indicators and completion percentages
 * - Reports any errors or warnings from import processes
 * - Shows timestamp information for import operations
 * - Automatically handles authentication via HttpClient
 * - Useful for monitoring long-running import operations
 *
 * Status information includes:
 * - Current import operation state (idle, running, completed, failed)
 * - Progress indicators and estimated completion time
 * - Number of symbols processed and remaining
 * - Error messages and warnings
 * - Last successful import timestamp
 * - Import source and target universe information
 *
 * @example
 * ```typescript
 * // Check current import status
 * const status = await getImportStatus();
 *
 * console.log(`Import Status: ${status.state}`);
 * if (status.progress) {
 *   console.log(`Progress: ${status.progress.processed}/${status.progress.total}`);
 *   console.log(`Completion: ${(status.progress.percentage * 100).toFixed(1)}%`);
 * }
 *
 * if (status.errors?.length > 0) {
 *   console.log('Import errors:', status.errors);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React component for import status monitoring
 * function ImportStatusMonitor() {
 *   const [status, setStatus] = useState<ImportStatusDTO | null>(null);
 *   const [polling, setPolling] = useState(false);
 *
 *   useEffect(() => {
 *     let interval: NodeJS.Timeout;
 *
 *     const checkStatus = async () => {
 *       try {
 *         const currentStatus = await getImportStatus();
 *         setStatus(currentStatus);
 *
 *         // Stop polling if import is complete or failed
 *         if (currentStatus.state === 'completed' || currentStatus.state === 'failed') {
 *           setPolling(false);
 *         }
 *       } catch (error) {
 *         console.error('Failed to check import status:', error);
 *       }
 *     };
 *
 *     if (polling) {
 *       interval = setInterval(checkStatus, 2000); // Poll every 2 seconds
 *     }
 *
 *     // Initial check
 *     checkStatus();
 *
 *     return () => clearInterval(interval);
 *   }, [polling]);
 *
 *   const startMonitoring = () => setPolling(true);
 *   const stopMonitoring = () => setPolling(false);
 *
 *   if (!status) return <div>Loading import status...</div>;
 *
 *   return (
 *     <div className="import-status">
 *       <h3>Symbol Import Status</h3>
 *       <div>State: {status.state}</div>
 *       {status.progress && (
 *         <div>
 *           Progress: {status.progress.processed}/{status.progress.total}
 *           ({(status.progress.percentage * 100).toFixed(1)}%)
 *         </div>
 *       )}
 *       <button onClick={polling ? stopMonitoring : startMonitoring}>
 *         {polling ? 'Stop Monitoring' : 'Start Monitoring'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export async function getImportStatus(): Promise<ImportStatusDTO> {
  return client.get<ImportStatusDTO>(`/api/symbols/import/status`);
}

/**
 * Initiates import of stock symbols from a specified market universe.
 *
 * Triggers the import process to add new stock symbols from popular market
 * universes like NASDAQ-100, S&P 500, or other predefined symbol sets.
 * This is typically used to populate or update the available trading symbols.
 *
 * @param universe - The market universe to import symbols from (default: "NDX")
 * @returns Promise resolving to comprehensive import summary with results
 *
 * @throws {ApiError} When API request fails or import operation cannot start
 * @throws {Error} When network or authorization errors occur
 *
 * @remarks
 * This function:
 * - Initiates bulk import of symbols from major market indices
 * - Supports multiple universe types (NDX, SPY, QQQ, etc.)
 * - Returns detailed summary of import results and statistics
 * - Handles duplicate symbol detection and updates
 * - Automatically validates and processes symbol metadata
 * - May be a long-running operation for large universes
 * - Includes comprehensive error handling and rollback
 *
 * Supported universes typically include:
 * - NDX (NASDAQ-100)
 * - SPY (S&P 500)
 * - QQQ (NASDAQ-100 ETF holdings)
 * - DIA (Dow Jones Industrial Average)
 * - IWM (Russell 2000)
 * - Custom universe definitions
 *
 * Import process includes:
 * - Symbol validation and deduplication
 * - Metadata retrieval and processing
 * - Price history initialization
 * - Trading status configuration
 * - Error reporting and rollback handling
 *
 * @example
 * ```typescript
 * // Import NASDAQ-100 symbols
 * const summary = await importSymbols('NDX');
 *
 * console.log(`Import completed: ${summary.status}`);
 * console.log(`Symbols added: ${summary.symbolsAdded}`);
 * console.log(`Symbols updated: ${summary.symbolsUpdated}`);
 * console.log(`Errors: ${summary.errors?.length || 0}`);
 *
 * if (summary.errors?.length > 0) {
 *   console.log('Import errors:', summary.errors);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Import multiple universes sequentially
 * async function importMultipleUniverses() {
 *   const universes: Universe[] = ['NDX', 'SPY', 'QQQ'];
 *   const results: ImportSummaryDTO[] = [];
 *
 *   for (const universe of universes) {
 *     try {
 *       console.log(`Importing ${universe}...`);
 *       const summary = await importSymbols(universe);
 *       results.push(summary);
 *
 *       console.log(`${universe} import completed:`);
 *       console.log(`- Added: ${summary.symbolsAdded}`);
 *       console.log(`- Updated: ${summary.symbolsUpdated}`);
 *
 *       // Wait between imports to avoid rate limiting
 *       await new Promise(resolve => setTimeout(resolve, 5000));
 *
 *     } catch (error) {
 *       console.error(`Failed to import ${universe}:`, error);
 *     }
 *   }
 *
 *   const totalAdded = results.reduce((sum, r) => sum + r.symbolsAdded, 0);
 *   const totalUpdated = results.reduce((sum, r) => sum + r.symbolsUpdated, 0);
 *
 *   console.log(`Total symbols added: ${totalAdded}`);
 *   console.log(`Total symbols updated: ${totalUpdated}`);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React component for symbol import management
 * function SymbolImportManager() {
 *   const [importing, setImporting] = useState(false);
 *   const [selectedUniverse, setSelectedUniverse] = useState<Universe>('NDX');
 *   const [importResult, setImportResult] = useState<ImportSummaryDTO | null>(null);
 *
 *   const handleImport = async () => {
 *     try {
 *       setImporting(true);
 *       setImportResult(null);
 *
 *       const summary = await importSymbols(selectedUniverse);
 *       setImportResult(summary);
 *
 *       // Show success notification
 *       toast.success(`Successfully imported ${summary.symbolsAdded} symbols from ${selectedUniverse}`);
 *
 *     } catch (error) {
 *       console.error('Import failed:', error);
 *       toast.error('Symbol import failed');
 *     } finally {
 *       setImporting(false);
 *     }
 *   };
 *
 *   return (
 *     <div className="import-manager">
 *       <h3>Import Stock Symbols</h3>
 *
 *       <select
 *         value={selectedUniverse}
 *         onChange={(e) => setSelectedUniverse(e.target.value as Universe)}
 *         disabled={importing}
 *       >
 *         <option value="NDX">NASDAQ-100</option>
 *         <option value="SPY">S&P 500</option>
 *         <option value="QQQ">QQQ Holdings</option>
 *       </select>
 *
 *       <button onClick={handleImport} disabled={importing}>
 *         {importing ? 'Importing...' : `Import ${selectedUniverse} Symbols`}
 *       </button>
 *
 *       {importResult && (
 *         <div className="import-results">
 *           <h4>Import Results</h4>
 *           <div>Status: {importResult.status}</div>
 *           <div>Symbols Added: {importResult.symbolsAdded}</div>
 *           <div>Symbols Updated: {importResult.symbolsUpdated}</div>
 *           {importResult.errors?.length > 0 && (
 *             <div>Errors: {importResult.errors.length}</div>
 *           )}
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export async function importSymbols(
  universe: Universe = "NDX"
): Promise<ImportSummaryDTO> {
  try {
    return await client.post<ImportSummaryDTO>(
      `/api/symbols/import${qs({ universe })}`
    );
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}

/**
 * Retrieves a paginated list of stock symbols with optional filtering and search.
 *
 * Fetches stock symbols from the system with support for text search,
 * enabled/disabled filtering, and pagination. Provides comprehensive
 * symbol information including metadata and trading status.
 *
 * @param params - Optional filtering and pagination parameters
 * @param params.q - Search query to filter symbols by name or symbol
 * @param params.enabled - Filter by enabled/disabled status
 * @param params.page - Page number for pagination (0-based, default: 0)
 * @param params.size - Number of items per page (default: 25)
 * @returns Promise resolving to paginated symbol data with metadata
 *
 * @throws {ApiError} When API request fails or parameters are invalid
 * @throws {Error} When network or parsing errors occur
 *
 * @remarks
 * This function:
 * - Supports full-text search across symbol names and tickers
 * - Provides pagination for efficient handling of large symbol sets
 * - Allows filtering by trading status (enabled/disabled)
 * - Returns comprehensive symbol metadata and statistics
 * - Automatically handles authentication via HttpClient
 * - Optimized for symbol selection and management interfaces
 *
 * Search capabilities:
 * - Symbol ticker matching (e.g., "AAPL")
 * - Company name matching (e.g., "Apple")
 * - Partial matches and fuzzy search
 * - Case-insensitive search
 * - Multiple keyword support
 *
 * Response includes:
 * - Symbol metadata (ticker, name, exchange, sector)
 * - Trading status and availability
 * - Market data and pricing information
 * - Pagination metadata (total count, page info)
 * - Import and update timestamps
 *
 * @example
 * ```typescript
 * // Search for Apple-related symbols
 * const appleSymbols = await listSymbols({ q: 'Apple', enabled: true });
 *
 * console.log(`Found ${appleSymbols.totalElements} Apple symbols`);
 * appleSymbols.content.forEach(symbol => {
 *   console.log(`${symbol.symbol}: ${symbol.longName}`);
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Paginate through all enabled symbols
 * async function getAllEnabledSymbols() {
 *   let page = 0;
 *   const size = 100;
 *   const allSymbols: SymbolDTO[] = [];
 *
 *   while (true) {
 *     const result = await listSymbols({ enabled: true, page, size });
 *     allSymbols.push(...result.content);
 *
 *     console.log(`Loaded page ${page + 1}/${result.totalPages} (${result.content.length} symbols)`);
 *
 *     if (result.last) break;
 *     page++;
 *   }
 *
 *   console.log(`Total enabled symbols: ${allSymbols.length}`);
 *   return allSymbols;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React component for symbol search and selection
 * function SymbolSearchList() {
 *   const [symbols, setSymbols] = useState<Page<SymbolDTO> | null>(null);
 *   const [searchQuery, setSearchQuery] = useState('');
 *   const [enabledOnly, setEnabledOnly] = useState(true);
 *   const [currentPage, setCurrentPage] = useState(0);
 *   const [loading, setLoading] = useState(false);
 *
 *   const loadSymbols = useCallback(async () => {
 *     try {
 *       setLoading(true);
 *       const result = await listSymbols({
 *         q: searchQuery || undefined,
 *         enabled: enabledOnly,
 *         page: currentPage,
 *         size: 25
 *       });
 *       setSymbols(result);
 *     } catch (error) {
 *       console.error('Failed to load symbols:', error);
 *     } finally {
 *       setLoading(false);
 *     }
 *   }, [searchQuery, enabledOnly, currentPage]);
 *
 *   useEffect(() => {
 *     loadSymbols();
 *   }, [loadSymbols]);
 *
 *   const handleSearch = (query: string) => {
 *     setSearchQuery(query);
 *     setCurrentPage(0); // Reset to first page
 *   };
 *
 *   return (
 *     <div className="symbol-search">
 *       <div className="search-controls">
 *         <input
 *           type="text"
 *           placeholder="Search symbols..."
 *           value={searchQuery}
 *           onChange={(e) => handleSearch(e.target.value)}
 *         />
 *         <label>
 *           <input
 *             type="checkbox"
 *             checked={enabledOnly}
 *             onChange={(e) => {
 *               setEnabledOnly(e.target.checked);
 *               setCurrentPage(0);
 *             }}
 *           />
 *           Enabled only
 *         </label>
 *       </div>
 *
 *       {loading ? (
 *         <div>Loading symbols...</div>
 *       ) : symbols ? (
 *         <div>
 *           <div className="results-info">
 *             Found {symbols.totalElements} symbols
 *           </div>
 *
 *           <div className="symbol-list">
 *             {symbols.content.map(symbol => (
 *               <div key={symbol.id} className="symbol-item">
 *                 <strong>{symbol.symbol}</strong> - {symbol.longName}
 *                 <span className={`status ${symbol.enabled ? 'enabled' : 'disabled'}`}>
 *                   {symbol.enabled ? 'Enabled' : 'Disabled'}
 *                 </span>
 *               </div>
 *             ))}
 *           </div>
 *
 *           <div className="pagination">
 *             <button
 *               onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
 *               disabled={symbols.first}
 *             >
 *               Previous
 *             </button>
 *             <span>Page {currentPage + 1} of {symbols.totalPages}</span>
 *             <button
 *               onClick={() => setCurrentPage(currentPage + 1)}
 *               disabled={symbols.last}
 *             >
 *               Next
 *             </button>
 *           </div>
 *         </div>
 *       ) : (
 *         <div>No symbols found</div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export async function listSymbols(params?: {
  q?: string;
  enabled?: boolean;
  page?: number;
  size?: number;
}): Promise<Page<SymbolDTO>> {
  const query = qs({
    q: params?.q,
    enabled: params?.enabled,
    page: params?.page ?? 0,
    size: params?.size ?? 25,
  });
  return client.get<Page<SymbolDTO>>(`/api/symbols${query}`);
}

/**
 * Updates the enabled/disabled status of a specific stock symbol.
 *
 * Modifies the trading availability status for a symbol, controlling
 * whether it can be traded within the Stock Simulator application.
 * This is typically used for administrative management of available symbols.
 *
 * @param id - The unique identifier of the symbol to update
 * @param enabled - Whether to enable (true) or disable (false) the symbol
 * @returns Promise resolving to updated symbol information
 *
 * @throws {ApiError} When API request fails, symbol not found, or unauthorized
 * @throws {Error} When network or validation errors occur
 *
 * @remarks
 * This function:
 * - Updates symbol trading availability status
 * - Requires administrative privileges for execution
 * - Immediately affects symbol visibility in trading interfaces
 * - Returns updated symbol data for confirmation
 * - Automatically handles authentication via HttpClient
 * - Supports both enabling and disabling operations
 *
 * Status change effects:
 * - Enabled symbols appear in search and trading interfaces
 * - Disabled symbols are hidden from new trading operations
 * - Existing positions in disabled symbols remain intact
 * - Price streaming continues for disabled symbols with positions
 * - Portfolio calculations include disabled symbol positions
 * - Symbol metadata and history are preserved regardless of status
 *
 * Administrative considerations:
 * - Only users with appropriate permissions can modify symbol status
 * - Status changes are logged for audit purposes
 * - Bulk operations should be performed carefully
 * - Consider user impact before disabling popular symbols
 *
 * @example
 * ```typescript
 * // Enable a symbol for trading
 * const updatedSymbol = await setSymbolEnabled(123, true);
 * console.log(`${updatedSymbol.symbol} is now ${updatedSymbol.enabled ? 'enabled' : 'disabled'}`);
 * ```
 *
 * @example
 * ```typescript
 * // Toggle symbol status
 * async function toggleSymbolStatus(symbolId: number) {
 *   try {
 *     // First get current status
 *     const symbols = await listSymbols({ page: 0, size: 1000 });
 *     const symbol = symbols.content.find(s => s.id === symbolId);
 *
 *     if (!symbol) {
 *       throw new Error('Symbol not found');
 *     }
 *
 *     // Toggle the status
 *     const newStatus = !symbol.enabled;
 *     const updatedSymbol = await setSymbolEnabled(symbolId, newStatus);
 *
 *     console.log(`${updatedSymbol.symbol} status changed from ${symbol.enabled} to ${updatedSymbol.enabled}`);
 *
 *     return updatedSymbol;
 *   } catch (error) {
 *     console.error('Failed to toggle symbol status:', error);
 *     throw error;
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React component for symbol status management
 * function SymbolStatusToggle({ symbol }: { symbol: SymbolDTO }) {
 *   const [enabled, setEnabled] = useState(symbol.enabled);
 *   const [updating, setUpdating] = useState(false);
 *
 *   const handleToggle = async () => {
 *     try {
 *       setUpdating(true);
 *       const updatedSymbol = await setSymbolEnabled(symbol.id, !enabled);
 *       setEnabled(updatedSymbol.enabled);
 *
 *       toast.success(
 *         `${symbol.symbol} ${updatedSymbol.enabled ? 'enabled' : 'disabled'} successfully`
 *       );
 *     } catch (error) {
 *       console.error('Failed to update symbol status:', error);
 *       toast.error('Failed to update symbol status');
 *     } finally {
 *       setUpdating(false);
 *     }
 *   };
 *
 *   return (
 *     <div className="symbol-status-toggle">
 *       <span>{symbol.symbol} - {symbol.longName}</span>
 *       <button
 *         onClick={handleToggle}
 *         disabled={updating}
 *         className={`toggle-btn ${enabled ? 'enabled' : 'disabled'}`}
 *       >
 *         {updating ? 'Updating...' : (enabled ? 'Disable' : 'Enable')}
 *       </button>
 *       <span className={`status ${enabled ? 'enabled' : 'disabled'}`}>
 *         {enabled ? 'Enabled' : 'Disabled'}
 *       </span>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Bulk symbol status management
 * async function bulkUpdateSymbolStatus(symbolIds: number[], enabled: boolean) {
 *   const results: { success: SymbolDTO[]; failed: { id: number; error: string }[] } = {
 *     success: [],
 *     failed: []
 *   };
 *
 *   console.log(`${enabled ? 'Enabling' : 'Disabling'} ${symbolIds.length} symbols...`);
 *
 *   for (const id of symbolIds) {
 *     try {
 *       const updatedSymbol = await setSymbolEnabled(id, enabled);
 *       results.success.push(updatedSymbol);
 *       console.log(`✅ ${updatedSymbol.symbol} updated successfully`);
 *
 *       // Add delay to avoid rate limiting
 *       await new Promise(resolve => setTimeout(resolve, 100));
 *
 *     } catch (error) {
 *       console.error(`❌ Failed to update symbol ${id}:`, error);
 *       results.failed.push({
 *         id,
 *         error: error instanceof Error ? error.message : 'Unknown error'
 *       });
 *     }
 *   }
 *
 *   console.log(`Bulk update completed:`);
 *   console.log(`- Successfully updated: ${results.success.length}`);
 *   console.log(`- Failed: ${results.failed.length}`);
 *
 *   if (results.failed.length > 0) {
 *     console.log('Failed updates:', results.failed);
 *   }
 *
 *   return results;
 * }
 * ```
 */
export async function setSymbolEnabled(
  id: number,
  enabled: boolean
): Promise<SymbolDTO> {
  try {
    return await client.put<SymbolDTO>(`/api/symbols/${id}/enabled`, {
      enabled,
    });
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}
