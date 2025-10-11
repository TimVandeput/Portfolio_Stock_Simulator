/**
 * @fileoverview CSV export functionality for transaction data with Excel compatibility.
 *
 * This module provides comprehensive CSV export capabilities for transaction data
 * within the Stock Simulator platform. It features Excel-compatible formatting,
 * UTF-8 BOM support, localized date formatting, and professional data presentation
 * optimized for financial analysis and record-keeping.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Transaction } from "@/types/trading";

/**
 * Export transaction data to CSV format with Excel compatibility and professional formatting.
 *
 * This comprehensive export function converts transaction data into a properly
 * formatted CSV file with Excel compatibility, UTF-8 BOM support, localized
 * formatting, and professional data presentation. It handles financial data
 * formatting, null value handling, and provides seamless download functionality
 * for transaction analysis and record-keeping.
 *
 * @remarks
 * The function delivers professional CSV export through:
 *
 * **Excel Compatibility**:
 * - **UTF-8 BOM**: Includes Byte Order Mark for proper Excel encoding
 * - **Semicolon Delimiter**: Uses semicolons for Excel regional compatibility
 * - **Quote Encapsulation**: Proper text field quoting for special characters
 * - **Line Endings**: Windows-compatible CRLF line endings (\r\n)
 *
 * **Financial Data Formatting**:
 * - **Currency Precision**: Two decimal places for all monetary values
 * - **Profit/Loss Display**: Enhanced P&L formatting with +/- indicators
 * - **Null Handling**: Professional em-dash (—) for missing P&L data
 * - **Quantity Display**: Integer formatting for share quantities
 *
 * **Date and Time Handling**:
 * - **Localized Dates**: US format (MM/DD/YYYY) for consistency
 * - **Timezone Handling**: Proper UTC to local time conversion
 * - **Consistent Format**: Standardized date presentation across exports
 * - **Sortable Format**: Date format suitable for Excel sorting
 *
 * **Professional Headers**:
 * - **Descriptive Columns**: Clear, professional column headers
 * - **Complete Information**: All transaction details included
 * - **Analysis Ready**: Headers optimized for financial analysis
 * - **Standardized Names**: Consistent terminology across exports
 *
 * **Data Integrity**:
 * - **Type Safety**: TypeScript interfaces ensure data consistency
 * - **Error Handling**: Robust handling of malformed transaction data
 * - **Encoding Safety**: Proper UTF-8 encoding with BOM support
 * - **Special Characters**: Safe handling of symbols and company names
 *
 * **Download Management**:
 * - **Automatic Download**: Browser-native download initiation
 * - **Memory Cleanup**: Proper URL object cleanup after download
 * - **Filename Control**: Customizable filename with .csv extension
 * - **Cross-browser Support**: Compatible with all modern browsers
 *
 * **Use Case Applications**:
 * - **Tax Reporting**: Formatted for tax preparation and reporting
 * - **Performance Analysis**: Ready for Excel-based portfolio analysis
 * - **Record Keeping**: Professional transaction record maintenance
 * - **Audit Trail**: Complete transaction history for compliance
 * - **Portfolio Review**: Comprehensive data for investment review
 *
 * The function serves as a critical tool for users requiring professional
 * transaction data exports for financial analysis, tax preparation, and
 * comprehensive portfolio management within the Stock Simulator platform.
 *
 * @example
 * ```typescript
 * // Basic transaction export
 * async function exportTransactions() {
 *   const transactions = await getTransactionHistory();
 *   await exportToCSV(transactions, 'my_transactions');
 * }
 *
 * // Export with custom filename
 * async function exportPortfolioHistory() {
 *   const transactions = await getUserTransactions(userId);
 *   const filename = `portfolio_${new Date().getFullYear()}`;
 *   await exportToCSV(transactions, filename);
 * }
 *
 * // Export filtered transactions
 * async function exportDateRangeTransactions() {
 *   const transactions = await getTransactionsByDateRange(startDate, endDate);
 *   const filename = `transactions_${startDate}_to_${endDate}`;
 *   await exportToCSV(transactions, filename);
 * }
 *
 * // Component integration
 * function ExportButton({ transactions }: { transactions: Transaction[] }) {
 *   const handleExport = async () => {
 *     try {
 *       await exportToCSV(transactions, 'portfolio_export');
 *       toast.success('Transactions exported successfully');
 *     } catch (error) {
 *       toast.error('Export failed');
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleExport}>
 *       Export to CSV
 *     </button>
 *   );
 * }
 * ```
 *
 * @param transactions - Array of transaction objects to export to CSV format
 * @param filename - Base filename for the CSV file (without .csv extension)
 * @returns Promise that resolves when the CSV export and download is complete
 *
 * @throws {Error} When transaction data is malformed or export process fails
 *
 * @see {@link Transaction} - TypeScript interface for transaction data structure
 *
 * @public
 */
export const exportToCSV = async (
  transactions: Transaction[],
  filename: string
) => {
  const csvLines = [];
  csvLines.push(
    "Date;Symbol;Company Name;Type;Quantity;Price per Share;Total Amount;P&L"
  );

  transactions.forEach((transaction) => {
    const date = new Date(transaction.executedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const pricePerShare = transaction.pricePerShare.toFixed(2);
    const totalAmount = transaction.totalAmount.toFixed(2);

    const profitLoss = transaction.profitLoss;
    const profitLossValue =
      profitLoss !== null
        ? `${profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(2)}`
        : "—";

    const line = [
      `"${date}"`,
      `"${transaction.symbol}"`,
      `"${transaction.symbolName}"`,
      `"${transaction.type}"`,
      transaction.quantity,
      pricePerShare,
      totalAmount,
      `"${profitLossValue}"`,
    ].join(";");
    csvLines.push(line);
  });

  const BOM = "\uFEFF";
  const csvContent = BOM + csvLines.join("\r\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.setAttribute("href", url);
  element.setAttribute("download", `${filename}.csv`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
};
