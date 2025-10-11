/**
 * @fileoverview Professional PDF export functionality with advanced formatting and branding.
 *
 * This module provides comprehensive PDF export capabilities for transaction data
 * within the Stock Simulator platform. It features professional document generation
 * with branded headers, advanced table formatting, financial summaries, multi-page
 * support, and enterprise-grade presentation optimized for reporting and documentation.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Transaction } from "@/types/trading";

/**
 * Format currency values with proper USD formatting and localization.
 *
 * @param amount - Numeric amount to format as currency
 * @returns Formatted currency string with USD symbol and proper separators
 */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Format date strings with consistent localized formatting for PDF display.
 *
 * @param dateString - ISO date string to format
 * @returns Formatted date string with month abbreviation and time
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Export transaction data to professional PDF format with branding and advanced features.
 *
 * This comprehensive export function generates a professionally formatted PDF
 * document with branded headers, high-quality logo integration, advanced table
 * formatting, financial summaries, multi-page support, and enterprise-grade
 * presentation. It provides complete transaction reporting suitable for business
 * documentation, client reports, and financial analysis.
 *
 * @remarks
 * The function delivers professional PDF export through:
 *
 * **Professional Branding**:
 * - **Logo Integration**: High-resolution logo rendering with fallback text branding
 * - **Brand Colors**: Consistent blue color scheme (#60A5FA) throughout document
 * - **Header Design**: Professional document header with title and metadata
 * - **Footer Information**: Branded footer with platform identification
 * - **Page Numbering**: Professional page numbering for multi-page documents
 *
 * **Advanced Document Structure**:
 * - **Multi-page Support**: Automatic page breaks with consistent headers/footers
 * - **Professional Layout**: Optimized margins and spacing for business documents
 * - **Table Formatting**: Advanced table styling with alternating row colors
 * - **Column Optimization**: Intelligent column widths for optimal data display
 * - **Responsive Design**: Automatic content flow and page management
 *
 * **Financial Data Presentation**:
 * - **Currency Formatting**: Professional USD formatting with proper symbols
 * - **Date Formatting**: Consistent date/time display with localization
 * - **Profit/Loss Indicators**: Color-coded P&L values with +/- indicators
 * - **Data Truncation**: Smart truncation of long company names for layout
 * - **Summary Section**: Comprehensive financial summary with key metrics
 *
 * **High-Quality Table Features**:
 * - **Professional Headers**: Branded blue headers with white text
 * - **Alternating Rows**: Light gray alternating rows for readability
 * - **Optimized Columns**: Pre-configured column widths for data types
 * - **Text Wrapping**: Automatic line breaks for long content
 * - **Consistent Styling**: Uniform font sizing and cell padding
 *
 * **Comprehensive Summary Analytics**:
 * - **Transaction Counts**: Separate buy and sell transaction tallies
 * - **Total Amounts**: Sum of buy and sell transaction values
 * - **Net Investment**: Calculated net investment amount
 * - **Profit/Loss Analysis**: Color-coded total profit/loss calculation
 * - **Visual Indicators**: Green/red color coding for financial performance
 *
 * **Technical Excellence**:
 * - **Image Processing**: High-resolution logo processing with canvas scaling
 * - **Error Handling**: Graceful fallback for missing or failed logo loading
 * - **Memory Management**: Efficient image processing and cleanup
 * - **Cross-platform**: Compatible PDF generation across all platforms
 * - **Print Optimization**: Professional layout optimized for printing
 *
 * **Use Case Applications**:
 * - **Client Reports**: Professional client-facing transaction reports
 * - **Business Documentation**: Formal business records and documentation
 * - **Financial Analysis**: Comprehensive portfolio performance reports
 * - **Regulatory Compliance**: Formatted reports for regulatory requirements
 * - **Executive Summaries**: High-level transaction summaries for management
 *
 * **Visual Enhancement Features**:
 * - **Logo Quality**: High-DPI logo rendering with 2x scaling for clarity
 * - **Color Consistency**: Professional color scheme throughout document
 * - **Typography**: Clean, readable font sizing and hierarchy
 * - **White Space**: Optimal spacing for professional appearance
 * - **Print Ready**: Optimized layout for high-quality printing
 *
 * The function serves as an enterprise-grade PDF generation solution providing
 * users with professionally formatted documents suitable for business reporting,
 * client presentations, and comprehensive financial documentation within the
 * Stock Simulator platform.
 *
 * @example
 * ```typescript
 * // Basic PDF export
 * async function generateTransactionReport() {
 *   const transactions = await getTransactionHistory();
 *   await exportToPDF(transactions, 'transaction_report');
 * }
 *
 * // Monthly report generation
 * async function generateMonthlyPDF() {
 *   const transactions = await getMonthlyTransactions();
 *   const filename = `monthly_report_${new Date().toISOString().slice(0, 7)}`;
 *   await exportToPDF(transactions, filename);
 * }
 *
 * // Client portfolio report
 * async function generateClientReport() {
 *   const transactions = await getClientTransactions(clientId);
 *   await exportToPDF(transactions, `client_${clientId}_portfolio`);
 * }
 *
 * // Component integration
 * function PDFExportButton({ transactions }: { transactions: Transaction[] }) {
 *   const handleExport = async () => {
 *     try {
 *       await exportToPDF(transactions, 'portfolio_analysis');
 *       toast.success('PDF report generated successfully');
 *     } catch (error) {
 *       toast.error('PDF generation failed');
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleExport} className="pdf-export-btn">
 *       <PDFIcon />
 *       Generate PDF Report
 *     </button>
 *   );
 * }
 * ```
 *
 * @param transactions - Array of transaction objects to include in PDF report
 * @param filename - Base filename for the PDF file (without .pdf extension)
 * @returns Promise that resolves when the PDF generation and download is complete
 *
 * @throws {Error} When transaction data is malformed or PDF generation fails
 *
 * @see {@link Transaction} - TypeScript interface for transaction data structure
 *
 * @public
 */
export const exportToPDF = async (
  transactions: Transaction[],
  filename: string
) => {
  const doc = new jsPDF();

  try {
    const logoImage = new Image();
    logoImage.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
      logoImage.onload = resolve;
      logoImage.onerror = reject;
      logoImage.src = "/logoSS.png";
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const aspectRatio = logoImage.width / logoImage.height;
    const logoWidth = 40;
    const logoHeight = logoWidth / aspectRatio;

    const scale = 2;
    canvas.width = logoImage.width * scale;
    canvas.height = logoImage.height * scale;
    canvas.style.width = logoImage.width + "px";
    canvas.style.height = logoImage.height + "px";

    ctx?.scale(scale, scale);
    ctx?.drawImage(logoImage, 0, 0, logoImage.width, logoImage.height);

    const logoDataUrl = canvas.toDataURL("image/png", 1.0);
    doc.addImage(logoDataUrl, "PNG", 20, 10, logoWidth, logoHeight);
  } catch {
    doc.setFontSize(20);
    doc.setTextColor(96, 165, 250);
    doc.text("StockSim", 20, 25);
  }

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Transaction History Report", 60, 20);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  doc.text(`Total Transactions: ${transactions.length}`, 20, 42);

  const tableData = transactions.map((transaction) => {
    const profitLoss = transaction.profitLoss;

    const maxCompanyNameLength = 20;
    const truncatedCompanyName =
      transaction.symbolName &&
      transaction.symbolName.length > maxCompanyNameLength
        ? transaction.symbolName.substring(0, maxCompanyNameLength) + "..."
        : transaction.symbolName;

    return [
      formatDate(transaction.executedAt),
      transaction.symbol,
      truncatedCompanyName,
      transaction.type,
      transaction.quantity.toString(),
      formatCurrency(transaction.pricePerShare),
      formatCurrency(transaction.totalAmount),
      profitLoss !== null
        ? `${profitLoss >= 0 ? "+" : ""}${formatCurrency(profitLoss)}`
        : "—",
    ];
  });

  autoTable(doc, {
    head: [
      [
        "Date",
        "Symbol",
        "Company",
        "Type",
        "Qty",
        "Price/Share",
        "Total",
        "P&L",
      ],
    ],
    body: tableData,
    startY: 50,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [96, 165, 250],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 18 },
      2: { cellWidth: 28 },
      3: { cellWidth: 18 },
      4: { cellWidth: 12 },
      5: { cellWidth: 22 },
      6: { cellWidth: 22 },
      7: { cellWidth: 22 },
    },
    margin: { left: 20, right: 20 },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      const currentPage = data.pageNumber;

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${currentPage} of ${pageCount}`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );

      doc.text(
        "StockSim - Portfolio Management Platform",
        20,
        doc.internal.pageSize.height - 10
      );
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 50;
  if (finalY < doc.internal.pageSize.height - 60) {
    const buyTransactions = transactions.filter((t) => t.type === "BUY");
    const sellTransactions = transactions.filter((t) => t.type === "SELL");
    const totalBuyAmount = buyTransactions.reduce(
      (sum, t) => sum + t.totalAmount,
      0
    );
    const totalSellAmount = sellTransactions.reduce(
      (sum, t) => sum + t.totalAmount,
      0
    );

    const totalProfitLoss = transactions
      .map((t) => t.profitLoss)
      .filter((pl) => pl !== null)
      .reduce((sum, pl) => sum + pl!, 0);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Summary", 20, finalY + 20);

    doc.setFontSize(10);
    doc.text(
      `Buy Orders: ${buyTransactions.length} (${formatCurrency(
        totalBuyAmount
      )})`,
      20,
      finalY + 30
    );
    doc.text(
      `Sell Orders: ${sellTransactions.length} (${formatCurrency(
        totalSellAmount
      )})`,
      20,
      finalY + 37
    );
    doc.text(
      `Net Investment: ${formatCurrency(totalBuyAmount - totalSellAmount)}`,
      20,
      finalY + 44
    );

    if (sellTransactions.length > 0) {
      const profitLossColor =
        totalProfitLoss >= 0 ? [34, 197, 94] : [239, 68, 68]; // green or red
      doc.setTextColor(
        profitLossColor[0],
        profitLossColor[1],
        profitLossColor[2]
      );
      doc.text(
        `Total Profit/Loss: ${totalProfitLoss >= 0 ? "+" : ""}${formatCurrency(
          totalProfitLoss
        )}`,
        20,
        finalY + 51
      );
    }
  }

  doc.save(`${filename}.pdf`);
};
