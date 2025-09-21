"use client";

import { useState } from "react";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { exportToCSV } from "@/components/files/CSVExporter";
import { exportToExcel } from "@/components/files/ExcelExporter";
import { exportToPDF } from "@/components/files/PDFExporter";
import type { Transaction } from "@/types/trading";
import type { TransactionExporterProps } from "@/types/components";

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
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-[var(--export-btn)] hover:opacity-80 disabled:opacity-50 rounded-lg transition-all duration-200 shadow-sm whitespace-nowrap"
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
