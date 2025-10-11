/**
 * @fileoverview Stock Trading Operations Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * Transaction types for stock trading operations.
 *
 * Defines the supported transaction types in the trading system,
 * used for order classification, portfolio tracking, and transaction
 * history management.
 *
 * @typedef {("BUY" | "SELL")} TransactionType
 */
export type TransactionType = "BUY" | "SELL";

/**
 * Buy order request structure for stock purchases.
 *
 * Contains the required information for placing a stock buy order,
 * including symbol, quantity, and expected price for execution.
 * Used when submitting buy orders through the trading API.
 *
 * @interface BuyOrderRequest
 * @property {string} symbol - Stock symbol to purchase (e.g., "AAPL")
 * @property {number} quantity - Number of shares to buy
 * @property {number} expectedPrice - Expected price per share for execution
 *
 * @example
 * ```typescript
 * const buyOrder: BuyOrderRequest = {
 *   symbol: "AAPL",
 *   quantity: 100,
 *   expectedPrice: 150.25
 * };
 *
 * const result = await executeBuyOrder(buyOrder);
 * ```
 */
export interface BuyOrderRequest {
  symbol: string;
  quantity: number;
  expectedPrice: number;
}

/**
 * Sell order request structure for stock sales.
 *
 * Contains the required information for placing a stock sell order,
 * including symbol, quantity, and expected price for execution.
 * Used when submitting sell orders through the trading API.
 *
 * @interface SellOrderRequest
 * @property {string} symbol - Stock symbol to sell (e.g., "AAPL")
 * @property {number} quantity - Number of shares to sell
 * @property {number} expectedPrice - Expected price per share for execution
 *
 * @example
 * ```typescript
 * const sellOrder: SellOrderRequest = {
 *   symbol: "AAPL",
 *   quantity: 50,
 *   expectedPrice: 155.75
 * };
 *
 * const result = await executeSellOrder(sellOrder);
 * ```
 */
export interface SellOrderRequest {
  symbol: string;
  quantity: number;
  expectedPrice: number;
}

/**
 * Trade execution response with transaction details and updated balances.
 *
 * Comprehensive response returned after successful trade execution,
 * including execution details, updated account balances, and confirmation
 * information. Used for order confirmation and portfolio updates.
 *
 * @interface TradeExecutionResponse
 * @property {string} symbol - Stock symbol that was traded
 * @property {number} quantity - Number of shares executed
 * @property {number} executionPrice - Actual price per share at execution
 * @property {number} totalAmount - Total transaction amount (quantity × price)
 * @property {TransactionType} transactionType - Type of transaction executed
 * @property {number} newCashBalance - Updated cash balance after trade
 * @property {number} newSharesOwned - Updated share count for this symbol
 * @property {string} message - Human-readable confirmation message
 * @property {string} executedAt - ISO timestamp of trade execution
 *
 * @example
 * ```typescript
 * const executionResult: TradeExecutionResponse = {
 *   symbol: "AAPL",
 *   quantity: 100,
 *   executionPrice: 150.25,
 *   totalAmount: 15025.00,
 *   transactionType: "BUY",
 *   newCashBalance: 34975.00,
 *   newSharesOwned: 100,
 *   message: "Successfully purchased 100 shares of AAPL at $150.25",
 *   executedAt: "2024-03-15T10:30:00Z"
 * };
 * ```
 */
export interface TradeExecutionResponse {
  symbol: string;
  quantity: number;
  executionPrice: number;
  totalAmount: number;
  transactionType: TransactionType;
  newCashBalance: number;
  newSharesOwned: number;
  message: string;
  executedAt: string;
}

/**
 * Portfolio holding with current market value and performance metrics.
 *
 * Represents a stock position with real-time market data, including
 * current valuation and profit/loss calculations. Used for portfolio
 * display and performance analysis.
 *
 * @interface PortfolioHoldingDTO
 * @property {string} symbol - Stock symbol for the holding
 * @property {number} shares - Number of shares owned
 * @property {number} averageCost - Average cost basis per share
 * @property {number} currentPrice - Current market price per share
 * @property {number} marketValue - Current total market value (shares × currentPrice)
 * @property {number} unrealizedGainLoss - Unrealized profit/loss in dollars
 * @property {number} unrealizedGainLossPercent - Unrealized P&L as percentage
 *
 * @example
 * ```typescript
 * const holding: PortfolioHoldingDTO = {
 *   symbol: "AAPL",
 *   shares: 100,
 *   averageCost: 145.50,
 *   currentPrice: 150.25,
 *   marketValue: 15025.00,
 *   unrealizedGainLoss: 475.00,
 *   unrealizedGainLossPercent: 3.26
 * };
 * ```
 */
export interface PortfolioHoldingDTO {
  symbol: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
}

/**
 * Complete portfolio summary with holdings and performance metrics.
 *
 * Aggregated portfolio data including all holdings, cash balance,
 * and overall performance calculations. Used for portfolio dashboard
 * and comprehensive portfolio analysis.
 *
 * @interface PortfolioSummaryDTO
 * @property {number} cashBalance - Available cash balance
 * @property {number} totalMarketValue - Total value of all stock holdings
 * @property {number} totalPortfolioValue - Combined cash + holdings value
 * @property {number} totalUnrealizedGainLoss - Total unrealized P&L across all holdings
 * @property {PortfolioHoldingDTO[]} holdings - Array of all portfolio holdings
 *
 * @example
 * ```typescript
 * const portfolioSummary: PortfolioSummaryDTO = {
 *   cashBalance: 25000.00,
 *   totalMarketValue: 165000.00,
 *   totalPortfolioValue: 190000.00,
 *   totalUnrealizedGainLoss: 12500.00,
 *   holdings: [
 *     {
 *       symbol: "AAPL",
 *       shares: 100,
 *       averageCost: 145.50,
 *       currentPrice: 150.25,
 *       marketValue: 15025.00,
 *       unrealizedGainLoss: 475.00,
 *       unrealizedGainLossPercent: 3.26
 *     }
 *   ]
 * };
 * ```
 */
export interface PortfolioSummaryDTO {
  cashBalance: number;
  totalMarketValue: number;
  totalPortfolioValue: number;
  totalUnrealizedGainLoss: number;
  holdings: PortfolioHoldingDTO[];
}

/**
 * Historical transaction record with profit/loss tracking.
 *
 * Represents a completed trading transaction with full details
 * including profit/loss calculation for sells. Used for transaction
 * history, tax reporting, and performance analysis.
 *
 * @interface Transaction
 * @property {number} id - Unique transaction identifier
 * @property {number} [userId] - ID of user who executed the transaction
 * @property {string} symbol - Stock symbol that was traded
 * @property {string} symbolName - Full company name for display
 * @property {number} quantity - Number of shares traded
 * @property {number} pricePerShare - Execution price per share
 * @property {number} totalAmount - Total transaction value
 * @property {number | null} profitLoss - Realized profit/loss (null for buys)
 * @property {TransactionType} type - Transaction type (BUY or SELL)
 * @property {string} executedAt - ISO timestamp of execution
 *
 * @example
 * ```typescript
 * const buyTransaction: Transaction = {
 *   id: 1,
 *   userId: 123,
 *   symbol: "AAPL",
 *   symbolName: "Apple Inc.",
 *   quantity: 100,
 *   pricePerShare: 145.50,
 *   totalAmount: 14550.00,
 *   profitLoss: null, // No P&L for buy transactions
 *   type: "BUY",
 *   executedAt: "2024-03-10T09:30:00Z"
 * };
 *
 * const sellTransaction: Transaction = {
 *   id: 2,
 *   userId: 123,
 *   symbol: "AAPL",
 *   symbolName: "Apple Inc.",
 *   quantity: 50,
 *   pricePerShare: 155.75,
 *   totalAmount: 7787.50,
 *   profitLoss: 512.50, // Realized gain
 *   type: "SELL",
 *   executedAt: "2024-03-15T14:45:00Z"
 * };
 * ```
 */
export interface Transaction {
  id: number;
  userId?: number;
  symbol: string;
  symbolName: string;
  quantity: number;
  pricePerShare: number;
  totalAmount: number;
  profitLoss: number | null;
  type: TransactionType;
  executedAt: string;
}
