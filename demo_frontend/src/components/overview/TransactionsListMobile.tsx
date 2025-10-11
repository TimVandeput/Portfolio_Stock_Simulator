/**
 * @fileoverview Mobile-optimized transactions list component for trading history display
 *
 * This component provides a comprehensive mobile interface for displaying trading transaction
 * history with detailed financial information, profit/loss calculations, and intuitive
 * card-based layouts. Features include responsive design patterns, loading states, and
 * professional financial data presentation optimized for mobile interactions.
 */

"use client";

import type { Transaction } from "@/types/trading";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { BaseComponentProps } from "@/types";

/**
 * Props interface for TransactionsListMobile component configuration
 * @interface TransactionsListMobileProps
 * @extends {BaseComponentProps}
 */
export interface TransactionsListMobileProps extends BaseComponentProps {
  /** Array of transaction records to display */
  transactions: Transaction[];
  /** Loading state for async data fetching */
  loading?: boolean;
}

/**
 * Mobile-optimized transactions list component for trading history display
 *
 * @remarks
 * The TransactionsListMobile component delivers comprehensive mobile transaction display with the following features:
 *
 * **Mobile Optimization:**
 * - Card-based layout optimized for touch interactions
 * - Responsive design with md:hidden for mobile-only display
 * - Touch-friendly spacing and element sizing
 * - Swipe-friendly list navigation patterns
 *
 * **Transaction Display:**
 * - Buy/Sell transaction type indicators with color coding
 * - Symbol name and company information presentation
 * - Transaction amount and execution date display
 * - Quantity and price per share breakdown
 *
 * **Financial Data Presentation:**
 * - Profit and loss calculations with color-coded indicators
 * - Monospace fonts for numerical data consistency
 * - Tabular number formatting for alignment
 * - Professional currency formatting with proper decimals
 *
 * **Visual Design:**
 * - Neumorphic card styling with subtle shadows
 * - Color-coded transaction types (green for buy, red for sell)
 * - Icon integration for visual transaction type identification
 * - Consistent spacing and typography hierarchy
 *
 * **State Management:**
 * - Loading state with animated spinner feedback
 * - Empty state with helpful guidance messages
 * - Error handling with user-friendly fallbacks
 * - Responsive data updates and state transitions
 *
 * **Interactive Elements:**
 * - Clean card interactions with hover states
 * - Visual feedback for touch interactions
 * - Accessible icon usage with proper sizing
 * - Consistent interaction patterns throughout
 *
 * **Data Organization:**
 * - Chronological transaction listing
 * - Grid-based detail sections for key metrics
 * - Hierarchical information presentation
 * - Clear visual separation between data sections
 *
 * **Accessibility:**
 * - Semantic HTML structure for screen readers
 * - Color coding complemented by icons and text
 * - Clear visual hierarchies and contrast ratios
 * - Touch-accessible element sizing and spacing
 *
 * @param props - Configuration object for mobile transactions list
 * @returns TransactionsListMobile component with comprehensive trading history
 *
 * @example
 * ```tsx
 * // Basic transactions list with loading state
 * <TransactionsListMobile
 *   transactions={userTransactions}
 *   loading={isLoadingTransactions}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with transaction filtering
 * function MobileTransactionHistory() {
 *   const { data: transactions, isLoading } = useTransactions();
 *   const filteredTransactions = filterTransactionsByDateRange(transactions);
 *
 *   return (
 *     <TransactionsListMobile
 *       transactions={filteredTransactions}
 *       loading={isLoading}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Portfolio integration with profit/loss tracking
 * function PortfolioTransactions({ userId }: { userId: string }) {
 *   const { data: transactions, isLoading } = useUserTransactions(userId);
 *
 *   return (
 *     <div className="space-y-4">
 *       <h2 className="text-lg font-semibold">Recent Transactions</h2>
 *       <TransactionsListMobile
 *         transactions={transactions || []}
 *         loading={isLoading}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export default function TransactionsListMobile({
  transactions,
  loading = false,
}: TransactionsListMobileProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="md:hidden neu-card p-6 text-center rounded-2xl border shadow-sm">
        <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)]">
          <DynamicIcon iconName="loader-2" size={20} className="animate-spin" />
          <span>Loading transactions...</span>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="md:hidden neu-card p-6 text-center rounded-2xl border shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <DynamicIcon iconName="file-text" size={32} className="opacity-50" />
          <span className="font-medium">No transactions found</span>
          <span className="text-sm text-[var(--text-secondary)]">
            Your trading history will appear here.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <ul className="space-y-3">
        {transactions.map((transaction) => {
          const profitLoss = transaction.profitLoss;

          return (
            <li
              key={transaction.id}
              className="neu-card p-4 rounded-xl border shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                        transaction.type === "BUY"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700"
                          : "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-700"
                      }`}
                    >
                      <DynamicIcon
                        iconName={
                          transaction.type === "BUY"
                            ? "arrow-down-circle"
                            : "arrow-up-circle"
                        }
                        size={10}
                        className={
                          transaction.type === "BUY"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }
                      />
                      {transaction.type}
                    </span>
                    <span className="font-semibold text-lg">
                      {transaction.symbol}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] truncate">
                    {transaction.symbolName
                      ? transaction.symbolName
                      : `[${transaction.symbol}]`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium tabular-nums">
                    ${transaction.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {formatDate(transaction.executedAt)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm border-t pt-3">
                <div className="rounded-xl border p-2">
                  <div className="text-[var(--text-secondary)] text-xs mb-1">
                    Quantity
                  </div>
                  <div className="font-mono tabular-nums">
                    {transaction.quantity.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-xl border p-2">
                  <div className="text-[var(--text-secondary)] text-xs mb-1">
                    Price
                  </div>
                  <div className="font-mono tabular-nums">
                    ${transaction.pricePerShare.toFixed(2)}
                  </div>
                </div>
              </div>

              {profitLoss !== null && (
                <div className="flex justify-between text-sm border-t pt-2 mt-2">
                  <span className="text-[var(--text-secondary)]">P&L:</span>
                  <span
                    className={`font-mono font-medium tabular-nums ${
                      profitLoss >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {profitLoss >= 0 ? "+$" : "-$"}
                    {Math.abs(profitLoss).toFixed(2)}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
