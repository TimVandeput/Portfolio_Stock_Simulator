"use client";

import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";

type Props = {
  page: Page<SymbolDTO> | null;
  onToggle: (row: SymbolDTO, next: boolean) => void;
};

export default function SymbolsListMobile({ page, onToggle }: Props) {
  return (
    <div className="md:hidden">
      {(!page || page.content.length === 0) && (
        <div className="rounded-2xl border shadow-sm p-4 text-center opacity-70">
          No symbols found.
        </div>
      )}

      <ul className="space-y-3">
        {page?.content?.map((row) => (
          <li
            key={row.id}
            className="rounded-2xl border shadow-sm p-4 bg-[var(--background)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-base">{row.symbol}</span>
                  {row.inUse && (
                    <span className="px-2 py-0.5 text-[11px] rounded-full border">
                      In use
                    </span>
                  )}
                </div>
                <div className="text-sm opacity-80">{row.name}</div>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer select-none shrink-0">
                <input
                  type="checkbox"
                  checked={row.enabled}
                  onChange={(e) => onToggle(row, e.target.checked)}
                  className="h-4 w-4 accent-[var(--primary)]"
                  aria-label={`Toggle ${row.symbol}`}
                />
                <span className="opacity-80 text-sm">
                  {row.enabled ? "On" : "Off"}
                </span>
              </label>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl border p-2">
                <div className="opacity-70">Exchange</div>
                <div>{row.exchange}</div>
              </div>
              <div className="rounded-xl border p-2">
                <div className="opacity-70">Currency</div>
                <div>{row.currency}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
