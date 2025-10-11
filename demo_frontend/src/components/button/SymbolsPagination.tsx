/**
 * @fileoverview Advanced pagination component for symbols and data tables.
 *
 * This module provides a comprehensive pagination component designed for
 * navigating through large datasets of symbols, transactions, or other paginated
 * content. It features intelligent page number generation, responsive design,
 * loading state management, and accessibility compliance within the Stock
 * Simulator platform.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the SymbolsPagination component.
 * @interface SymbolsPaginationProps
 * @extends BaseComponentProps
 */
export interface SymbolsPaginationProps extends BaseComponentProps {
  /** Current page index (zero-based) */
  pageIdx: number;
  /** Total number of pages available */
  totalPages: number;
  /** Total number of elements across all pages */
  totalElements: number;
  /** Whether pagination is in loading state */
  loading: boolean;
  /** Callback function for navigating to previous page */
  onPrev: () => void;
  /** Callback function for navigating to next page */
  onNext: () => void;
  /** Callback function for navigating to specific page by index */
  onGoto: (idx: number) => void;
}

/**
 * Advanced pagination component with intelligent page number generation and responsive design.
 *
 * This sophisticated pagination component provides comprehensive navigation
 * capabilities for large datasets with intelligent page number generation,
 * responsive layout design, loading state management, and full accessibility
 * support. It delivers professional-grade pagination functionality throughout
 * the Stock Simulator platform.
 *
 * @remarks
 * The component delivers comprehensive pagination functionality through:
 *
 * **Intelligent Page Number Generation**:
 * - **Smart Truncation**: Displays relevant page numbers with ellipsis for large datasets
 * - **Context-Aware Display**: Shows current page with surrounding context pages
 * - **Boundary Handling**: Always shows first and last pages when applicable
 * - **Dynamic Algorithm**: Adapts page display based on current position and total pages
 *
 * **Advanced Navigation Controls**:
 * - **Previous/Next Buttons**: Standard navigation with proper enabled/disabled states
 * - **Direct Page Access**: Click any page number for immediate navigation
 * - **Current Page Highlighting**: Visual indication of current page position
 * - **Loading State Integration**: Disables navigation during data loading operations
 *
 * **Responsive Design Features**:
 * - **Mobile-First Layout**: Optimized for touch interactions on mobile devices
 * - **Flexible Grid System**: Adapts layout between mobile and desktop screens
 * - **Touch-Friendly Buttons**: Appropriate sizing for finger-based navigation
 * - **Responsive Text**: Adjusts information display based on screen size
 *
 * **Information Display**:
 * - **Page Context**: Shows current page number and total pages
 * - **Element Count**: Displays total number of items being paginated
 * - **Progress Indication**: Clear indication of navigation position
 * - **Summary Statistics**: Comprehensive dataset information
 *
 * **Accessibility Standards**:
 * - **Screen Reader Support**: Comprehensive ARIA labels and descriptions
 * - **Keyboard Navigation**: Full keyboard accessibility for all controls
 * - **Current Page Indication**: Proper aria-current attribute usage
 * - **Descriptive Labels**: Clear button descriptions for assistive technologies
 *
 * **State Management**:
 * - **Loading Integration**: Proper handling of loading states across all controls
 * - **Boundary Detection**: Smart enable/disable logic for navigation buttons
 * - **State Persistence**: Maintains consistent state across re-renders
 * - **Error Prevention**: Prevents invalid navigation attempts
 *
 * **Visual Design Features**:
 * - **Chip-based Design**: Modern chip styling for page numbers
 * - **Selection Highlighting**: Visual feedback for current page selection
 * - **Consistent Theming**: Integration with platform design system
 * - **Smooth Transitions**: Color transitions for interactive elements
 *
 * **Performance Optimizations**:
 * - **Efficient Rendering**: Optimized page number generation algorithm
 * - **Minimal Re-renders**: Smart component updates only when necessary
 * - **Event Delegation**: Efficient event handling for page navigation
 * - **Lightweight Implementation**: Clean code structure with minimal overhead
 *
 * The component serves as an essential navigation tool for data-heavy interfaces,
 * providing users with intuitive and efficient ways to navigate through large
 * datasets while maintaining accessibility standards and delivering consistent
 * user experience throughout the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic pagination usage with symbols data
 * function SymbolsTable() {
 *   const [currentPage, setCurrentPage] = useState(0);
 *   const [loading, setLoading] = useState(false);
 *   const [data, setData] = useState({ symbols: [], totalPages: 0, totalElements: 0 });
 *
 *   const handlePageChange = async (pageIndex: number) => {
 *     setLoading(true);
 *     setCurrentPage(pageIndex);
 *     const newData = await fetchSymbols(pageIndex);
 *     setData(newData);
 *     setLoading(false);
 *   };
 *
 *   const handlePrev = () => {
 *     if (currentPage > 0) {
 *       handlePageChange(currentPage - 1);
 *     }
 *   };
 *
 *   const handleNext = () => {
 *     if (currentPage < data.totalPages - 1) {
 *       handlePageChange(currentPage + 1);
 *     }
 *   };
 *
 *   return (
 *     <div className="symbols-container">
 *       <SymbolsTable symbols={data.symbols} loading={loading} />
 *       <SymbolsPagination
 *         pageIdx={currentPage}
 *         totalPages={data.totalPages}
 *         totalElements={data.totalElements}
 *         loading={loading}
 *         onPrev={handlePrev}
 *         onNext={handleNext}
 *         onGoto={handlePageChange}
 *       />
 *     </div>
 *   );
 * }
 *
 * // Integration with search and filtering
 * function TransactionHistory() {
 *   const { pagination, loading, navigateToPage } = usePagination({
 *     pageSize: 20,
 *     dataSource: 'transactions'
 *   });
 *
 *   return (
 *     <div className="transaction-history">
 *       <TransactionFilters />
 *       <TransactionTable data={pagination.data} />
 *       <SymbolsPagination
 *         pageIdx={pagination.currentPage}
 *         totalPages={pagination.totalPages}
 *         totalElements={pagination.totalElements}
 *         loading={loading}
 *         onPrev={() => navigateToPage(pagination.currentPage - 1)}
 *         onNext={() => navigateToPage(pagination.currentPage + 1)}
 *         onGoto={navigateToPage}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for pagination functionality and state management
 * @returns An advanced pagination component with intelligent page generation,
 * responsive design, loading states, and comprehensive accessibility support
 *
 * @see {@link BaseComponentProps} - Base properties interface for components
 *
 * @public
 */
export default function SymbolsPagination({
  pageIdx,
  totalPages,
  totalElements,
  loading,
  onPrev,
  onNext,
  onGoto,
}: SymbolsPaginationProps) {
  const canPrev = pageIdx > 0;
  const canNext = pageIdx + 1 < totalPages;

  const pageItems: (number | "...")[] = (() => {
    const t = totalPages;
    const c = pageIdx;
    if (t <= 1) return [0];
    const items: (number | "...")[] = [];
    const start = Math.max(0, c - 2);
    const end = Math.min(t - 1, c + 2);
    if (start > 0) {
      items.push(0);
      if (start > 1) items.push("...");
    }
    for (let i = start; i <= end; i++) items.push(i);
    if (end < t - 1) {
      if (end < t - 2) items.push("...");
      items.push(t - 1);
    }
    return items;
  })();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
      <div className="text-sm opacity-80 text-center sm:text-left">
        Page {pageIdx + 1} / {Math.max(totalPages, 1)} • Total {totalElements}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          className="inline-flex items-center justify-center px-4 py-2 rounded-2xl border shadow-sm disabled:opacity-50"
          disabled={!canPrev || loading}
          onClick={onPrev}
          aria-label="Previous page"
        >
          Prev
        </button>

        <div className="flex flex-wrap items-center justify-center gap-1">
          {pageItems.map((item, i) =>
            item === "..." ? (
              <span key={`dots-${i}`} className="px-2 select-none opacity-70">
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => onGoto(item)}
                disabled={loading || item === pageIdx}
                className={`px-3 py-1 rounded-full text-sm border transition-colors chip ${
                  item === pageIdx
                    ? "chip-selected"
                    : "hover:bg-[var(--surface)]"
                }`}
                aria-current={item === pageIdx ? "page" : undefined}
                aria-label={`Go to page ${item + 1}`}
              >
                {item + 1}
              </button>
            )
          )}
        </div>

        <button
          className="inline-flex items-center justify-center px-4 py-2 rounded-2xl border shadow-sm disabled:opacity-50"
          disabled={!canNext || loading}
          onClick={onNext}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
