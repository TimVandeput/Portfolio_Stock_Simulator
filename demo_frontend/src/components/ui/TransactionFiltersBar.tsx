"use client";

import NeumorphicInput from "@/components/input/NeumorphicInput";
import SortDropdown from "@/components/ui/SortDropdown";
import type { SortOption } from "@/components/ui/SortDropdown";

interface TransactionFiltersBarProps {
  q: string;
  setQ: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOptions: SortOption[];
  pageSize: number;
  setPageSize: (size: number) => void;
}

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
