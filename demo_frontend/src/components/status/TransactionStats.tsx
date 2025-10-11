/**
 * @fileoverview Transaction statistics component for trading activity analysis and insights
 *
 * This component provides comprehensive transaction statistics with visual indicators,
 * color-coded categorization, and professional data presentation. Features include
 * transaction type breakdown, dynamic iconography, and seamless integration with
 * portfolio management and trading analytics interfaces.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import type { Transaction } from "@/types/trading";
import type { BaseComponentProps } from "@/types/components";
import DynamicIcon from "@/components/ui/DynamicIcon";

/**
 * Props interface for TransactionStats component configuration
 * @interface TransactionStatsProps
 * @extends {BaseComponentProps}
 */
export interface TransactionStatsProps extends BaseComponentProps {
  /** Array of transactions to analyze and display statistics for */
  transactions: Transaction[];
}

/**
 * Transaction statistics component for trading activity analysis and insights
 *
 * @remarks
 * The TransactionStats component delivers comprehensive trading statistics with the following features:
 *
 * **Statistical Analysis:**
 * - Total transaction count across all types
 * - Buy order count with emerald color theming
 * - Sell order count with rose color theming
 * - Real-time calculation from transaction data
 *
 * **Visual Indicators:**
 * - Dynamic icons for each statistic type
 * - Color-coded categorization for buy/sell orders
 * - Professional iconography with consistent sizing
 * - Theme-integrated color palette
 *
 * **Data Presentation:**
 * - Responsive flex layout with wrapping
 * - Consistent gap spacing between statistics
 * - Professional typography with font weights
 * - Clear label-value associations
 *
 * **Icon Integration:**
 * - Receipt icon for total transactions
 * - Shopping cart icon for buy orders
 * - Dollar sign icon for sell orders
 * - Consistent 14px icon sizing
 *
 * **Color Theming:**
 * - Blue theming for total transaction count
 * - Emerald theming for buy order statistics
 * - Rose theming for sell order statistics
 * - Professional color psychology implementation
 *
 * **Responsive Design:**
 * - Flexible wrapping for narrow screens
 * - Consistent spacing across breakpoints
 * - Mobile-friendly touch targets
 * - Adaptive layout behavior
 *
 * **Typography:**
 * - Small text sizing for compact display
 * - Secondary text color for labels
 * - Bold font weight for numerical values
 * - Professional hierarchical styling
 *
 * **Component Architecture:**
 * - Clean functional component structure
 * - Efficient array filtering operations
 * - TypeScript type safety throughout
 * - Reusable statistics pattern
 *
 * **Trading Integration:**
 * - Seamless portfolio analytics integration
 * - Transaction history compatibility
 * - Real-time statistics updates
 * - Professional trading interface styling
 *
 * **Accessibility:**
 * - Clear visual hierarchy
 * - Icon-text associations
 * - Screen reader compatible structure
 * - Logical reading order
 *
 * @param props - Configuration object for transaction statistics display
 * @returns TransactionStats component with formatted trading analytics
 *
 * @example
 * ```tsx
 * // Basic transaction statistics
 * <TransactionStats
 *   transactions={[
 *     { type: "BUY", symbol: "AAPL", quantity: 100, price: 150 },
 *     { type: "SELL", symbol: "GOOGL", quantity: 50, price: 2800 },
 *     { type: "BUY", symbol: "MSFT", quantity: 75, price: 300 }
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with portfolio dashboard
 * function PortfolioDashboard() {
 *   const { data: transactions } = useUserTransactions();
 *
 *   return (
 *     <div className="dashboard-container">
 *       <DashboardHeader />
 *
 *       <TransactionStats
 *         transactions={transactions || []}
 *       />
 *
 *       <TransactionsList transactions={transactions} />
 *       <PortfolioSummary />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Real-time statistics with filtering
 * function TradingAnalytics() {
 *   const { data: allTransactions } = useTransactionHistory();
 *   const [dateRange, setDateRange] = useState("30d");
 *
 *   const filteredTransactions = useMemo(() => {
 *     return filterTransactionsByDateRange(allTransactions, dateRange);
 *   }, [allTransactions, dateRange]);
 *
 *   return (
 *     <div className="analytics-panel">
 *       <DateRangeSelector
 *         value={dateRange}
 *         onChange={setDateRange}
 *       />
 *
 *       <TransactionStats
 *         transactions={filteredTransactions}
 *       />
 *
 *       <TradingChart data={filteredTransactions} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Symbol-specific transaction analysis
 * function SymbolTransactionStats({ symbol }: { symbol: string }) {
 *   const { data: transactions } = useSymbolTransactions(symbol);
 *
 *   const symbolTransactions = transactions?.filter(
 *     (t) => t.symbol === symbol
 *   ) || [];
 *
 *   return (
 *     <div className="symbol-stats">
 *       <h3>Transaction Activity for {symbol}</h3>
 *
 *       <TransactionStats
 *         transactions={symbolTransactions}
 *       />
 *
 *       <SymbolPerformanceChart symbol={symbol} />
 *     </div>
 *   );
 * }
 * ```
 */
export default function TransactionStats({
  transactions,
}: TransactionStatsProps) {
  const totalTransactions = transactions.length;
  const buyOrders = transactions.filter((t) => t.type === "BUY").length;
  const sellOrders = transactions.filter((t) => t.type === "SELL").length;

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
      <div className="flex items-center gap-2">
        <DynamicIcon iconName="receipt" size={14} className="text-blue-500" />
        <span className="text-[var(--text-secondary)]">Total:</span>
        <span className="font-semibold">{totalTransactions}</span>
      </div>

      <div className="flex items-center gap-2">
        <DynamicIcon
          iconName="shoppingcart"
          size={14}
          className="text-emerald-500"
        />
        <span className="text-[var(--text-secondary)]">Buy:</span>
        <span className="font-semibold text-emerald-600">{buyOrders}</span>
      </div>

      <div className="flex items-center gap-2">
        <DynamicIcon
          iconName="dollarsign"
          size={14}
          className="text-rose-500"
        />
        <span className="text-[var(--text-secondary)]">Sell:</span>
        <span className="font-semibold text-rose-600">{sellOrders}</span>
      </div>
    </div>
  );
}
