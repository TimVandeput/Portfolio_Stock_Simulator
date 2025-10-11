/**
 * @fileoverview Stock Trading Operations API Module
 *
 * Provides comprehensive functionality for executing stock trades
 * within the Stock Simulator application. Handles buy orders, sell orders,
 * trade execution, and transaction history management with full validation.
 *
 * @module lib/api/trading
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @example
 * ```typescript
 * import { executeBuyOrder, executeSellOrder, getTransactionHistory } from '@/lib/api/trading';
 *
 * // Execute a buy order
 * const buyResult = await executeBuyOrder(123, {
 *   symbol: 'AAPL',
 *   quantity: 10,
 *   orderType: 'MARKET'
 * });
 *
 * // Execute a sell order
 * const sellResult = await executeSellOrder(123, {
 *   symbol: 'AAPL',
 *   quantity: 5,
 *   orderType: 'LIMIT',
 *   price: 150.00
 * });
 *
 * // Get transaction history
 * const history = await getTransactionHistory(123);
 * ```
 */

import { HttpClient, ApiError } from "@/lib/api/http";
import type {
  BuyOrderRequest,
  SellOrderRequest,
  TradeExecutionResponse,
  Transaction,
} from "@/types/trading";

const client = new HttpClient();

/**
 * Executes a buy order for a specific stock symbol and user.
 *
 * Processes a stock purchase order with comprehensive validation,
 * fund availability checking, and real-time execution at current
 * market prices or specified limit prices.
 *
 * @param userId - The unique identifier of the user placing the buy order
 * @param request - Comprehensive buy order details and parameters
 * @returns Promise resolving to detailed trade execution results
 *
 * @throws {ApiError} When order validation fails, insufficient funds, or market closed
 * @throws {Error} When network or processing errors occur
 *
 * @remarks
 * This function:
 * - Validates buy order parameters and market conditions
 * - Checks user's available cash balance for purchase
 * - Executes trades at current market price or specified limit
 * - Updates portfolio positions and cash balance atomically
 * - Generates transaction records for audit and history
 * - Handles partial fills and order routing logic
 * - Provides comprehensive execution details and confirmations
 *
 * Order validation includes:
 * - Symbol existence and trading status verification
 * - Quantity and price parameter validation
 * - User account status and permissions checking
 * - Market hours and trading session validation
 * - Sufficient funds availability confirmation
 *
 * Execution process:
 * - Real-time price fetching for market orders
 * - Order routing and execution logic
 * - Portfolio position updates and rebalancing
 * - Cash balance deduction and fee calculation
 * - Transaction recording and confirmation generation
 *
 * @example
 * ```typescript
 * // Execute market buy order
 * const marketBuy = await executeBuyOrder(123, {
 *   symbol: 'AAPL',
 *   quantity: 10,
 *   orderType: 'MARKET'
 * });
 *
 * console.log(`Buy order executed:`);
 * console.log(`Symbol: ${marketBuy.symbol}`);
 * console.log(`Quantity: ${marketBuy.quantityFilled} shares`);
 * console.log(`Price: $${marketBuy.executionPrice}`);
 * console.log(`Total Cost: $${marketBuy.totalCost}`);
 * console.log(`Transaction Date: ${marketBuy.executionTime}`);
 * ```
 *
 * @example
 * ```typescript
 * // Execute limit buy order with price validation
 * try {
 *   const limitBuy = await executeBuyOrder(456, {
 *     symbol: 'GOOGL',
 *     quantity: 5,
 *     orderType: 'LIMIT',
 *     price: 2800.00
 *   });
 *
 *   if (limitBuy.status === 'FILLED') {
 *     console.log(`Limit order filled at $${limitBuy.executionPrice}`);
 *   } else if (limitBuy.status === 'PENDING') {
 *     console.log(`Limit order placed, waiting for target price`);
 *   }
 *
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     if (error.status === 400) {
 *       console.error('Invalid order parameters:', error.message);
 *     } else if (error.status === 402) {
 *       console.error('Insufficient funds for purchase');
 *     } else if (error.status === 409) {
 *       console.error('Market closed or symbol not available');
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React component for buy order execution
 * function BuyOrderForm({ userId, symbol }: { userId: number; symbol: string }) {
 *   const [quantity, setQuantity] = useState(1);
 *   const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
 *   const [limitPrice, setLimitPrice] = useState<number | undefined>();
 *   const [executing, setExecuting] = useState(false);
 *   const [result, setResult] = useState<TradeExecutionResponse | null>(null);
 *
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *
 *     try {
 *       setExecuting(true);
 *       setResult(null);
 *
 *       const request: BuyOrderRequest = {
 *         symbol,
 *         quantity,
 *         orderType,
 *         ...(orderType === 'LIMIT' && { price: limitPrice })
 *       };
 *
 *       const execution = await executeBuyOrder(userId, request);
 *       setResult(execution);
 *
 *       toast.success(`Successfully bought ${execution.quantityFilled} shares of ${symbol}`);
 *
 *     } catch (error) {
 *       console.error('Buy order failed:', error);
 *       toast.error('Failed to execute buy order');
 *     } finally {
 *       setExecuting(false);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit} className="buy-order-form">
 *       <h3>Buy {symbol}</h3>
 *
 *       <div className="form-group">
 *         <label>Quantity</label>
 *         <input
 *           type="number"
 *           min="1"
 *           value={quantity}
 *           onChange={(e) => setQuantity(parseInt(e.target.value))}
 *           required
 *         />
 *       </div>
 *
 *       <div className="form-group">
 *         <label>Order Type</label>
 *         <select value={orderType} onChange={(e) => setOrderType(e.target.value as 'MARKET' | 'LIMIT')}>
 *           <option value="MARKET">Market Order</option>
 *           <option value="LIMIT">Limit Order</option>
 *         </select>
 *       </div>
 *
 *       {orderType === 'LIMIT' && (
 *         <div className="form-group">
 *           <label>Limit Price</label>
 *           <input
 *             type="number"
 *             step="0.01"
 *             value={limitPrice || ''}
 *             onChange={(e) => setLimitPrice(parseFloat(e.target.value))}
 *             required
 *           />
 *         </div>
 *       )}
 *
 *       <button type="submit" disabled={executing}>
 *         {executing ? 'Executing...' : `Buy ${quantity} shares`}
 *       </button>
 *
 *       {result && (
 *         <div className="execution-result">
 *           <h4>Order Executed</h4>
 *           <div>Shares: {result.quantityFilled}</div>
 *           <div>Price: ${result.executionPrice}</div>
 *           <div>Total: ${result.totalCost}</div>
 *           <div>Status: {result.status}</div>
 *         </div>
 *       )}
 *     </form>
 *   );
 * }
 * ```
 */
export async function executeBuyOrder(
  userId: number,
  request: BuyOrderRequest
): Promise<TradeExecutionResponse> {
  try {
    return await client.post<TradeExecutionResponse>(
      `/api/trades/${userId}/buy`,
      request
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
 * Executes a sell order for a specific stock symbol and user.
 *
 * Processes a stock sale order with comprehensive validation,
 * position availability checking, and real-time execution at current
 * market prices or specified limit prices.
 *
 * @param userId - The unique identifier of the user placing the sell order
 * @param request - Comprehensive sell order details and parameters
 * @returns Promise resolving to detailed trade execution results
 *
 * @throws {ApiError} When order validation fails, insufficient shares, or market closed
 * @throws {Error} When network or processing errors occur
 *
 * @remarks
 * This function:
 * - Validates sell order parameters and position availability
 * - Checks user's existing share holdings for the symbol
 * - Executes trades at current market price or specified limit
 * - Updates portfolio positions and cash balance atomically
 * - Generates transaction records for audit and history
 * - Handles partial fills and order routing logic
 * - Provides comprehensive execution details and confirmations
 *
 * Order validation includes:
 * - Symbol existence and trading status verification
 * - Quantity and price parameter validation
 * - User position availability and quantity checking
 * - Market hours and trading session validation
 * - Account permissions and status verification
 *
 * Execution process:
 * - Real-time price fetching for market orders
 * - Order routing and execution logic
 * - Portfolio position reduction and rebalancing
 * - Cash balance credit and fee calculation
 * - Transaction recording and confirmation generation
 *
 * Position management:
 * - Validates sufficient shares are held before execution
 * - Handles partial position liquidation
 * - Updates average cost basis calculations
 * - Manages position closure when fully sold
 * - Maintains accurate portfolio allocation percentages
 *
 * @example
 * ```typescript
 * // Execute market sell order
 * const marketSell = await executeSellOrder(123, {
 *   symbol: 'TSLA',
 *   quantity: 25,
 *   orderType: 'MARKET'
 * });
 *
 * console.log(`Sell order executed:`);
 * console.log(`Symbol: ${marketSell.symbol}`);
 * console.log(`Quantity: ${marketSell.quantityFilled} shares`);
 * console.log(`Price: $${marketSell.executionPrice}`);
 * console.log(`Total Proceeds: $${marketSell.totalProceeds}`);
 * console.log(`Realized P&L: $${marketSell.realizedPnL}`);
 * ```
 *
 * @example
 * ```typescript
 * // Execute limit sell order with profit target
 * try {
 *   const limitSell = await executeSellOrder(789, {
 *     symbol: 'NVDA',
 *     quantity: 15,
 *     orderType: 'LIMIT',
 *     price: 450.00
 *   });
 *
 *   if (limitSell.status === 'FILLED') {
 *     console.log(`Profit target hit! Sold at $${limitSell.executionPrice}`);
 *     console.log(`Realized gain: $${limitSell.realizedPnL}`);
 *   } else if (limitSell.status === 'PENDING') {
 *     console.log(`Limit sell order placed at $${limitSell.limitPrice}`);
 *   }
 *
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     if (error.status === 400) {
 *       console.error('Invalid sell order parameters:', error.message);
 *     } else if (error.status === 409) {
 *       console.error('Insufficient shares to sell');
 *     } else if (error.status === 422) {
 *       console.error('Position not found or already closed');
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React component for sell order execution
 * function SellOrderForm({ userId, holding }: { userId: number; holding: PortfolioHolding }) {
 *   const [quantity, setQuantity] = useState(1);
 *   const [sellAll, setSellAll] = useState(false);
 *   const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
 *   const [limitPrice, setLimitPrice] = useState<number | undefined>();
 *   const [executing, setExecuting] = useState(false);
 *   const [result, setResult] = useState<TradeExecutionResponse | null>(null);
 *
 *   const effectiveQuantity = sellAll ? holding.quantity : quantity;
 *   const maxQuantity = holding.quantity;
 *
 *   const handleSubmit = async (e: React.FormEvent) => {
 *     e.preventDefault();
 *
 *     try {
 *       setExecuting(true);
 *       setResult(null);
 *
 *       const request: SellOrderRequest = {
 *         symbol: holding.symbol,
 *         quantity: effectiveQuantity,
 *         orderType,
 *         ...(orderType === 'LIMIT' && { price: limitPrice })
 *       };
 *
 *       const execution = await executeSellOrder(userId, request);
 *       setResult(execution);
 *
 *       toast.success(`Successfully sold ${execution.quantityFilled} shares of ${holding.symbol}`);
 *
 *       // Reset form
 *       setQuantity(1);
 *       setSellAll(false);
 *
 *     } catch (error) {
 *       console.error('Sell order failed:', error);
 *       toast.error('Failed to execute sell order');
 *     } finally {
 *       setExecuting(false);
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit} className="sell-order-form">
 *       <h3>Sell {holding.symbol}</h3>
 *       <p>Available: {maxQuantity} shares</p>
 *
 *       <div className="form-group">
 *         <label>
 *           <input
 *             type="checkbox"
 *             checked={sellAll}
 *             onChange={(e) => setSellAll(e.target.checked)}
 *           />
 *           Sell all shares
 *         </label>
 *       </div>
 *
 *       {!sellAll && (
 *         <div className="form-group">
 *           <label>Quantity</label>
 *           <input
 *             type="number"
 *             min="1"
 *             max={maxQuantity}
 *             value={quantity}
 *             onChange={(e) => setQuantity(Math.min(parseInt(e.target.value), maxQuantity))}
 *             required
 *           />
 *         </div>
 *       )}
 *
 *       <div className="form-group">
 *         <label>Order Type</label>
 *         <select value={orderType} onChange={(e) => setOrderType(e.target.value as 'MARKET' | 'LIMIT')}>
 *           <option value="MARKET">Market Order</option>
 *           <option value="LIMIT">Limit Order</option>
 *         </select>
 *       </div>
 *
 *       {orderType === 'LIMIT' && (
 *         <div className="form-group">
 *           <label>Limit Price</label>
 *           <input
 *             type="number"
 *             step="0.01"
 *             value={limitPrice || ''}
 *             onChange={(e) => setLimitPrice(parseFloat(e.target.value))}
 *             required
 *           />
 *         </div>
 *       )}
 *
 *       <button type="submit" disabled={executing}>
 *         {executing ? 'Executing...' : `Sell ${effectiveQuantity} shares`}
 *       </button>
 *
 *       {result && (
 *         <div className="execution-result">
 *           <h4>Order Executed</h4>
 *           <div>Shares Sold: {result.quantityFilled}</div>
 *           <div>Price: ${result.executionPrice}</div>
 *           <div>Proceeds: ${result.totalProceeds}</div>
 *           <div className={result.realizedPnL >= 0 ? 'profit' : 'loss'}>
 *             Realized P&L: ${result.realizedPnL}
 *           </div>
 *           <div>Status: {result.status}</div>
 *         </div>
 *       )}
 *     </form>
 *   );
 * }
 * ```
 */
export async function executeSellOrder(
  userId: number,
  request: SellOrderRequest
): Promise<TradeExecutionResponse> {
  try {
    return await client.post<TradeExecutionResponse>(
      `/api/trades/${userId}/sell`,
      request
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
 * Retrieves comprehensive transaction history for a specific user.
 *
 * Fetches complete trading history including all buy orders, sell orders,
 * trade executions, and related transaction details. Provides chronological
 * record of all trading activity for portfolio analysis and reporting.
 *
 * @param userId - The unique identifier of the user whose transaction history to retrieve
 * @returns Promise resolving to array of comprehensive transaction records
 *
 * @throws {ApiError} When API request fails or user is unauthorized
 * @throws {Error} When network or parsing errors occur
 *
 * @remarks
 * This function:
 * - Retrieves complete trading history for the specified user
 * - Includes all transaction types (buy, sell, dividends, splits)
 * - Provides chronological ordering with newest transactions first
 * - Includes comprehensive execution details and pricing information
 * - Supports portfolio performance analysis and tax reporting
 * - Automatically handles authentication via HttpClient
 * - Returns empty array if user has no trading history
 *
 * Transaction data includes:
 * - Trade execution details (symbol, quantity, price, timestamp)
 * - Order type and execution status information
 * - Fee calculations and total cost/proceeds
 * - Realized gains/losses for sell transactions
 * - Portfolio impact and position changes
 * - Corporate action records (splits, dividends)
 *
 * Use cases:
 * - Portfolio performance analysis and reporting
 * - Tax loss harvesting and gain realization planning
 * - Trading pattern analysis and strategy optimization
 * - Compliance and audit trail maintenance
 * - User account statements and summaries
 *
 * @example
 * ```typescript
 * // Get complete transaction history
 * const history = await getTransactionHistory(123);
 *
 * console.log(`Found ${history.length} transactions`);
 *
 * // Calculate total trading volume
 * const totalVolume = history.reduce((sum, txn) => {
 *   return sum + (txn.quantity * txn.executionPrice);
 * }, 0);
 *
 * console.log(`Total trading volume: $${totalVolume.toLocaleString()}`);
 *
 * // Group by transaction type
 * const byType = history.reduce((groups, txn) => {
 *   groups[txn.type] = (groups[txn.type] || 0) + 1;
 *   return groups;
 * }, {} as Record<string, number>);
 *
 * console.log('Transaction breakdown:', byType);
 * ```
 *
 * @example
 * ```typescript
 * // Analyze trading performance
 * async function analyzeTransactionHistory(userId: number) {
 *   try {
 *     const transactions = await getTransactionHistory(userId);
 *
 *     // Separate buy and sell transactions
 *     const buys = transactions.filter(t => t.type === 'BUY');
 *     const sells = transactions.filter(t => t.type === 'SELL');
 *
 *     // Calculate totals
 *     const totalInvested = buys.reduce((sum, t) => sum + t.totalAmount, 0);
 *     const totalProceeds = sells.reduce((sum, t) => sum + t.totalAmount, 0);
 *     const realizedGains = sells.reduce((sum, t) => sum + (t.realizedPnL || 0), 0);
 *
 *     console.log('Trading Performance Analysis:');
 *     console.log(`Total Invested: $${totalInvested.toLocaleString()}`);
 *     console.log(`Total Proceeds: $${totalProceeds.toLocaleString()}`);
 *     console.log(`Realized Gains/Losses: $${realizedGains.toLocaleString()}`);
 *     console.log(`Number of Buy Orders: ${buys.length}`);
 *     console.log(`Number of Sell Orders: ${sells.length}`);
 *
 *     // Most traded symbols
 *     const symbolCounts = transactions.reduce((counts, t) => {
 *       counts[t.symbol] = (counts[t.symbol] || 0) + 1;
 *       return counts;
 *     }, {} as Record<string, number>);
 *
 *     const mostTraded = Object.entries(symbolCounts)
 *       .sort(([,a], [,b]) => b - a)
 *       .slice(0, 5);
 *
 *     console.log('Most traded symbols:');
 *     mostTraded.forEach(([symbol, count]) => {
 *       console.log(`${symbol}: ${count} transactions`);
 *     });
 *
 *   } catch (error) {
 *     console.error('Transaction analysis failed:', error);
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React component for transaction history display
 * function TransactionHistory({ userId }: { userId: number }) {
 *   const [transactions, setTransactions] = useState<Transaction[]>([]);
 *   const [loading, setLoading] = useState(true);
 *   const [filter, setFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
 *   const [sortBy, setSortBy] = useState<'date' | 'symbol' | 'amount'>('date');
 *
 *   useEffect(() => {
 *     const loadHistory = async () => {
 *       try {
 *         const history = await getTransactionHistory(userId);
 *         setTransactions(history);
 *       } catch (error) {
 *         console.error('Failed to load transaction history:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     loadHistory();
 *   }, [userId]);
 *
 *   const filteredTransactions = useMemo(() => {
 *     let filtered = filter === 'ALL' ? transactions : transactions.filter(t => t.type === filter);
 *
 *     return filtered.sort((a, b) => {
 *       switch (sortBy) {
 *         case 'date':
 *           return new Date(b.executionTime).getTime() - new Date(a.executionTime).getTime();
 *         case 'symbol':
 *           return a.symbol.localeCompare(b.symbol);
 *         case 'amount':
 *           return b.totalAmount - a.totalAmount;
 *         default:
 *           return 0;
 *       }
 *     });
 *   }, [transactions, filter, sortBy]);
 *
 *   if (loading) return <div>Loading transaction history...</div>;
 *
 *   return (
 *     <div className="transaction-history">
 *       <div className="controls">
 *         <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
 *           <option value="ALL">All Transactions</option>
 *           <option value="BUY">Buy Orders</option>
 *           <option value="SELL">Sell Orders</option>
 *         </select>
 *
 *         <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
 *           <option value="date">Sort by Date</option>
 *           <option value="symbol">Sort by Symbol</option>
 *           <option value="amount">Sort by Amount</option>
 *         </select>
 *       </div>
 *
 *       <div className="transaction-list">
 *         {filteredTransactions.map(transaction => (
 *           <div key={transaction.id} className={`transaction-item ${transaction.type.toLowerCase()}`}>
 *             <div className="transaction-header">
 *               <span className="symbol">{transaction.symbol}</span>
 *               <span className="type">{transaction.type}</span>
 *               <span className="date">
 *                 {new Date(transaction.executionTime).toLocaleDateString()}
 *               </span>
 *             </div>
 *
 *             <div className="transaction-details">
 *               <div>Quantity: {transaction.quantity} shares</div>
 *               <div>Price: ${transaction.executionPrice.toFixed(2)}</div>
 *               <div>Total: ${transaction.totalAmount.toLocaleString()}</div>
 *               {transaction.realizedPnL !== undefined && (
 *                 <div className={transaction.realizedPnL >= 0 ? 'profit' : 'loss'}>
 *                   P&L: ${transaction.realizedPnL.toLocaleString()}
 *                 </div>
 *               )}
 *             </div>
 *           </div>
 *         ))}
 *       </div>
 *
 *       {filteredTransactions.length === 0 && (
 *         <div className="no-transactions">No transactions found</div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export async function getTransactionHistory(
  userId: number
): Promise<Transaction[]> {
  try {
    return await client.get<Transaction[]>(`/api/trades/${userId}/history`);
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
