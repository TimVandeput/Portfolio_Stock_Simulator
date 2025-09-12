"use client";

import type { SymbolsPaginationProps } from "@/types/components";

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
