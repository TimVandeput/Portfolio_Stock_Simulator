"use client";

import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";
import NeumorphicButton from "@/components/button/NeumorphicButton";

type Price = { last?: number; percentChange?: number; lastUpdate?: number };
type Mode = "admin" | "market";

type Props = {
  page: Page<SymbolDTO> | null;
  mode: Mode;
  onToggle?: (row: SymbolDTO, next: boolean) => void;
  prices?: Record<string, Price>;
  pulsatingSymbols?: Set<string>;
  onBuy?: (row: SymbolDTO) => void;
};

export default function SymbolsTableDesktop({
  page,
  mode,
  onToggle,
  prices,
  pulsatingSymbols = new Set(),
  onBuy,
}: Props) {
  const isAdmin = mode === "admin";
  const isMarket = mode === "market";

  const getPrice = (sym: string): Price => prices?.[sym] ?? {};
  const colCount = isMarket ? 7 : 5;

  const isRecentUpdate = (price: Price): boolean => {
    if (!price.lastUpdate) return false;
    return Date.now() - price.lastUpdate < 2000;
  };

  const colEls = [
    <col key="sym" className="w-[10ch]" />,
    <col key="name" />,
    <col key="exch" className="w-[14ch]" />,
    <col key="cur" className="w-[9ch]" />,
    ...(isMarket
      ? [
          <col key="last" className="w-[12ch]" />,
          <col key="chg" className="w-[12ch]" />,
        ]
      : []),
    <col key="act" className="w-[18ch]" />,
  ];

  return (
    <div className="hidden md:block rounded-2xl overflow-hidden border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <colgroup>{colEls}</colgroup>

          <thead className="bg-[var(--surface)]">
            <tr className="text-left">
              <th className="px-4 py-3 whitespace-nowrap">Symbol</th>
              <th className="px-4 py-3 whitespace-nowrap">Name</th>
              <th className="px-4 py-3 whitespace-nowrap">Exchange</th>
              <th className="px-4 py-3 whitespace-nowrap">Currency</th>
              {isMarket && (
                <>
                  <th className="px-4 py-3 whitespace-nowrap text-right">
                    Last
                  </th>
                  <th className="px-4 py-3 whitespace-nowrap text-right">
                    % Chg
                  </th>
                </>
              )}
              <th className="px-4 py-3 text-center whitespace-nowrap">
                {isAdmin ? "Enabled" : "Actions"}
              </th>
            </tr>
          </thead>

          <tbody>
            {page?.content?.length === 0 && (
              <tr>
                <td
                  colSpan={colCount}
                  className="px-4 py-6 text-center opacity-70"
                >
                  No symbols found.
                </td>
              </tr>
            )}

            {page?.content?.map((row) => {
              const p = isMarket ? getPrice(row.symbol) : {};
              const pc = p.percentChange ?? 0;
              const pcClass =
                pc > 0
                  ? "text-emerald-500"
                  : pc < 0
                  ? "text-rose-500"
                  : "opacity-80";

              const isRecent = isRecentUpdate(p);
              const isPulsing = pulsatingSymbols.has(row.symbol);

              return (
                <tr
                  key={row.id}
                  className={`border-t transition-all duration-500 ${
                    isPulsing
                      ? "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/30 shadow-lg shadow-amber-500/30 border-amber-300 dark:border-amber-600 animate-pulse scale-[1.01]"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
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

                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.currency}
                  </td>

                  {isMarket && (
                    <>
                      <td
                        className={`px-4 py-3 whitespace-nowrap font-mono text-right transition-all duration-300 ${
                          isPulsing
                            ? "text-amber-600 dark:text-amber-400 font-bold shadow-lg shadow-amber-500/50 bg-amber-100/50 dark:bg-amber-900/50 rounded-md"
                            : "text-amber-500"
                        }`}
                        title={p.last?.toString() ?? ""}
                      >
                        {p.last !== undefined ? `$${p.last.toFixed(2)}` : "—"}
                      </td>
                      <td
                        className={`px-4 py-3 whitespace-nowrap font-mono text-right transition-all duration-300 ${pcClass} ${
                          isPulsing ? "font-bold shadow-md" : ""
                        }`}
                        title={`${pc.toFixed(2)}%`}
                      >
                        {p.percentChange !== undefined
                          ? `${pc > 0 ? "+" : ""}${pc.toFixed(2)}%`
                          : "—"}
                      </td>
                    </>
                  )}

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {isAdmin && row.inUse && (
                        <span className="px-2 py-0.5 text-[11px] rounded-full border">
                          In use
                        </span>
                      )}

                      {isAdmin ? (
                        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={row.enabled}
                            onChange={(e) => onToggle?.(row, e.target.checked)}
                            className="h-4 w-4 accent-[var(--primary)]"
                            aria-label={`Toggle ${row.symbol}`}
                          />
                          <span className="opacity-80">
                            {row.enabled ? "On" : "Off"}
                          </span>
                        </label>
                      ) : (
                        <NeumorphicButton
                          onClick={() => onBuy?.(row)}
                          disabled={!row.enabled}
                        >
                          Buy
                        </NeumorphicButton>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
