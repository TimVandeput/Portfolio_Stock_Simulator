/**
 * @fileoverview Professional transaction filters bar for trading history management
 *
 * This component provides comprehensive filtering and sorting controls specifically
 * designed for transaction data management. Features include search functionality,
 * pagination controls, sort options, and responsive design for optimal transaction
 * history navigation and professional trading interface integration.
 */

"use client";

import NeumorphicInput from "@/components/input/NeumorphicInput";
import SortDropdown from "@/components/ui/SortDropdown";
import type { SortOption } from "@/components/ui/SortDropdown";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for TransactionFiltersBar component configuration
 * @interface TransactionFiltersBarProps
 * @extends {BaseComponentProps}
 */
export interface TransactionFiltersBarProps extends BaseComponentProps {
  /** Current search query string */
  q: string;
  /** Function to update search query */
  setQ: (value: string) => void;
  /** Current sort field selection */
  sortBy: string;
  /** Function to update sort selection */
  setSortBy: (value: string) => void;
  /** Available sort options for transactions */
  sortOptions: SortOption[];
  /** Current page size for pagination */
  pageSize: number;
  /** Function to update page size */
  setPageSize: (size: number) => void;
}

/**
 * Professional transaction filters bar for trading history management
 *
 * @remarks
 * The TransactionFiltersBar component delivers specialized transaction filtering with the following features:
 *
 * **Search Functionality:**
 * - Neumorphic search input with professional styling
 * - Symbol and company name search capabilities
 * - Real-time search query updates
 * - Professional placeholder guidance
 *
 * **Sorting System:**
 * - Integrated SortDropdown component
 * - Configurable sort options for transactions
 * - Professional sort selection interface
 * - Transaction-specific sorting patterns
 *
 * **Pagination Controls:**
 * - Flexible page size selection (10, 25, 50, 100)
 * - Professional dropdown styling
 * - Accessible labeling for screen readers
 * - Theme-integrated select styling
 *
 * **Responsive Design:**
 * - Mobile-first column layout
 * - Desktop row layout with right alignment
 * - Responsive width management
 * - Professional breakpoint handling
 *
 * **Layout Structure:**
 * - Flexible container with gap spacing
 * - Auto margin for control alignment
 * - Consistent spacing across breakpoints
 * - Clean visual organization
 *
 * **Trading Integration:**
 * - Transaction-specific search patterns
 * - Trading history filtering
 * - Professional financial interface
 * - Portfolio management compatibility
 *
 * **Visual Design:**
 * - Professional control grouping
 * - Consistent spacing and alignment
 * - Theme-integrated styling
 * - Clean typography hierarchy
 *
 * **Accessibility:**
 * - ARIA labels for screen readers
 * - Semantic HTML structure
 * - Professional accessibility patterns
 * - Clear interactive elements
 *
 * **Theme Integration:**
 * - CSS custom properties for theming
 * - Surface and border color variables
 * - Professional color palette usage
 * - Consistent design system
 *
 * **Performance:**
 * - Efficient component composition
 * - Optimized state management
 * - Clean component structure
 * - Professional rendering patterns
 *
 * @param props - Configuration object for transaction filters functionality
 * @returns TransactionFiltersBar component with comprehensive filtering controls
 *
 * @example
 * ```tsx
 * // Basic transaction filters bar
 * <TransactionFiltersBar
 *   q={searchQuery}
 *   setQ={setSearchQuery}
 *   sortBy={sortBy}
 *   setSortBy={setSortBy}
 *   sortOptions={[
 *     { value: 'date', label: 'Date' },
 *     { value: 'symbol', label: 'Symbol' },
 *     { value: 'amount', label: 'Amount' }
 *   ]}
 *   pageSize={pageSize}
 *   setPageSize={setPageSize}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with transaction history
 * function TransactionHistory() {
 *   const [filters, setFilters] = useState({
 *     q: '',
 *     sortBy: 'date_desc',
 *     pageSize: 25
 *   });
 *
 *   const sortOptions = [
 *     { value: 'date_desc', label: 'Newest First' },
 *     { value: 'date_asc', label: 'Oldest First' },
 *     { value: 'amount_desc', label: 'Highest Amount' },
 *     { value: 'amount_asc', label: 'Lowest Amount' },
 *     { value: 'symbol_asc', label: 'Symbol A-Z' }
 *   ];
 *
 *   return (
 *     <div className="transaction-history">
 *       <TransactionFiltersBar
 *         q={filters.q}
 *         setQ={(q) => setFilters(prev => ({ ...prev, q }))}
 *         sortBy={filters.sortBy}
 *         setSortBy={(sortBy) => setFilters(prev => ({ ...prev, sortBy }))}
 *         sortOptions={sortOptions}
 *         pageSize={filters.pageSize}
 *         setPageSize={(pageSize) => setFilters(prev => ({ ...prev, pageSize }))}
 *       />
 *
 *       <TransactionTable filters={filters} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced filtering with analytics
 * function AdvancedTransactionFilters() {
 *   const [query, setQuery] = useState('');
 *   const [sort, setSort] = useState('date_desc');
 *   const [pageSize, setPageSize] = useState(50);
 *   const analytics = useAnalytics();
 *
 *   const handleSortChange = (newSort: string) => {
 *     analytics.track('transaction_sort_changed', {
 *       from: sort,
 *       to: newSort
 *     });
 *     setSort(newSort);
 *   };
 *
 *   return (
 *     <TransactionFiltersBar
 *       q={query}
 *       setQ={setQuery}
 *       sortBy={sort}
 *       setSortBy={handleSortChange}
 *       sortOptions={TRANSACTION_SORT_OPTIONS}
 *       pageSize={pageSize}
 *       setPageSize={setPageSize}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Portfolio-specific transaction filtering
 * function PortfolioTransactionFilters({ symbol }: { symbol?: string }) {
 *   const [filters, setFilters] = useState({
 *     q: symbol || '',
 *     sortBy: 'date_desc',
 *     pageSize: 25
 *   });
 *
 *   const portfolioSortOptions = [
 *     { value: 'date_desc', label: 'Recent First' },
 *     { value: 'type', label: 'Transaction Type' },
 *     { value: 'profit_desc', label: 'Highest Profit' },
 *     { value: 'profit_asc', label: 'Lowest Profit' }
 *   ];
 *
 *   return (
 *     <div className="portfolio-filters">
 *       <h3>Transaction History {symbol && `for ${symbol}`}</h3>
 *
 *       <TransactionFiltersBar
 *         q={filters.q}
 *         setQ={(q) => setFilters(prev => ({ ...prev, q }))}
 *         sortBy={filters.sortBy}
 *         setSortBy={(sortBy) => setFilters(prev => ({ ...prev, sortBy }))}
 *         sortOptions={portfolioSortOptions}
 *         pageSize={filters.pageSize}
 *         setPageSize={(pageSize) => setFilters(prev => ({ ...prev, pageSize }))}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export default function TransactionFiltersBar({
  q,
  setQ,
  sortBy,
  setSortBy,
  sortOptions,
  pageSize,
  setPageSize,
}: TransactionFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 mb-3">
      <NeumorphicInput
        type="text"
        placeholder="Search symbol or name..."
        value={q}
        onChange={setQ}
        className="w-full sm:flex-none sm:w-80 md:w-96 lg:w-[28rem]"
      />

      <div className="flex items-center gap-2 sm:ml-auto">
        <span className="text-sm opacity-80 xs:inline">Rows:</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value))}
          className="px-2 py-1 rounded-xl border bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)]"
          aria-label="Rows per page"
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <SortDropdown
          value={sortBy}
          onChange={setSortBy}
          options={sortOptions}
        />
      </div>
    </div>
  );
}
