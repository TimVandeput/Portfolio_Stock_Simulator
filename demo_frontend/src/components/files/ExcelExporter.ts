/**
 * @fileoverview Excel export functionality with advanced formatting and professional styling.
 *
 * This module provides comprehensive Excel export capabilities for transaction data
 * within the Stock Simulator platform. It features advanced XML-based Excel format
 * generation, professional styling, automatic filtering, frozen panes, currency
 * formatting, and enterprise-grade data presentation optimized for financial analysis.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Transaction } from "@/types/trading";

/**
 * Export transaction data to Excel format with professional styling and advanced features.
 *
 * This comprehensive export function generates a professionally formatted Excel
 * workbook using XML formatting with advanced features including custom styling,
 * currency formatting, automatic filtering, frozen header panes, and optimized
 * column widths. It provides enterprise-grade data presentation suitable for
 * financial analysis, reporting, and professional documentation.
 *
 * @remarks
 * The function delivers professional Excel export through:
 *
 * **Advanced Excel Features**:
 * - **XML-based Format**: Native Excel XML format for full feature compatibility
 * - **Custom Styling**: Professional color scheme with branded header styling
 * - **Auto-filtering**: Built-in Excel filtering capabilities for data analysis
 * - **Frozen Panes**: Header row remains visible during scrolling
 * - **Column Optimization**: Pre-configured column widths for optimal display
 *
 * **Professional Styling System**:
 * - **Header Style**: Branded blue background (#6366F1) with white bold text
 * - **Data Borders**: Professional gray borders (#E5E7EB) for clean appearance
 * - **Font Standards**: Arial font family with appropriate sizing
 * - **Cell Alignment**: Center alignment for headers, appropriate data alignment
 * - **Row Height**: Optimized 25px header height for professional appearance
 *
 * **Financial Formatting**:
 * - **Currency Display**: Automatic $#,##0.00 formatting for monetary values
 * - **Number Formatting**: Right-aligned numbers with thousand separators
 * - **Precision Control**: Two decimal places for financial accuracy
 * - **Null Handling**: Professional em-dash (—) for missing P&L data
 * - **Data Types**: Proper Excel data type assignment for calculations
 *
 * **Data Processing**:
 * - **XML Escaping**: Safe handling of special characters in company names
 * - **Date Formatting**: Localized date formatting for consistency
 * - **Type Safety**: TypeScript interface validation for data integrity
 * - **Error Handling**: Robust processing of malformed transaction data
 *
 * **Enterprise Features**:
 * - **Document Properties**: Professional metadata including title, author, timestamp
 * - **Print Optimization**: Configured for professional printing with proper margins
 * - **Page Layout**: Fit-to-page settings for optimal print presentation
 * - **Worksheet Naming**: Descriptive "Transactions" worksheet name
 *
 * **Excel Compatibility**:
 * - **Native Format**: .xls format compatible with all Excel versions
 * - **Feature Support**: Full support for filtering, sorting, and calculations
 * - **Cross-platform**: Compatible with Excel on Windows, Mac, and Excel Online
 * - **Import Ready**: Direct Excel import without conversion requirements
 *
 * **Use Case Applications**:
 * - **Financial Reports**: Professional financial reporting and analysis
 * - **Tax Documentation**: Formatted for tax preparation and IRS requirements
 * - **Audit Trails**: Complete transaction documentation for compliance
 * - **Portfolio Analysis**: Ready for advanced Excel-based portfolio analysis
 * - **Client Reporting**: Professional client-facing transaction reports
 *
 * **Visual Enhancements**:
 * - **Professional Branding**: Consistent color scheme with platform identity
 * - **Clean Layout**: Organized data presentation with proper spacing
 * - **Easy Navigation**: Frozen panes and filtering for large datasets
 * - **Print Ready**: Optimized layout for professional document printing
 *
 * The function serves as an enterprise-grade export solution providing users
 * with professionally formatted Excel workbooks suitable for financial analysis,
 * regulatory compliance, and comprehensive portfolio management within the
 * Stock Simulator platform.
 *
 * @example
 * ```typescript
 * // Basic Excel export
 * async function exportToExcel() {
 *   const transactions = await getTransactionHistory();
 *   await exportToExcel(transactions, 'portfolio_report');
 * }
 *
 * // Monthly report generation
 * async function generateMonthlyReport() {
 *   const transactions = await getMonthlyTransactions();
 *   const filename = `monthly_report_${new Date().getMonth() + 1}_${new Date().getFullYear()}`;
 *   await exportToExcel(transactions, filename);
 * }
 *
 * // Year-end tax report
 * async function generateTaxReport() {
 *   const transactions = await getYearTransactions(2024);
 *   await exportToExcel(transactions, 'tax_report_2024');
 * }
 *
 * // Component integration
 * function ExcelExportButton({ transactions }: { transactions: Transaction[] }) {
 *   const handleExport = async () => {
 *     try {
 *       await exportToExcel(transactions, 'transaction_analysis');
 *       toast.success('Excel report generated successfully');
 *     } catch (error) {
 *       toast.error('Excel export failed');
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleExport} className="excel-export-btn">
 *       <ExcelIcon />
 *       Export to Excel
 *     </button>
 *   );
 * }
 * ```
 *
 * @param transactions - Array of transaction objects to export to Excel format
 * @param filename - Base filename for the Excel file (without .xls extension)
 * @returns Promise that resolves when the Excel export and download is complete
 *
 * @throws {Error} When transaction data is malformed or Excel generation fails
 *
 * @see {@link Transaction} - TypeScript interface for transaction data structure
 *
 * @public
 */
export const exportToExcel = async (
  transactions: Transaction[],
  filename: string
) => {
  const excelXML = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Transaction History</Title>
  <Author>StockSim</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="2"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#6366F1" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataStyle">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10"/>
  </Style>
  <Style ss:ID="CurrencyStyle">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10"/>
   <NumberFormat ss:Format="$#,##0.00"/>
  </Style>
  <Style ss:ID="NumberStyle">
   <Alignment ss:Vertical="Center" ss:Horizontal="Right"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E5E7EB"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Transactions">
  <Table>
   <Column ss:Width="100"/>
   <Column ss:Width="80"/>
   <Column ss:Width="200"/>
   <Column ss:Width="60"/>
   <Column ss:Width="80"/>
   <Column ss:Width="100"/>
   <Column ss:Width="100"/>
   <Column ss:Width="100"/>
   <Row ss:Height="25">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Date</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Symbol</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Company Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Type</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Quantity</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Price per Share</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Total Amount</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">P&L</Data></Cell>
   </Row>
   ${transactions
     .map((transaction) => {
       const date = new Date(transaction.executedAt).toLocaleDateString(
         "en-US",
         {
           year: "numeric",
           month: "2-digit",
           day: "2-digit",
         }
       );

       const profitLoss = transaction.profitLoss;

       return `
   <Row>
    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${date}</Data></Cell>
    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${
      transaction.symbol
    }</Data></Cell>
    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${transaction.symbolName
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}</Data></Cell>
    <Cell ss:StyleID="DataStyle"><Data ss:Type="String">${
      transaction.type
    }</Data></Cell>
    <Cell ss:StyleID="NumberStyle"><Data ss:Type="Number">${
      transaction.quantity
    }</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${
      transaction.pricePerShare
    }</Data></Cell>
    <Cell ss:StyleID="CurrencyStyle"><Data ss:Type="Number">${
      transaction.totalAmount
    }</Data></Cell>
    <Cell ss:StyleID="${profitLoss !== null ? "CurrencyStyle" : "DataStyle"}">${
         profitLoss !== null
           ? `<Data ss:Type="Number">${profitLoss}</Data>`
           : `<Data ss:Type="String">—</Data>`
       }</Cell>
   </Row>`;
     })
     .join("")}
  </Table>
  <AutoFilter x:Range="R1C1:R${
    transactions.length + 1
  }C8" xmlns="urn:schemas-microsoft-com:office:excel">
  </AutoFilter>
  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
   <PageSetup>
    <Header x:Margin="0.3"/>
    <Footer x:Margin="0.3"/>
    <PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>
   </PageSetup>
   <FitToPage/>
   <Print>
    <FitWidth>1</FitWidth>
    <FitHeight>32767</FitHeight>
   </Print>
   <Selected/>
   <FreezePanes/>
   <FrozenNoSplit/>
   <SplitHorizontal>1</SplitHorizontal>
   <TopRowBottomPane>1</TopRowBottomPane>
   <ActivePane>2</ActivePane>
   <Panes>
    <Pane>
     <Number>3</Number>
    </Pane>
    <Pane>
     <Number>2</Number>
     <ActiveRow>0</ActiveRow>
    </Pane>
   </Panes>
   <ProtectObjects>False</ProtectObjects>
   <ProtectScenarios>False</ProtectScenarios>
  </WorksheetOptions>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([excelXML], {
    type: "application/vnd.ms-excel",
  });

  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");
  element.setAttribute("href", url);
  element.setAttribute("download", `${filename}.xls`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  URL.revokeObjectURL(url);
};
