"use client";

import NeumorphicInput from "@/components/input/NeumorphicInput";
import SortDropdown from "@/components/ui/SortDropdown";

type EnabledFilter = "all" | "enabled" | "disabled";

type Props = {
  q: string;
  setQ: (v: string) => void;
  enabledFilter: EnabledFilter;
  setEnabledFilter: (f: EnabledFilter) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  sortBy?: string;
  setSortBy?: (s: string) => void;
  sortOptions?: Array<{ value: string; label: string }>;
};

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
}: Props) {
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
