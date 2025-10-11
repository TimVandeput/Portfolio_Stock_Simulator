/**
 * @fileoverview Portfolio Management API Module
 *
 * Provides comprehensive functionality for managing user portfolios
 * within the Stock Simulator application. Handles portfolio retrieval,
 * individual holding management, performance tracking, and position analysis.
 *
 * @module lib/api/portfolio
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @example
 * ```typescript
 * import { getUserPortfolio, getUserHolding } from '@/lib/api/portfolio';
 *
 * // Get complete portfolio overview
 * const portfolio = await getUserPortfolio(123);
 * console.log(`Portfolio value: $${portfolio.totalValue}`);
 *
 * // Get specific holding details
 * const holding = await getUserHolding(123, 'AAPL');
 * console.log(`AAPL position: ${holding.quantity} shares`);
 * ```
 */

import { HttpClient, ApiError } from "@/lib/api/http";
import type { PortfolioResponse, PortfolioHolding } from "@/types/portfolio";

const client = new HttpClient();

/**
 * Retrieves complete portfolio information for a specific user.
 *
 * Fetches comprehensive portfolio data including all holdings, total values,
 * performance metrics, cash balance, and portfolio-level statistics. This
 * provides a complete overview of the user's investment positions and performance.
 *
 * @param userId - The unique identifier of the user whose portfolio to retrieve
 * @returns Promise resolving to comprehensive portfolio data object
 *
 * @throws {ApiError} When API request fails or user is unauthorized
 * @throws {Error} When network or parsing errors occur
 *
 * @remarks
 * This function:
 * - Retrieves complete portfolio overview for the specified user
 * - Includes all current holdings with quantities and values
 * - Provides total portfolio value and cash balance
 * - Calculates performance metrics (gains/losses, percentages)
 * - Includes diversification and allocation data
 * - Automatically handles authentication via HttpClient
 * - Returns empty portfolio structure if user has no positions
 *
 * Portfolio data includes:
 * - All stock holdings with current market values
 * - Cash balance and buying power
 * - Total portfolio value and daily changes
 * - Performance metrics and returns
 * - Sector and geographic allocation
 * - Risk metrics and beta calculations
 *
 * @example
 * ```typescript
 * // Get complete portfolio overview
 * const portfolio = await getUserPortfolio(123);
 *
 * console.log(`Total Portfolio Value: $${portfolio.totalValue.toLocaleString()}`);
 * console.log(`Cash Balance: $${portfolio.cashBalance.toLocaleString()}`);
 * console.log(`Total Return: ${portfolio.totalReturnPercent.toFixed(2)}%`);
 * console.log(`Holdings: ${portfolio.holdings.length} positions`);
 *
 * // Display top holdings
 * portfolio.holdings
 *   .sort((a, b) => b.marketValue - a.marketValue)
 *   .slice(0, 5)
 *   .forEach(holding => {
 *     console.log(`${holding.symbol}: $${holding.marketValue} (${holding.quantity} shares)`);
 *   });
 * ```
 *
 * @example
 * ```typescript
 * // React component displaying portfolio summary
 * function PortfolioDashboard({ userId }: { userId: number }) {
 *   const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
 *   const [loading, setLoading] = useState(true);
 *
 *   useEffect(() => {
 *     const loadPortfolio = async () => {
 *       try {
 *         const data = await getUserPortfolio(userId);
 *         setPortfolio(data);
 *       } catch (error) {
 *         console.error('Failed to load portfolio:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     loadPortfolio();
 *   }, [userId]);
 *
 *   if (loading) return <div>Loading portfolio...</div>;
 *   if (!portfolio) return <div>Portfolio not found</div>;
 *
 *   return (
 *     <div>
 *       <h1>Portfolio Overview</h1>
 *       <div className="portfolio-stats">
 *         <div>Total Value: ${portfolio.totalValue.toLocaleString()}</div>
 *         <div>Cash: ${portfolio.cashBalance.toLocaleString()}</div>
 *         <div>Day Change: ${portfolio.dayChange.toLocaleString()}</div>
 *         <div>Total Return: {portfolio.totalReturnPercent.toFixed(2)}%</div>
 *       </div>
 *       <HoldingsList holdings={portfolio.holdings} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Calculate portfolio metrics
 * try {
 *   const portfolio = await getUserPortfolio(456);
 *
 *   // Calculate allocation percentages
 *   const allocations = portfolio.holdings.map(holding => ({
 *     symbol: holding.symbol,
 *     allocation: (holding.marketValue / portfolio.totalValue) * 100
 *   }));
 *
 *   // Find largest positions
 *   const topHoldings = allocations
 *     .sort((a, b) => b.allocation - a.allocation)
 *     .slice(0, 3);
 *
 *   console.log('Top 3 Holdings:');
 *   topHoldings.forEach(holding => {
 *     console.log(`${holding.symbol}: ${holding.allocation.toFixed(1)}%`);
 *   });
 *
 *   // Calculate portfolio concentration
 *   const top5Concentration = allocations
 *     .slice(0, 5)
 *     .reduce((sum, holding) => sum + holding.allocation, 0);
 *
 *   console.log(`Top 5 concentration: ${top5Concentration.toFixed(1)}%`);
 * } catch (error) {
 *   console.error('Portfolio analysis failed:', error);
 * }
 * ```
 */
export async function getUserPortfolio(
  userId: number
): Promise<PortfolioResponse> {
  try {
    return await client.get<PortfolioResponse>(`/api/portfolio/${userId}`);
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
 * Retrieves detailed information for a specific holding in a user's portfolio.
 *
 * Fetches comprehensive data for a single stock position including quantity,
 * cost basis, current market value, performance metrics, and transaction history.
 * This provides detailed analysis for individual portfolio positions.
 *
 * @param userId - The unique identifier of the user who owns the holding
 * @param symbol - The stock symbol to retrieve holding details for
 * @returns Promise resolving to detailed holding information object
 *
 * @throws {ApiError} When API request fails, holding not found, or user unauthorized
 * @throws {Error} When network or parsing errors occur
 *
 * @remarks
 * This function:
 * - Retrieves detailed data for a specific stock holding
 * - Includes quantity, average cost basis, and current market value
 * - Provides performance metrics (unrealized gains/losses)
 * - Includes transaction history and purchase dates
 * - Calculates position-level statistics and ratios
 * - Automatically handles authentication via HttpClient
 * - Throws error if holding doesn't exist in user's portfolio
 *
 * Holding data includes:
 * - Current quantity and market value
 * - Average cost basis and total cost
 * - Unrealized gain/loss amounts and percentages
 * - Last purchase date and price
 * - Position allocation within portfolio
 * - Dividend and split history
 *
 * @example
 * ```typescript
 * // Get specific holding details
 * const holding = await getUserHolding(123, 'AAPL');
 *
 * console.log(`Symbol: ${holding.symbol}`);
 * console.log(`Quantity: ${holding.quantity} shares`);
 * console.log(`Market Value: $${holding.marketValue.toLocaleString()}`);
 * console.log(`Average Cost: $${holding.averageCost.toFixed(2)}`);
 * console.log(`Unrealized P&L: $${holding.unrealizedPnL.toLocaleString()}`);
 * console.log(`Return: ${holding.returnPercent.toFixed(2)}%`);
 * ```
 *
 * @example
 * ```typescript
 * // React component for individual holding details
 * function HoldingDetail({ userId, symbol }: { userId: number; symbol: string }) {
 *   const [holding, setHolding] = useState<PortfolioHolding | null>(null);
 *   const [loading, setLoading] = useState(true);
 *   const [error, setError] = useState<string | null>(null);
 *
 *   useEffect(() => {
 *     const loadHolding = async () => {
 *       try {
 *         setLoading(true);
 *         setError(null);
 *         const data = await getUserHolding(userId, symbol);
 *         setHolding(data);
 *       } catch (err) {
 *         if (err instanceof ApiError && err.status === 404) {
 *           setError('Holding not found in portfolio');
 *         } else {
 *           setError('Failed to load holding details');
 *         }
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     loadHolding();
 *   }, [userId, symbol]);
 *
 *   if (loading) return <div>Loading holding details...</div>;
 *   if (error) return <div className="error">{error}</div>;
 *   if (!holding) return <div>Holding not found</div>;
 *
 *   return (
 *     <div className="holding-detail">
 *       <h2>{holding.symbol} Position</h2>
 *       <div className="stats">
 *         <div>Shares: {holding.quantity}</div>
 *         <div>Market Value: ${holding.marketValue.toLocaleString()}</div>
 *         <div>Avg Cost: ${holding.averageCost.toFixed(2)}</div>
 *         <div className={holding.unrealizedPnL >= 0 ? 'profit' : 'loss'}>
 *           P&L: ${holding.unrealizedPnL.toLocaleString()} ({holding.returnPercent.toFixed(2)}%)
 *         </div>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Analyze multiple holdings for portfolio insights
 * async function analyzePortfolioHoldings(userId: number, symbols: string[]) {
 *   try {
 *     const holdings = await Promise.all(
 *       symbols.map(symbol => getUserHolding(userId, symbol))
 *     );
 *
 *     // Calculate performance metrics
 *     const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
 *     const totalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0);
 *     const totalPnL = holdings.reduce((sum, h) => sum + h.unrealizedPnL, 0);
 *
 *     console.log('Portfolio Analysis:');
 *     console.log(`Total Value: $${totalValue.toLocaleString()}`);
 *     console.log(`Total Cost: $${totalCost.toLocaleString()}`);
 *     console.log(`Total P&L: $${totalPnL.toLocaleString()}`);
 *     console.log(`Overall Return: ${((totalPnL / totalCost) * 100).toFixed(2)}%`);
 *
 *     // Find best and worst performers
 *     const sortedByReturn = holdings.sort((a, b) => b.returnPercent - a.returnPercent);
 *     console.log(`Best Performer: ${sortedByReturn[0].symbol} (+${sortedByReturn[0].returnPercent.toFixed(2)}%)`);
 *     console.log(`Worst Performer: ${sortedByReturn[sortedByReturn.length - 1].symbol} (${sortedByReturn[sortedByReturn.length - 1].returnPercent.toFixed(2)}%)`);
 *
 *   } catch (error) {
 *     console.error('Portfolio analysis failed:', error);
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Monitor specific holding with automatic refresh
 * function useHoldingMonitor(userId: number, symbol: string, refreshInterval = 60000) {
 *   const [holding, setHolding] = useState<PortfolioHolding | null>(null);
 *   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
 *
 *   useEffect(() => {
 *     let interval: NodeJS.Timeout;
 *
 *     const updateHolding = async () => {
 *       try {
 *         const data = await getUserHolding(userId, symbol);
 *         setHolding(data);
 *         setLastUpdate(new Date());
 *       } catch (error) {
 *         console.error('Failed to update holding:', error);
 *       }
 *     };
 *
 *     // Initial load
 *     updateHolding();
 *
 *     // Set up periodic refresh
 *     interval = setInterval(updateHolding, refreshInterval);
 *
 *     return () => clearInterval(interval);
 *   }, [userId, symbol, refreshInterval]);
 *
 *   return { holding, lastUpdate };
 * }
 * ```
 */
export async function getUserHolding(
  userId: number,
  symbol: string
): Promise<PortfolioHolding> {
  try {
    return await client.get<PortfolioHolding>(
      `/api/portfolio/${userId}/holdings/${symbol}`
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
