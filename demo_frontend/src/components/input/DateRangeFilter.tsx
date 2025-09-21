"use client";

import { useState } from "react";
import DynamicIcon from "@/components/ui/DynamicIcon";

export interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangeFilterProps {
  dateRange: DateRange;
  onChange: (dateRange: DateRange) => void;
  className?: string;
}

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
        className={`neu-button flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all w-auto ${
          hasActiveFilter ? "bg-[var(--btn-hover)]" : ""
        }`}
        aria-label="Date range filter"
      >
        <DynamicIcon
          iconName="calendar"
          size={16}
          className={hasActiveFilter ? "text-[var(--text-accent)]" : ""}
        />
        <span>Date</span>
        <DynamicIcon
          iconName={isExpanded ? "chevronup" : "chevrondown"}
          size={14}
        />
      </button>

      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 p-4 bg-[var(--bg-surface)] rounded-xl shadow-lg border border-[var(--border-color)] z-10 min-w-[280px]">
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
                className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--border-color)] focus:bg-[var(--input-bg-active)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
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
                className="w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--border-color)] focus:bg-[var(--input-bg-active)] focus:outline-none focus:ring-2 focus:ring-[var(--text-primary)] transition-all [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
