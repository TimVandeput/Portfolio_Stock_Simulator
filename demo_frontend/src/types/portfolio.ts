/**
 * @fileoverview Portfolio Management and Holdings Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * Individual stock holding within a user's portfolio.
 *
 * Represents a single stock position including quantity, cost basis,
 * and trade history. Used to track individual investments and calculate
 * performance metrics for each stock in the portfolio.
 *
 * @interface PortfolioHolding
 * @property {string} symbol - Stock symbol/ticker (e.g., "AAPL", "GOOGL")
 * @property {number} quantity - Number of shares owned
 * @property {number} avgCostBasis - Average cost per share (dollar cost averaging)
 * @property {number} totalCost - Total amount invested in this position
 * @property {string} lastTradeDate - ISO date string of most recent trade
 *
 * @example
 * ```typescript
 * const appleHolding: PortfolioHolding = {
 *   symbol: "AAPL",
 *   quantity: 100,
 *   avgCostBasis: 145.50,
 *   totalCost: 14550.00,
 *   lastTradeDate: "2024-03-15T10:30:00Z"
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Calculate current value and P&L
 * function calculateHoldingMetrics(holding: PortfolioHolding, currentPrice: number) {
 *   const currentValue = holding.quantity * currentPrice;
 *   const unrealizedPnL = currentValue - holding.totalCost;
 *   const unrealizedPnLPercent = (unrealizedPnL / holding.totalCost) * 100;
 *
 *   return {
 *     currentValue,
 *     unrealizedPnL,
 *     unrealizedPnLPercent,
 *     gainLoss: unrealizedPnL >= 0 ? 'gain' : 'loss'
 *   };
 * }
 * ```
 */
export interface PortfolioHolding {
  symbol: string;
  quantity: number;
  avgCostBasis: number;
  totalCost: number;
  lastTradeDate: string;
}

/**
 * Complete portfolio response with holdings, wallet, and performance summary.
 *
 * Comprehensive portfolio data structure returned by the portfolio API,
 * including all stock holdings, cash balance information, and aggregated
 * performance metrics. Used for portfolio dashboard and analysis views.
 *
 * @interface PortfolioResponse
 * @property {PortfolioHolding[]} holdings - Array of all stock positions in portfolio
 * @property {Object} walletBalance - Cash and investment balance information
 * @property {number} walletBalance.cashBalance - Available cash for trading
 * @property {number} walletBalance.totalValue - Total value of all investments
 * @property {number} walletBalance.totalInvested - Total amount invested (cost basis)
 * @property {Object} summary - Aggregated portfolio performance metrics
 * @property {number} summary.totalPortfolioValue - Combined value of holdings + cash
 * @property {number} summary.totalUnrealizedPnL - Total unrealized profit/loss
 * @property {number} summary.totalRealizedPnL - Total realized profit/loss from completed trades
 * @property {number} summary.totalPnLPercent - Total P&L as percentage of invested amount
 *
 * @example
 * ```typescript
 * const portfolioData: PortfolioResponse = {
 *   holdings: [
 *     {
 *       symbol: "AAPL",
 *       quantity: 100,
 *       avgCostBasis: 145.50,
 *       totalCost: 14550.00,
 *       lastTradeDate: "2024-03-15T10:30:00Z"
 *     },
 *     {
 *       symbol: "GOOGL",
 *       quantity: 50,
 *       avgCostBasis: 2750.25,
 *       totalCost: 137512.50,
 *       lastTradeDate: "2024-03-14T14:22:00Z"
 *     }
 *   ],
 *   walletBalance: {
 *     cashBalance: 25000.00,
 *     totalValue: 165000.00,
 *     totalInvested: 152062.50
 *   },
 *   summary: {
 *     totalPortfolioValue: 190000.00,
 *     totalUnrealizedPnL: 12937.50,
 *     totalRealizedPnL: 2500.00,
 *     totalPnLPercent: 8.51
 *   }
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Portfolio dashboard component
 * function PortfolioDashboard({ portfolio }: { portfolio: PortfolioResponse }) {
 *   const { holdings, walletBalance, summary } = portfolio;
 *
 *   return (
 *     <div className="portfolio-dashboard">
 *       <div className="portfolio-summary">
 *         <h2>Portfolio Value: ${summary.totalPortfolioValue.toLocaleString()}</h2>
 *         <p className={summary.totalUnrealizedPnL >= 0 ? 'gain' : 'loss'}>
 *           Total P&L: ${summary.totalUnrealizedPnL.toLocaleString()}
 *           ({summary.totalPnLPercent.toFixed(2)}%)
 *         </p>
 *         <p>Available Cash: ${walletBalance.cashBalance.toLocaleString()}</p>
 *       </div>
 *
 *       <div className="holdings">
 *         <h3>Holdings ({holdings.length})</h3>
 *         {holdings.map(holding => (
 *           <HoldingCard key={holding.symbol} holding={holding} />
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export interface PortfolioResponse {
  holdings: PortfolioHolding[];
  walletBalance: {
    cashBalance: number;
    totalValue: number;
    totalInvested: number;
  };
  summary: {
    totalPortfolioValue: number;
    totalUnrealizedPnL: number;
    totalRealizedPnL: number;
    totalPnLPercent: number;
  };
}
