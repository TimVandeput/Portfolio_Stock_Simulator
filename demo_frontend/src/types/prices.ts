/**
 * @fileoverview Stock Price Data Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * Yahoo Finance quote data structure for external price feeds.
 *
 * Represents stock price information received from Yahoo Finance API,
 * including current price and percentage change. Used for price data
 * integration and external data source compatibility.
 *
 * @interface YahooQuote
 * @property {number | null} price - Current stock price, null if unavailable
 * @property {number | null} [changePercent] - Percentage change from previous close
 *
 * @example
 * ```typescript
 * const appleQuote: YahooQuote = {
 *   price: 150.25,
 *   changePercent: 2.34
 * };
 * ```
 */
export interface YahooQuote {
  price: number | null;
  changePercent?: number | null;
}

/**
 * Internal price data structure for stock price management.
 *
 * Represents processed stock price information used throughout the
 * application, including last known price, change percentage, and
 * update timestamp for cache management and real-time updates.
 *
 * @interface Price
 * @property {number} [last] - Last known stock price
 * @property {number} [percentChange] - Percentage change from previous value
 * @property {number} [lastUpdate] - Unix timestamp of last price update
 *
 * @example
 * ```typescript
 * const stockPrice: Price = {
 *   last: 150.25,
 *   percentChange: 2.34,
 *   lastUpdate: Date.now()
 * };
 * ```
 */
export interface Price {
  last?: number;
  percentChange?: number;
  lastUpdate?: number;
}

/**
 * Collection of stock prices indexed by symbol.
 *
 * Maps stock symbols to their corresponding price data, providing
 * efficient lookup and management of multiple stock prices. Used
 * for bulk price operations and portfolio-wide price tracking.
 *
 * @typedef {Record<string, Price>} Prices
 *
 * @example
 * ```typescript
 * const marketPrices: Prices = {
 *   "AAPL": { last: 150.25, percentChange: 2.34, lastUpdate: Date.now() },
 *   "GOOGL": { last: 2750.80, percentChange: -1.23, lastUpdate: Date.now() },
 *   "MSFT": { last: 305.15, percentChange: 0.87, lastUpdate: Date.now() }
 * };
 * ```
 */
export type Prices = Record<string, Price>;

/**
 * Price context type for React context provider.
 *
 * Defines the structure of the price context used throughout the
 * application for real-time price updates, loading states, and
 * visual feedback. Manages global price state and update mechanisms.
 *
 * @interface PriceContextType
 * @property {Prices} prices - Current collection of all stock prices
 * @property {Set<string>} pulsatingSymbols - Symbols currently showing visual update animation
 * @property {boolean} isInitialLoading - Whether initial price data is being loaded
 * @property {boolean} hasInitialPrices - Whether initial price data has been received
 * @property {string | null} error - Current error message, null if no error
 * @property {() => Promise<void>} refreshPrices - Function to manually refresh all prices
 *
 * @example
 * ```typescript
 * // Price context provider
 * function PriceProvider({ children }: { children: React.ReactNode }) {
 *   const [prices, setPrices] = useState<Prices>({});
 *   const [pulsatingSymbols, setPulsatingSymbols] = useState<Set<string>>(new Set());
 *   const [isInitialLoading, setIsInitialLoading] = useState(true);
 *   const [hasInitialPrices, setHasInitialPrices] = useState(false);
 *   const [error, setError] = useState<string | null>(null);
 *
 *   const refreshPrices = async () => {
 *     try {
 *       const freshPrices = await fetchAllPrices();
 *       setPrices(freshPrices);
 *       setError(null);
 *     } catch (err) {
 *       setError('Failed to refresh prices');
 *     }
 *   };
 *
 *   const contextValue: PriceContextType = {
 *     prices,
 *     pulsatingSymbols,
 *     isInitialLoading,
 *     hasInitialPrices,
 *     error,
 *     refreshPrices
 *   };
 *
 *   return (
 *     <PriceContext.Provider value={contextValue}>
 *       {children}
 *     </PriceContext.Provider>
 *   );
 * }
 * ```
 */
export interface PriceContextType {
  prices: Prices;
  pulsatingSymbols: Set<string>;
  isInitialLoading: boolean;
  hasInitialPrices: boolean;
  error: string | null;
  refreshPrices: () => Promise<void>;
}
