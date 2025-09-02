"use client";

import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";

type Props = {
  page: Page<SymbolDTO> | null;
  onToggle: (row: SymbolDTO, next: boolean) => void;
};

export default function SymbolsTableDesktop({ page, onToggle }: Props) {
  return (
    <div className="hidden md:block rounded-2xl overflow-hidden border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-[10ch]" />
            <col />
            <col className="w-[14ch]" />
            <col className="w-[9ch]" />
            <col className="w-[18ch]" />
          </colgroup>

          <thead className="bg-[var(--surface)]">
            <tr className="text-left">
              <th className="px-4 py-3 whitespace-nowrap">Symbol</th>
              <th className="px-4 py-3 whitespace-nowrap">Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Exchange</th>
              <th className="px-4 py-3 whitespace-nowrap">Currency</th>
              <th className="px-4 py-3 text-center whitespace-nowrap">
                Enabled
              </th>
            </tr>
          </thead>

          <tbody>
            {page?.content?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center opacity-70">
                  No symbols found.
                </td>
              </tr>
            )}
            {page?.content?.map((row) => (
              <tr key={row.id} className="border-t">
                <td
                  className="px-4 py-3 font-semibold whitespace-nowrap"
                  title={row.symbol}
                >
                  {row.symbol}
                </td>

                <td className="px-4 py-3 max-w-0">
                  <span className="block truncate" title={row.name}>
                    {row.name}
                  </span>
                </td>

                <td
                  className="px-4 py-3 whitespace-nowrap"
                  title={row.exchange}
                >
                  {row.exchange}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{row.currency}</td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {row.inUse && (
                      <span className="px-2 py-0.5 text-[11px] rounded-full border">
                        In use
                      </span>
                    )}
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={row.enabled}
                        onChange={(e) => onToggle(row, e.target.checked)}
                        className="h-4 w-4 accent-[var(--primary)]"
                        aria-label={`Toggle ${row.symbol}`}
                      />
                      <span className="opacity-80">
                        {row.enabled ? "On" : "Off"}
                      </span>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
