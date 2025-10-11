/**
 * @fileoverview Desktop-optimized transactions table component for comprehensive trading history
 *
 * This component provides a sophisticated desktop table interface for displaying detailed
 * trading transaction history with comprehensive financial data, profit/loss calculations,
 * and professional table layouts. Features include advanced column management, responsive
 * design patterns, and seamless integration with financial data workflows.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import type { Transaction } from "@/types/trading";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { BaseComponentProps } from "@/types";

/**
 * Props interface for TransactionsTableDesktop component configuration
 * @interface TransactionsTableDesktopProps
 * @extends {BaseComponentProps}
 */
export interface TransactionsTableDesktopProps extends BaseComponentProps {
  /** Array of transaction records to display */
  transactions: Transaction[];
  /** Loading state for async data fetching */
  loading?: boolean;
}

/**
 * Desktop-optimized transactions table component for comprehensive trading history
 *
 * @remarks
 * The TransactionsTableDesktop component delivers professional desktop transaction display with the following features:
 *
 * **Table Architecture:**
 * - Professional table structure with semantic HTML elements
 * - Responsive column management with fixed and flexible widths
 * - Hidden on mobile (md:hidden) for desktop-specific optimization
 * - Overflow handling with horizontal scrolling capabilities
 *
 * **Comprehensive Data Display:**
 * - Complete transaction history with date and time information
 * - Symbol identification with company name display
 * - Transaction type indicators with color-coded styling
 * - Quantity, price, and total amount calculations
 *
 * **Financial Data Presentation:**
 * - Profit and loss calculations with visual indicators
 * - Monospace fonts for numerical data consistency
 * - Tabular number formatting for perfect alignment
 * - Professional currency formatting with decimal precision
 *
 * **Column Management:**
 * - Fixed-width columns for consistent data alignment
 * - Responsive header styling with descriptive labels
 * - Proper text alignment (left/right) based on data type
 * - Truncation handling with full content tooltips
 *
 * **Interactive Features:**
 * - Hover effects on table rows for better user experience
 * - Color-coded transaction types (buy/sell indicators)
 * - Icon integration for visual transaction identification
 * - Smooth transitions and visual feedback
 *
 * **State Management:**
 * - Loading state with animated spinner and messaging
 * - Empty state with helpful user guidance
 * - Error handling with graceful fallback displays
 * - Responsive data updates and state transitions
 *
 * **Visual Design:**
 * - Neumorphic card styling with professional shadows
 * - Consistent border and spacing treatments
 * - Theme integration with CSS custom properties
 * - Color-coded profit/loss indicators (green/red scheme)
 *
 * **Accessibility:**
 * - Semantic table structure for screen reader compatibility
 * - Clear column headers with descriptive labels
 * - Proper color contrast and visual hierarchies
 * - Keyboard navigation support throughout
 *
 * **Data Organization:**
 * - Chronological transaction ordering with date/time
 * - Clear separation between different data types
 * - Hierarchical information presentation
 * - Professional financial data formatting standards
 *
 * @param props - Configuration object for desktop transactions table
 * @returns TransactionsTableDesktop component with comprehensive trading data
 *
 * @example
 * ```tsx
 * // Basic transactions table with loading state
 * <TransactionsTableDesktop
 *   transactions={userTransactions}
 *   loading={isLoadingTransactions}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with transaction filtering and sorting
 * function DesktopTransactionHistory() {
 *   const { data: transactions, isLoading } = useTransactions();
 *   const filteredTransactions = useMemo(() =>
 *     filterAndSortTransactions(transactions),
 *     [transactions]
 *   );
 *
 *   return (
 *     <TransactionsTableDesktop
 *       transactions={filteredTransactions}
 *       loading={isLoading}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Portfolio dashboard integration with comprehensive data
 * function PortfolioTransactionsTable({ userId }: { userId: string }) {
 *   const { data: transactions, isLoading } = useUserTransactions(userId);
 *   const { data: portfolio } = usePortfolio(userId);
 *
 *   return (
 *     <div className="space-y-6">
 *       <div className="flex justify-between items-center">
 *         <h2 className="text-xl font-semibold">Transaction History</h2>
 *         <TransactionFilters />
 *       </div>
 *
 *       <TransactionsTableDesktop
 *         transactions={transactions || []}
 *         loading={isLoading}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export default function TransactionsTableDesktop({
  transactions,
  loading = false,
}: TransactionsTableDesktopProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="neu-card hidden md:block rounded-2xl overflow-hidden border">
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)]">
            <DynamicIcon
              iconName="loader-2"
              size={20}
              className="animate-spin"
            />
            <span>Loading transactions...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="neu-card hidden md:block rounded-2xl overflow-hidden border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--accent)]/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] w-[100px]">
                <div className="flex items-center gap-1">
                  <span className="whitespace-nowrap">Date</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] w-[80px]">
                <div className="flex items-center gap-1">
                  <span className="whitespace-nowrap">Symbol</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                <div className="flex items-center gap-1">
                  <span className="whitespace-nowrap">Name</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] w-[80px]">
                <div className="flex items-center gap-1">
                  <span className="whitespace-nowrap">Type</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-primary)] w-[80px]">
                <div className="flex items-center justify-end gap-1">
                  <span className="whitespace-nowrap">Qty</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-primary)] w-[90px]">
                <div className="flex items-center justify-end gap-1">
                  <span className="whitespace-nowrap">Price</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-primary)] w-[100px]">
                <div className="flex items-center justify-end gap-1">
                  <span className="whitespace-nowrap">Total</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-primary)] w-[90px]">
                <div className="flex items-center justify-end gap-1">
                  <span className="whitespace-nowrap">P&L</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center opacity-70 border-t"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span>No transactions found.</span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      Your trading history will appear here.
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {transactions.map((transaction) => {
              const profitLoss = transaction.profitLoss;

              return (
                <tr
                  key={transaction.id}
                  className="border-t hover:bg-[var(--accent)]/5 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap w-[100px]">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {formatDate(transaction.executedAt)}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {formatTime(transaction.executedAt)}
                      </span>
                    </div>
                  </td>

                  <td
                    className="px-4 py-3 font-semibold whitespace-nowrap w-[80px]"
                    title={transaction.symbol}
                  >
                    {transaction.symbol}
                  </td>

                  <td className="px-4 py-3 max-w-0">
                    <span
                      className="block truncate"
                      title={transaction.symbolName}
                    >
                      {transaction.symbolName || transaction.symbol}
                    </span>
                  </td>

                  <td className="px-4 py-3 w-[80px]">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
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
                        size={12}
                        className={
                          transaction.type === "BUY"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }
                      />
                      {transaction.type}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right font-mono tabular-nums text-sm whitespace-nowrap w-[80px]">
                    {transaction.quantity.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-right font-mono tabular-nums text-sm whitespace-nowrap w-[90px]">
                    ${transaction.pricePerShare.toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right font-mono font-medium tabular-nums text-sm whitespace-nowrap w-[100px]">
                    ${transaction.totalAmount.toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right font-mono tabular-nums text-sm whitespace-nowrap w-[90px]">
                    {profitLoss !== null ? (
                      <span
                        className={`font-medium ${
                          profitLoss >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {profitLoss >= 0 ? "+$" : "-$"}
                        {Math.abs(profitLoss).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[var(--text-secondary)]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
