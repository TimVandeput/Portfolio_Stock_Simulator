/**
 * @fileoverview Real-Time Stock Prices API Module
 *
 * Provides comprehensive functionality for retrieving current stock prices
 * and market data within the Stock Simulator application. Handles real-time
 * price updates, market quotes, and comprehensive stock information.
 *
 * @module lib/api/prices
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @example
 * ```typescript
 * import { getAllCurrentPrices } from '@/lib/api/prices';
 *
 * // Get current prices for all tracked symbols
 * const prices = await getAllCurrentPrices();
 * console.log(`Current AAPL price: $${prices.AAPL.regularMarketPrice}`);
 * ```
 */

import { HttpClient, ApiError } from "@/lib/api/http";
import type { YahooQuote } from "@/types";

const client = new HttpClient();

/**
 * Retrieves current market prices for all tracked stock symbols.
 *
 * Fetches real-time market data including current prices, daily changes,
 * volume, and comprehensive market statistics for all symbols currently
 * tracked by the Stock Simulator application.
 *
 * @returns Promise resolving to record of symbol keys mapped to comprehensive quote data
 *
 * @throws {ApiError} When API request fails or market data is unavailable
 * @throws {Error} When network or parsing errors occur
 *
 * @remarks
 * This function:
 * - Retrieves current prices for ALL tracked symbols in one request
 * - Includes comprehensive market data (price, volume, changes, etc.)
 * - Provides real-time or near real-time market information
 * - Returns data in easily accessible symbol-keyed format
 * - Automatically handles authentication via HttpClient
 * - Includes extended hours trading data when available
 * - Optimized for bulk price lookups and dashboard displays
 *
 * Quote data includes:
 * - Current market price and daily change amounts/percentages
 * - Trading volume and average volume
 * - Daily high/low and 52-week high/low ranges
 * - Market cap, P/E ratio, and other fundamental metrics
 * - Pre-market and after-hours pricing when available
 * - Market status and trading session information
 *
 * @example
 * ```typescript
 * // Get all current prices
 * const prices = await getAllCurrentPrices();
 *
 * // Display market summary
 * Object.entries(prices).forEach(([symbol, quote]) => {
 *   const changePercent = ((quote.regularMarketPrice - quote.regularMarketPreviousClose) / quote.regularMarketPreviousClose * 100);
 *   const direction = changePercent >= 0 ? '▲' : '▼';
 *
 *   console.log(`${symbol}: $${quote.regularMarketPrice.toFixed(2)} ${direction} ${changePercent.toFixed(2)}%`);
 * });
 * ```
 *
 * @example
 * ```typescript
 * // React component displaying live prices
 * function LivePricesDashboard() {
 *   const [prices, setPrices] = useState<Record<string, YahooQuote>>({});
 *   const [loading, setLoading] = useState(true);
 *   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
 *
 *   useEffect(() => {
 *     const loadPrices = async () => {
 *       try {
 *         const data = await getAllCurrentPrices();
 *         setPrices(data);
 *         setLastUpdate(new Date());
 *       } catch (error) {
 *         console.error('Failed to load prices:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     // Initial load
 *     loadPrices();
 *
 *     // Set up periodic refresh every 30 seconds
 *     const interval = setInterval(loadPrices, 30000);
 *
 *     return () => clearInterval(interval);
 *   }, []);
 *
 *   if (loading) return <div>Loading market data...</div>;
 *
 *   return (
 *     <div>
 *       <h1>Live Market Prices</h1>
 *       <p>Last updated: {lastUpdate?.toLocaleTimeString()}</p>
 *       <div className="price-grid">
 *         {Object.entries(prices).map(([symbol, quote]) => (
 *           <PriceCard key={symbol} symbol={symbol} quote={quote} />
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Calculate market statistics
 * try {
 *   const prices = await getAllCurrentPrices();
 *
 *   const symbols = Object.keys(prices);
 *   const quotes = Object.values(prices);
 *
 *   // Calculate gains vs losses
 *   const gainers = quotes.filter(q =>
 *     q.regularMarketPrice > q.regularMarketPreviousClose
 *   );
 *   const losers = quotes.filter(q =>
 *     q.regularMarketPrice < q.regularMarketPreviousClose
 *   );
 *
 *   console.log(`Market Summary:`);
 *   console.log(`Total symbols: ${symbols.length}`);
 *   console.log(`Gainers: ${gainers.length}`);
 *   console.log(`Losers: ${losers.length}`);
 *   console.log(`Unchanged: ${symbols.length - gainers.length - losers.length}`);
 *
 *   // Find biggest movers
 *   const sortedByChange = quotes
 *     .map(quote => ({
 *       symbol: quote.symbol,
 *       changePercent: ((quote.regularMarketPrice - quote.regularMarketPreviousClose) / quote.regularMarketPreviousClose) * 100
 *     }))
 *     .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
 *
 *   console.log('Biggest movers:');
 *   sortedByChange.slice(0, 5).forEach(item => {
 *     console.log(`${item.symbol}: ${item.changePercent.toFixed(2)}%`);
 *   });
 *
 * } catch (error) {
 *   console.error('Market analysis failed:', error);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Price monitoring with alerts
 * class PriceMonitor {
 *   private alerts: Map<string, number> = new Map();
 *
 *   setAlert(symbol: string, targetPrice: number) {
 *     this.alerts.set(symbol, targetPrice);
 *   }
 *
 *   async checkAlerts() {
 *     try {
 *       const prices = await getAllCurrentPrices();
 *
 *       this.alerts.forEach((targetPrice, symbol) => {
 *         const currentPrice = prices[symbol]?.regularMarketPrice;
 *
 *         if (currentPrice && currentPrice >= targetPrice) {
 *           console.log(`🚨 ALERT: ${symbol} reached target price $${targetPrice}`);
 *           console.log(`Current price: $${currentPrice}`);
 *
 *           // Remove triggered alert
 *           this.alerts.delete(symbol);
 *         }
 *       });
 *     } catch (error) {
 *       console.error('Alert check failed:', error);
 *     }
 *   }
 *
 *   startMonitoring(intervalMs = 60000) {
 *     return setInterval(() => this.checkAlerts(), intervalMs);
 *   }
 * }
 *
 * // Usage
 * const monitor = new PriceMonitor();
 * monitor.setAlert('AAPL', 200);
 * monitor.setAlert('GOOGL', 150);
 * const monitoringInterval = monitor.startMonitoring();
 * ```
 */
export async function getAllCurrentPrices(): Promise<
  Record<string, YahooQuote>
> {
  try {
    return await client.get<Record<string, YahooQuote>>("/api/prices/current");
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
