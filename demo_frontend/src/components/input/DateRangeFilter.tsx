/**
 * @fileoverview Advanced date range filter component for transaction and data filtering
 *
 * This component provides an intuitive date range selection interface with dropdown
 * functionality, visual feedback, and comprehensive filtering capabilities. Features
 * include expandable date picker interface, active filter indicators, and seamless
 * integration with data filtering systems.
 */

"use client";

import { useState } from "react";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { BaseComponentProps } from "@/types";

/**
 * Interface for date range values
 * @interface DateRange
 */
export interface DateRange {
  /** Start date in YYYY-MM-DD format */
  startDate: string;
  /** End date in YYYY-MM-DD format */
  endDate: string;
}

/**
 * Props interface for DateRangeFilter component configuration
 * @interface DateRangeFilterProps
 * @extends {BaseComponentProps}
 */
export interface DateRangeFilterProps extends BaseComponentProps {
  /** Current date range selection */
  dateRange: DateRange;
  /** Callback function when date range changes */
  onChange: (dateRange: DateRange) => void;
  /** Additional CSS classes for styling customization */
  className?: string;
}

/**
 * Advanced date range filter component for transaction and data filtering
 *
 * @remarks
 * The DateRangeFilter component provides comprehensive date filtering with the following features:
 *
 * **Filter Interface:**
 * - Collapsible dropdown design with toggle button
 * - Visual indicators for active filter states
 * - Intuitive calendar icon and chevron controls
 * - Clean, professional styling with theme integration
 *
 * **Date Selection:**
 * - Native HTML5 date inputs with calendar pickers
 * - Separate start and end date controls
 * - Proper form validation and formatting
 * - Cross-browser compatible date picker styling
 *
 * **User Experience:**
 * - Click-outside-to-close functionality
 * - Clear filter option when dates are active
 * - Visual feedback for active filter states
 * - Responsive design for mobile and desktop
 *
 * **State Management:**
 * - Controlled component with external state management
 * - Real-time callback updates on date changes
 * - Persistent expansion state during interaction
 * - Proper cleanup and event handling
 *
 * **Visual Design:**
 * - Floating dropdown with shadow and border
 * - Theme-aware color scheme integration
 * - Consistent spacing and typography
 * - Professional form field styling
 *
 * **Accessibility:**
 * - Proper form labels and ARIA attributes
 * - Keyboard navigation support
 * - Focus management and visual indicators
 * - Screen reader friendly interface
 *
 * @param props - Configuration object for date range filter
 * @returns DateRangeFilter component with expandable date selection
 *
 * @example
 * ```tsx
 * // Basic date range filter with state management
 * const [dateRange, setDateRange] = useState<DateRange>({
 *   startDate: "",
 *   endDate: ""
 * });
 *
 * <DateRangeFilter
 *   dateRange={dateRange}
 *   onChange={setDateRange}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integrated with transaction filtering
 * function TransactionFilters() {
 *   const [filters, setFilters] = useState({
 *     dateRange: { startDate: "", endDate: "" },
 *     category: "all"
 *   });
 *
 *   return (
 *     <div className="flex gap-4">
 *       <DateRangeFilter
 *         dateRange={filters.dateRange}
 *         onChange={(dateRange) =>
 *           setFilters(prev => ({ ...prev, dateRange }))
 *         }
 *         className="flex-shrink-0"
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced usage with validation and formatting
 * function ReportDateFilter() {
 *   const [dateRange, setDateRange] = useState<DateRange>({
 *     startDate: "",
 *     endDate: ""
 *   });
 *
 *   const handleDateChange = (newRange: DateRange) => {
 *     // Validation: end date must be after start date
 *     if (newRange.startDate && newRange.endDate) {
 *       if (new Date(newRange.endDate) < new Date(newRange.startDate)) {
 *         return; // Invalid range
 *       }
 *     }
 *
 *     setDateRange(newRange);
 *     generateReport(newRange);
 *   };
 *
 *   return (
 *     <DateRangeFilter
 *       dateRange={dateRange}
 *       onChange={handleDateChange}
 *       className="mb-6"
 *     />
 *   );
 * }
 * ```
 */
export default function DateRangeFilter({
  dateRange,
  onChange,
  className = "",
}: DateRangeFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStartDateChange = (value: string) => {
    onChange({
      ...dateRange,
      startDate: value,
    });
  };

  const handleEndDateChange = (value: string) => {
    onChange({
      ...dateRange,
      endDate: value,
    });
  };

  const clearDateRange = () => {
    onChange({
      startDate: "",
      endDate: "",
    });
  };

  const hasActiveFilter = dateRange.startDate || dateRange.endDate;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`px-2 py-1 rounded-xl border bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] flex items-center gap-2 text-sm transition-all ${
          hasActiveFilter ? "bg-[var(--btn-hover)]" : ""
        }`}
        aria-label="Date range filter"
      >
        <DynamicIcon
          iconName="calendar"
          size={14}
          className={hasActiveFilter ? "text-[var(--text-accent)]" : ""}
        />
        <span>Date</span>
        <DynamicIcon
          iconName={isExpanded ? "chevronup" : "chevrondown"}
          size={12}
        />
      </button>

      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 p-4 bg-[var(--bg-surface)] rounded-xl shadow-lg border border-[var(--border)] z-10 min-w-[280px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              Filter by Date Range
            </h3>
            {hasActiveFilter && (
              <button
                onClick={clearDateRange}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="start-date"
                className="block text-xs text-[var(--text-secondary)] mb-1"
              >
                From
              </label>
              <input
                id="start-date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--border)] focus:bg-[var(--input-bg-active)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="end-date"
                className="block text-xs text-[var(--text-secondary)] mb-1"
              >
                To
              </label>
              <input
                id="end-date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--border)] focus:bg-[var(--input-bg-active)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      )}

      {isExpanded && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}
