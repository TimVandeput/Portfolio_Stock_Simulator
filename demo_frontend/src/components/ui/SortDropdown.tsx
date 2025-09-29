"use client";

import type { BaseComponentProps } from "@/types/components";

export interface SortOption {
  value: string;
  label: string;
}

export interface SortDropdownProps extends BaseComponentProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
}

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
