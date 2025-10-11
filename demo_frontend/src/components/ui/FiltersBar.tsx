/**
 * @fileoverview Comprehensive filters bar component for data table management and user controls
 *
 * This component provides advanced filtering, searching, and pagination controls with
 * responsive design and professional UI patterns. Features include search input,
 * enabled/disabled filtering, page size selection, sorting capabilities, and
 * adaptive layout for different screen sizes and user workflows.
 */

"use client";

import NeumorphicInput from "@/components/input/NeumorphicInput";
import SortDropdown from "@/components/ui/SortDropdown";
import type { BaseComponentProps } from "@/types/components";

/** Filter options for enabled/disabled state filtering */
type EnabledFilter = "all" | "enabled" | "disabled";

/**
 * Props interface for FiltersBar component configuration
 * @interface FiltersBarProps
 * @extends {BaseComponentProps}
 */
export interface FiltersBarProps extends BaseComponentProps {
  /** Current search query string */
  q: string;
  /** Function to update search query */
  setQ: (v: string) => void;
  /** Current enabled filter state */
  enabledFilter: EnabledFilter;
  /** Function to update enabled filter */
  setEnabledFilter: (f: EnabledFilter) => void;
  /** Current page size for pagination */
  pageSize: number;
  /** Function to update page size */
  setPageSize: (n: number) => void;
  /** Current sort field (optional) */
  sortBy?: string;
  /** Function to update sort field (optional) */
  setSortBy?: (s: string) => void;
  /** Available sort options (optional) */
  sortOptions?: Array<{ value: string; label: string }>;
}

/**
 * Comprehensive filters bar component for data table management and user controls
 *
 * @remarks
 * The FiltersBar component delivers advanced data management controls with the following features:
 *
 * **Search Functionality:**
 * - Neumorphic search input with placeholder guidance
 * - Real-time search query updates
 * - Symbol and name search capabilities
 * - Professional input styling and theming
 *
 * **Filter Controls:**
 * - All/Enabled/Disabled state filtering
 * - Chip-style filter buttons with active states
 * - Visual feedback with selected state styling
 * - Professional transition animations
 *
 * **Pagination Management:**
 * - Configurable page size (10, 25, 50 rows)
 * - Dropdown selection with theme integration
 * - Accessible labeling for screen readers
 * - Professional select styling
 *
 * **Sort Integration:**
 * - Optional sorting functionality
 * - SortDropdown component integration
 * - Flexible sort options configuration
 * - Professional dropdown styling
 *
 * **Responsive Design:**
 * - Mobile-first approach with column layout
 * - Tablet breakpoint with hidden/shown elements
 * - Desktop layout with optimized spacing
 * - Adaptive component visibility
 *
 * **Layout Patterns:**
 * - Flexible container with gap spacing
 * - Responsive flex direction changes
 * - Auto margin for right alignment
 * - Professional spacing and alignment
 *
 * **Visual Design:**
 * - Consistent chip styling for filters
 * - Theme-integrated colors and borders
 * - Professional typography and sizing
 * - Clean visual hierarchy
 *
 * **Accessibility:**
 * - ARIA labels for screen readers
 * - Semantic HTML structure
 * - Keyboard navigation support
 * - Clear interactive elements
 *
 * **Theme Integration:**
 * - CSS custom properties for theming
 * - Surface background colors
 * - Border and text color variables
 * - Professional color palette
 *
 * **Performance:**
 * - Efficient re-render patterns
 * - Optimized responsive breakpoints
 * - Clean component structure
 * - Professional state management
 *
 * @param props - Configuration object for filters bar functionality
 * @returns FiltersBar component with comprehensive data management controls
 *
 * @example
 * ```tsx
 * // Basic filters bar usage
 * <FiltersBar
 *   q={searchQuery}
 *   setQ={setSearchQuery}
 *   enabledFilter={enabledFilter}
 *   setEnabledFilter={setEnabledFilter}
 *   pageSize={pageSize}
 *   setPageSize={setPageSize}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Full-featured filters bar with sorting
 * <FiltersBar
 *   q={searchQuery}
 *   setQ={setSearchQuery}
 *   enabledFilter={enabledFilter}
 *   setEnabledFilter={setEnabledFilter}
 *   pageSize={pageSize}
 *   setPageSize={setPageSize}
 *   sortBy={sortBy}
 *   setSortBy={setSortBy}
 *   sortOptions={[
 *     { value: 'symbol', label: 'Symbol' },
 *     { value: 'name', label: 'Name' },
 *     { value: 'price', label: 'Price' }
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with data table
 * function SymbolsManager() {
 *   const [filters, setFilters] = useState({
 *     q: '',
 *     enabledFilter: 'all' as EnabledFilter,
 *     pageSize: 25,
 *     sortBy: 'symbol'
 *   });
 *
 *   const { data: symbols } = useFilteredSymbols(filters);
 *
 *   return (
 *     <div className="space-y-6">
 *       <FiltersBar
 *         q={filters.q}
 *         setQ={(q) => setFilters(prev => ({ ...prev, q }))}
 *         enabledFilter={filters.enabledFilter}
 *         setEnabledFilter={(enabledFilter) =>
 *           setFilters(prev => ({ ...prev, enabledFilter }))
 *         }
 *         pageSize={filters.pageSize}
 *         setPageSize={(pageSize) =>
 *           setFilters(prev => ({ ...prev, pageSize }))
 *         }
 *         sortBy={filters.sortBy}
 *         setSortBy={(sortBy) =>
 *           setFilters(prev => ({ ...prev, sortBy }))
 *         }
 *         sortOptions={SORT_OPTIONS}
 *       />
 *
 *       <SymbolsTable symbols={symbols} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom filter integration
 * function AdvancedFiltersBar() {
 *   const [advancedFilters, setAdvancedFilters] = useState({
 *     query: '',
 *     status: 'all' as EnabledFilter,
 *     resultsPerPage: 25,
 *     sortField: 'symbol'
 *   });
 *
 *   return (
 *     <div className="filters-container">
 *       <FiltersBar
 *         q={advancedFilters.query}
 *         setQ={(query) =>
 *           setAdvancedFilters(prev => ({ ...prev, query }))
 *         }
 *         enabledFilter={advancedFilters.status}
 *         setEnabledFilter={(status) =>
 *           setAdvancedFilters(prev => ({ ...prev, status }))
 *         }
 *         pageSize={advancedFilters.resultsPerPage}
 *         setPageSize={(resultsPerPage) =>
 *           setAdvancedFilters(prev => ({ ...prev, resultsPerPage }))
 *         }
 *         sortBy={advancedFilters.sortField}
 *         setSortBy={(sortField) =>
 *           setAdvancedFilters(prev => ({ ...prev, sortField }))
 *         }
 *         sortOptions={ADVANCED_SORT_OPTIONS}
 *       />
 *
 *       <FilteredResults filters={advancedFilters} />
 *     </div>
 *   );
 * }
 * ```
 */
export default function FiltersBar({
  q,
  setQ,
  enabledFilter,
  setEnabledFilter,
  pageSize,
  setPageSize,
  sortBy,
  setSortBy,
  sortOptions,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 md:flex-row md:flex-wrap md:items-center md:gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3 mb-3">
      <NeumorphicInput
        type="text"
        placeholder="Search symbol or name…"
        value={q}
        onChange={setQ}
        className="w-full sm:flex-none sm:w-80 md:flex-none md:w-80 lg:w-[28rem]"
      />

      <div className="hidden md:flex lg:hidden items-center gap-3 w-full">
        <div className="flex gap-2">
          {(["all", "enabled", "disabled"] as const).map((key) => (
            <button
              key={key}
              className={`px-3 py-1 rounded-full text-sm border transition-colors chip ${
                enabledFilter === key ? "chip-selected" : ""
              }`}
              onClick={() => setEnabledFilter(key)}
            >
              {key[0].toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm opacity-80">Rows:</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(parseInt(e.target.value))}
            className="px-2 py-1 rounded-xl border bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)]"
            aria-label="Rows per page"
          >
            {[10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {sortBy && setSortBy && sortOptions && (
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
            />
          )}
        </div>
      </div>

      <div className="flex gap-2 md:hidden lg:flex">
        {(["all", "enabled", "disabled"] as const).map((key) => (
          <button
            key={key}
            className={`px-3 py-1 rounded-full text-sm border transition-colors chip ${
              enabledFilter === key ? "chip-selected" : ""
            }`}
            onClick={() => setEnabledFilter(key)}
          >
            {key[0].toUpperCase() + key.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 sm:ml-auto md:hidden lg:flex">
        <span className="text-sm opacity-80 xs:inline">Rows:</span>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value))}
          className="px-2 py-1 rounded-xl border bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)]"
          aria-label="Rows per page"
        >
          {[10, 25, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        {sortBy && setSortBy && sortOptions && (
          <SortDropdown
            value={sortBy}
            onChange={setSortBy}
            options={sortOptions}
          />
        )}
      </div>
    </div>
  );
}
