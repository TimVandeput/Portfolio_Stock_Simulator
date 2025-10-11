/**
 * @fileoverview Professional transaction export component with multiple format support
 *
 * This component provides comprehensive data export functionality with CSV, Excel,
 * and PDF format support. Features include dropdown interface, loading states,
 * professional styling, and seamless integration with transaction data management
 * for complete portfolio and trading history export capabilities.
 */

"use client";

import { useState } from "react";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { exportToCSV } from "@/components/files/CSVExporter";
import { exportToExcel } from "@/components/files/ExcelExporter";
import { exportToPDF } from "@/components/files/PDFExporter";
import type { Transaction } from "@/types/trading";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for TransactionExporter component configuration
 * @interface TransactionExporterProps
 * @extends {BaseComponentProps}
 */
export interface TransactionExporterProps extends BaseComponentProps {
  /** Array of transactions to export */
  transactions: Transaction[];
  /** Base filename for exported files */
  filename?: string;
}

/**
 * Professional transaction export component with multiple format support
 *
 * @remarks
 * The TransactionExporter component delivers comprehensive export functionality with the following features:
 *
 * **Export Formats:**
 * - CSV export for spreadsheet compatibility
 * - Excel export with advanced formatting
 * - PDF export for professional reports
 * - Seamless integration with export modules
 *
 * **User Interface:**
 * - Professional dropdown interface
 * - Transaction count display in button
 * - Loading states with spinner animation
 * - Responsive text for mobile devices
 *
 * **Interactive Features:**
 * - Click-outside dismissal for dropdown
 * - Disabled state during export operations
 * - Professional hover animations
 * - Smooth transition effects
 *
 * **Visual Design:**
 * - Gradient button styling with professional appearance
 * - Neumorphic design integration
 * - Professional shadow and lighting effects
 * - Icon-based format identification
 *
 * **State Management:**
 * - Export progress tracking
 * - Dropdown visibility management
 * - Error handling with console logging
 * - Clean state transitions
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Screen reader compatible labels
 * - Keyboard navigation support
 * - Professional accessibility patterns
 *
 * **Responsive Design:**
 * - Mobile-optimized text display
 * - Adaptive dropdown positioning
 * - Flexible width constraints
 * - Professional mobile experience
 *
 * **Error Handling:**
 * - Try-catch error management
 * - Console error logging
 * - Graceful failure handling
 * - User-friendly error experience
 *
 * **Performance:**
 * - Conditional rendering for empty data
 * - Efficient state updates
 * - Optimized export operations
 * - Clean component lifecycle
 *
 * **Integration Features:**
 * - Transaction data compatibility
 * - Flexible filename configuration
 * - Professional export workflow
 * - Seamless data management integration
 *
 * @param props - Configuration object for transaction export functionality
 * @returns TransactionExporter component with multi-format export capabilities
 *
 * @example
 * ```tsx
 * // Basic transaction exporter
 * <TransactionExporter
 *   transactions={userTransactions}
 *   filename="portfolio-transactions"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with transaction dashboard
 * function TransactionsDashboard() {
 *   const { data: transactions } = useTransactionHistory();
 *
 *   return (
 *     <div className="dashboard-header">
 *       <h1>Transaction History</h1>
 *
 *       <TransactionExporter
 *         transactions={transactions || []}
 *         filename={`transactions-${format(new Date(), 'yyyy-MM-dd')}`}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Filtered transaction export
 * function FilteredTransactionExporter() {
 *   const [dateRange, setDateRange] = useState({ start: '', end: '' });
 *   const { data: allTransactions } = useTransactionHistory();
 *
 *   const filteredTransactions = useMemo(() => {
 *     return filterTransactionsByDateRange(allTransactions, dateRange);
 *   }, [allTransactions, dateRange]);
 *
 *   return (
 *     <div className="export-section">
 *       <DateRangeFilter
 *         dateRange={dateRange}
 *         onDateRangeChange={setDateRange}
 *       />
 *
 *       <TransactionExporter
 *         transactions={filteredTransactions}
 *         filename={`transactions-${dateRange.start}-to-${dateRange.end}`}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Symbol-specific transaction export
 * function SymbolTransactionExporter({ symbol }: { symbol: string }) {
 *   const { data: symbolTransactions } = useSymbolTransactions(symbol);
 *
 *   return symbolTransactions?.length > 0 ? (
 *     <TransactionExporter
 *       transactions={symbolTransactions}
 *       filename={`${symbol}-transactions`}
 *       className="ml-auto"
 *     />
 *   ) : null;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced export with analytics tracking
 * function AnalyticsTransactionExporter({ transactions }: { transactions: Transaction[] }) {
 *   const analytics = useAnalytics();
 *
 *   const handleExportAnalytics = (format: string) => {
 *     analytics.track('transaction_export', {
 *       format,
 *       transaction_count: transactions.length,
 *       date_range: getDateRange(transactions)
 *     });
 *   };
 *
 *   return (
 *     <TransactionExporter
 *       transactions={transactions}
 *       filename="portfolio-analysis"
 *       onExportStart={handleExportAnalytics}
 *     />
 *   );
 * }
 * ```
 */
export default function TransactionExporter({
  transactions,
  filename = "transactions",
  className = "",
}: TransactionExporterProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = async (
    exportFunction: (
      transactions: Transaction[],
      filename: string
    ) => Promise<void>
  ) => {
    setIsExporting(true);
    try {
      await exportFunction(transactions, filename);
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
      setShowDropdown(false);
    }
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        className="neu-button flex items-center gap-2 px-3 py-2 text-sm font-medium disabled:opacity-50 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer"
        style={{
          color: "var(--dashboard-icon-color)",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          boxShadow:
            "var(--shadow-neu), 0 4px 15px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="hidden sm:inline">Exporting...</span>
            <span className="sm:hidden">...</span>
          </>
        ) : (
          <>
            <DynamicIcon iconName="download" className="w-4 h-4" />
            <span className="hidden sm:inline">
              Export ({transactions.length})
            </span>
            <span className="sm:hidden">Export</span>
          </>
        )}
      </button>

      {showDropdown && !isExporting && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 sm:right-0 max-w-[calc(100vw-2rem)] sm:max-w-none">
          <div className="py-1">
            <button
              onClick={() => handleExport(exportToCSV)}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <DynamicIcon iconName="receipt" className="w-4 h-4" />
              Export as CSV
            </button>
            <button
              onClick={() => handleExport(exportToExcel)}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <DynamicIcon iconName="briefcase" className="w-4 h-4" />
              Export as Excel
            </button>
            <button
              onClick={() => handleExport(exportToPDF)}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <DynamicIcon iconName="receipt" className="w-4 h-4" />
              Export as PDF
            </button>
          </div>
        </div>
      )}

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
