/**
 * @fileoverview Symbols metadata display component for data import tracking and statistics
 *
 * This component provides comprehensive metadata display for symbol import operations,
 * featuring import timestamps, operation summaries, and statistical breakdowns.
 * Includes responsive design, professional formatting, and seamless integration
 * with administrative interfaces and data management workflows.
 */

"use client";

import type { ImportSummaryDTO } from "@/types/symbol";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for SymbolsMeta component configuration
 * @interface SymbolsMetaProps
 * @extends {BaseComponentProps}
 */
export interface SymbolsMetaProps extends BaseComponentProps {
  /** Timestamp of the last symbol import operation */
  lastImportedAt: string | null;
  /** Summary statistics from the last import operation */
  lastSummary: ImportSummaryDTO | null;
}

/**
 * Symbols metadata display component for data import tracking and statistics
 *
 * @remarks
 * The SymbolsMeta component delivers comprehensive import metadata display with the following features:
 *
 * **Import Tracking:**
 * - Last import timestamp with locale-specific formatting
 * - Fallback display for systems without import history
 * - Professional date/time presentation
 * - Clear temporal context for data freshness
 *
 * **Statistical Summary:**
 * - Imported symbols count with positive indicator
 * - Updated symbols count for existing records
 * - Skipped symbols count for unchanged data
 * - Compact numerical presentation
 *
 * **Responsive Design:**
 * - Mobile-first column layout for narrow screens
 * - Desktop row layout with proper spacing
 * - Flexible wrapping for content overflow
 * - Consistent gap spacing across breakpoints
 *
 * **Visual Hierarchy:**
 * - Subtle opacity for metadata context
 * - Responsive text sizing (xs to sm)
 * - Clear label-value associations
 * - Professional administrative styling
 *
 * **Data Display:**
 * - Conditional summary rendering based on availability
 * - Abbreviations for compact presentation (upd, skip)
 * - Logical information grouping
 * - Clear statistical formatting
 *
 * **Administrative Integration:**
 * - Seamless integration with admin panels
 * - Data management workflow support
 * - Import operation monitoring
 * - System status indication
 *
 * **Typography:**
 * - Small text sizes for metadata context
 * - Consistent line height and spacing
 * - Professional administrative styling
 * - Clear readability across devices
 *
 * **Layout Structure:**
 * - Flexible container with margin bottom
 * - Responsive flex direction changes
 * - Proper gap spacing for readability
 * - Clean visual separation
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Clear content hierarchy
 * - Screen reader compatible formatting
 * - Logical reading order
 *
 * **Date Handling:**
 * - Null-safe timestamp processing
 * - Locale-aware date formatting
 * - Fallback messaging for missing data
 * - Professional temporal display
 *
 * @param props - Configuration object for symbols metadata display
 * @returns SymbolsMeta component with formatted import statistics
 *
 * @example
 * ```tsx
 * // Complete metadata display
 * <SymbolsMeta
 *   lastImportedAt="2024-01-15T10:30:00Z"
 *   lastSummary={{
 *     imported: 150,
 *     updated: 45,
 *     skipped: 12
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // First-time import scenario
 * <SymbolsMeta
 *   lastImportedAt={null}
 *   lastSummary={null}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with admin panel
 * function SymbolsAdminPanel() {
 *   const { data: importMeta } = useImportMetadata();
 *
 *   return (
 *     <div className="admin-panel">
 *       <PageHeader title="Symbols Management" />
 *
 *       <SymbolsMeta
 *         lastImportedAt={importMeta?.lastImportedAt}
 *         lastSummary={importMeta?.lastSummary}
 *       />
 *
 *       <ImportControls />
 *       <SymbolsTable />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Real-time update integration
 * function SymbolsManager() {
 *   const [importStatus, setImportStatus] = useState<{
 *     timestamp: string | null;
 *     summary: ImportSummaryDTO | null;
 *   }>({ timestamp: null, summary: null });
 *
 *   const handleImportComplete = (result: ImportResult) => {
 *     setImportStatus({
 *       timestamp: new Date().toISOString(),
 *       summary: {
 *         imported: result.newSymbols,
 *         updated: result.updatedSymbols,
 *         skipped: result.skippedSymbols
 *       }
 *     });
 *   };
 *
 *   return (
 *     <div className="space-y-6">
 *       <SymbolsMeta
 *         lastImportedAt={importStatus.timestamp}
 *         lastSummary={importStatus.summary}
 *       />
 *
 *       <ImportButton onComplete={handleImportComplete} />
 *     </div>
 *   );
 * }
 * ```
 */
export default function SymbolsMeta({
  lastImportedAt,
  lastSummary,
}: SymbolsMetaProps) {
  return (
    <div className="text-xs sm:text-sm opacity-80 mb-3 flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-4">
      <span className="mt-1">
        Last imported:{" "}
        {lastImportedAt ? new Date(lastImportedAt).toLocaleString() : "never"}
      </span>
      {lastSummary && (
        <span>
          Summary: +{lastSummary.imported} / upd {lastSummary.updated} / skip{" "}
          {lastSummary.skipped}
        </span>
      )}
    </div>
  );
}
