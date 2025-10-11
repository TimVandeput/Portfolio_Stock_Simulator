/**
 * @fileoverview Professional sort dropdown component for data table and list management
 *
 * This component provides comprehensive sorting functionality with clean interface,
 * accessible design, and theme integration. Features include configurable sort options,
 * professional styling, screen reader support, and seamless integration with
 * data management workflows and table systems.
 */

"use client";

import type { BaseComponentProps } from "@/types/components";

/**
 * Sort option configuration interface
 * @interface SortOption
 */
export interface SortOption {
  /** Unique value for the sort option */
  value: string;
  /** Display label for the sort option */
  label: string;
}

/**
 * Props interface for SortDropdown component configuration
 * @interface SortDropdownProps
 * @extends {BaseComponentProps}
 */
export interface SortDropdownProps extends BaseComponentProps {
  /** Currently selected sort value */
  value: string;
  /** Callback function when sort selection changes */
  onChange: (value: string) => void;
  /** Array of available sort options */
  options: SortOption[];
  /** Additional CSS classes for styling */
  className?: string;
}

/**
 * Professional sort dropdown component for data table and list management
 *
 * @remarks
 * The SortDropdown component delivers comprehensive sorting functionality with the following features:
 *
 * **Sort Management:**
 * - Configurable sort options with value-label pairs
 * - Real-time sort selection updates
 * - Professional callback handling
 * - Clean state management integration
 *
 * **Visual Design:**
 * - Professional label and select layout
 * - Theme-integrated styling with surface colors
 * - Clean border and background styling
 * - Consistent spacing and alignment
 *
 * **Accessibility:**
 * - ARIA label for screen reader support
 * - Semantic HTML structure
 * - Professional accessibility patterns
 * - Clear interactive element identification
 *
 * **Theme Integration:**
 * - CSS custom properties for theming
 * - Surface background color variables
 * - Border and text color integration
 * - Professional color palette usage
 *
 * **User Experience:**
 * - Clear "Sort:" label for context
 * - Professional dropdown styling
 * - Intuitive selection interface
 * - Clean visual feedback
 *
 * **Layout Structure:**
 * - Flexible container with item alignment
 * - Consistent gap spacing
 * - Responsive design compatibility
 * - Professional component spacing
 *
 * **Integration Features:**
 * - Seamless data table integration
 * - Filter system compatibility
 * - Professional workflow integration
 * - Clean component composition
 *
 * **Performance:**
 * - Efficient option rendering
 * - Optimized change handling
 * - Clean component lifecycle
 * - Professional state updates
 *
 * **Customization:**
 * - Flexible option configuration
 * - Custom className support
 * - Professional styling flexibility
 * - Consistent design patterns
 *
 * **Typography:**
 * - Small text for subtle labeling
 * - Professional opacity for context
 * - Theme-integrated text colors
 * - Consistent font styling
 *
 * @param props - Configuration object for sort dropdown functionality
 * @returns SortDropdown component with professional sorting interface
 *
 * @example
 * ```tsx
 * // Basic sort dropdown
 * <SortDropdown
 *   value={sortBy}
 *   onChange={setSortBy}
 *   options={[
 *     { value: 'name', label: 'Name' },
 *     { value: 'date', label: 'Date' },
 *     { value: 'price', label: 'Price' }
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with data table
 * function DataTableHeader() {
 *   const [sortBy, setSortBy] = useState('name');
 *
 *   const sortOptions = [
 *     { value: 'symbol', label: 'Symbol' },
 *     { value: 'name', label: 'Company Name' },
 *     { value: 'price', label: 'Stock Price' },
 *     { value: 'change', label: 'Price Change' }
 *   ];
 *
 *   return (
 *     <div className="table-controls">
 *       <SearchInput />
 *       <SortDropdown
 *         value={sortBy}
 *         onChange={setSortBy}
 *         options={sortOptions}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced sorting with direction
 * function AdvancedSortDropdown() {
 *   const [sortField, setSortField] = useState('name');
 *   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
 *
 *   const sortOptions = [
 *     { value: 'name_asc', label: 'Name (A-Z)' },
 *     { value: 'name_desc', label: 'Name (Z-A)' },
 *     { value: 'price_asc', label: 'Price (Low-High)' },
 *     { value: 'price_desc', label: 'Price (High-Low)' }
 *   ];
 *
 *   const handleSortChange = (value: string) => {
 *     const [field, direction] = value.split('_');
 *     setSortField(field);
 *     setSortDirection(direction as 'asc' | 'desc');
 *   };
 *
 *   return (
 *     <SortDropdown
 *       value={`${sortField}_${sortDirection}`}
 *       onChange={handleSortChange}
 *       options={sortOptions}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom styled sort dropdown
 * <SortDropdown
 *   value={currentSort}
 *   onChange={handleSortChange}
 *   options={PORTFOLIO_SORT_OPTIONS}
 *   className="ml-auto"
 * />
 * ```
 */
export default function SortDropdown({
  value,
  onChange,
  options,
  className = "",
}: SortDropdownProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm opacity-80">Sort:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 rounded-xl border bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)]"
        aria-label="Sort by"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
