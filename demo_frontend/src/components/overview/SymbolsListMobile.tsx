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

export default function SymbolsListMobile({
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

  const isRecentUpdate = (price: Price): boolean => {
    if (!price.lastUpdate) return false;
    return Date.now() - price.lastUpdate < 2000;
  };

  if (!page || page.content.length === 0) {
    return (
      <div className="md:hidden rounded-2xl border shadow-sm p-4 text-center opacity-70">
        No symbols found.
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <ul className="space-y-3">
        {page.content.map((row) => {
          const p = isMarket ? getPrice(row.symbol) : {};
          const pc = p.percentChange ?? 0;
          const roundedPc = parseFloat(pc.toFixed(2));
          const pcClass =
            roundedPc > 0
              ? "text-emerald-500"
              : roundedPc < 0
              ? "text-rose-500"
              : "opacity-80";

          const isRecent = isRecentUpdate(p);
          const isPulsing = pulsatingSymbols.has(row.symbol);

          return (
            <li
              key={row.id}
              className={`rounded-2xl border shadow-sm p-4 transition-all duration-500 ${
                isPulsing
                  ? "bg-amber-100 dark:bg-amber-900/30"
                  : "bg-[var(--background)] hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-base">
                      {row.symbol}
                    </span>
                    {isAdmin && row.inUse && (
                      <span className="px-2 py-0.5 text-[11px] rounded-full border">
                        In use
                      </span>
                    )}
                  </div>
                  <div className="text-sm opacity-80">{row.name}</div>
                </div>

                {isAdmin ? (
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={row.enabled}
                      onChange={(e) => onToggle?.(row, e.target.checked)}
                      className="h-4 w-4 accent-[var(--primary)]"
                      aria-label={`Toggle ${row.symbol}`}
                    />
                    <span className="opacity-80 text-sm">
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

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border p-2">
                  <div className="opacity-70">Exchange</div>
                  <div>{row.exchange}</div>
                </div>
                <div className="rounded-xl border p-2">
                  <div className="opacity-70">Currency</div>
                  <div>{row.currency}</div>
                </div>

                {isMarket && (
                  <>
                    <div className="rounded-xl border p-2">
                      <div className="opacity-70">Last</div>
                      <div
                        className={`font-mono transition-all duration-300 ${
                          isPulsing
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-amber-500"
                        }`}
                      >
                        {p.last !== undefined ? `$${p.last.toFixed(2)}` : "—"}
                      </div>
                    </div>
                    <div className="rounded-xl border p-2">
                      <div className="opacity-70">% Chg</div>
                      <div
                        className={`${pcClass} font-mono transition-all duration-300`}
                      >
                        {p.percentChange !== undefined
                          ? (() => {
                              if (roundedPc === 0) return "0.00%";
                              return `${
                                roundedPc > 0 ? "+" : ""
                              }${roundedPc.toFixed(2)}%`;
                            })()
                          : "—"}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
