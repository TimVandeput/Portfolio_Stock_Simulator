"use client";

import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";
import type { Price } from "@/types/prices";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import DynamicIcon from "@/components/ui/DynamicIcon";
import type { BaseComponentProps, Mode } from "@/types/components";

export interface TableColumn {
  id: string;
  label: string;
  description?: string;
  width?: string;
  alignment?: "left" | "center" | "right";
  icon?: string;
}

export interface SymbolsTableDesktopProps extends BaseComponentProps {
  page: Page<SymbolDTO> | null;
  mode: Mode;
  onToggle?: (symbol: SymbolDTO, enabled: boolean) => void;
  prices?: Record<string, Price>;
  pulsatingSymbols?: Set<string>;
  onBuy?: (symbol: SymbolDTO) => void;
}

export default function SymbolsTableDesktop({
  page,
  mode,
  onToggle,
  prices,
  pulsatingSymbols = new Set(),
  onBuy,
}: SymbolsTableDesktopProps) {
  const isAdmin = mode === "admin";
  const isMarket = mode === "market";

  const getPrice = (sym: string): Price => prices?.[sym] ?? {};
  const colCount = isMarket ? 7 : 5;

  const isRecentUpdate = (price: Price): boolean => {
    if (!price.lastUpdate) return false;
    return Date.now() - price.lastUpdate < 2000;
  };

  const getColumns = (): TableColumn[] => {
    const baseColumns: TableColumn[] = [
      {
        id: "symbol",
        label: "Symbol",
        description: "Stock ticker symbol",
        width: "w-[10ch]",
      },
      {
        id: "name",
        label: "Name",
        description: "Company name",
        alignment: "left",
      },
      {
        id: "exchange",
        label: "Exchange",
        description: "Stock exchange",
        icon: "arrow-left-right",
        width: "w-[14ch]",
      },
      {
        id: "currency",
        label: "Currency",
        description: "Trading currency",
        icon: "coins",
        width: "w-[9ch]",
      },
    ];

    if (isMarket) {
      baseColumns.push(
        {
          id: "last",
          label: "Last",
          description: "Current price",
          alignment: "right",
          icon: "dollar-sign",
          width: "w-[12ch]",
        },
        {
          id: "change",
          label: "% Chg",
          description: "Percentage change",
          alignment: "right",
          icon: "percent",
          width: "w-[12ch]",
        }
      );
    }

    baseColumns.push({
      id: "actions",
      label: isAdmin ? "Enabled" : "Actions",
      description: isAdmin ? "Toggle availability" : "Trading actions",
      alignment: "center",
      icon: isAdmin ? undefined : "play",
      width: "w-[18ch]",
    });

    return baseColumns;
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
    <div className="space-y-4">
      <div className="neu-card hidden md:block rounded-2xl overflow-hidden border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead className="border-b border-[var(--accent)]/20">
              <tr>
                <th className="px-3 py-3 text-left text-sm font-medium text-[var(--text-primary)] w-[80px]">
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap">Symbol</span>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-sm font-medium text-[var(--text-primary)] min-w-[80px] lg:min-w-[150px]">
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap">Name</span>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-sm font-medium text-[var(--text-primary)] w-[100px]">
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap">Exchange</span>
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-sm font-medium text-[var(--text-primary)] w-[70px]">
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap">Currency</span>
                  </div>
                </th>
                {isMarket && (
                  <>
                    <th className="px-3 py-3 text-right text-sm font-medium text-[var(--text-primary)] w-[90px]">
                      <div className="flex items-center justify-end gap-2">
                        <span className="whitespace-nowrap">Last</span>
                      </div>
                    </th>
                    <th className="px-3 py-3 text-right text-sm font-medium text-[var(--text-primary)] w-[90px]">
                      <div className="flex items-center justify-end gap-2">
                        <span className="whitespace-nowrap">% Chg</span>
                      </div>
                    </th>
                  </>
                )}
                <th className="px-3 py-3 text-center text-sm font-medium text-[var(--text-primary)] w-[120px]">
                  <div className="flex items-center justify-center gap-2">
                    <span className="whitespace-nowrap">
                      {isAdmin ? "Enabled" : "Actions"}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {page?.content?.length === 0 && (
                <tr>
                  <td
                    colSpan={colCount}
                    className="px-4 py-6 text-center opacity-70 border-t"
                  >
                    No symbols found.
                  </td>
                </tr>
              )}

              {page?.content?.map((row: SymbolDTO) => {
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
                  <tr
                    key={row.id}
                    className={`border-t transition-all duration-500 ${
                      isPulsing ? "bg-amber-100 dark:bg-amber-900/30" : ""
                    }`}
                  >
                    <td
                      className="px-3 py-3 font-semibold whitespace-nowrap w-[80px]"
                      title={row.symbol}
                    >
                      {row.symbol}
                    </td>

                    <td className="px-3 py-3 min-w-[80px] lg:min-w-[150px] max-w-[120px] lg:max-w-[200px]">
                      <span className="block truncate" title={row.name}>
                        {row.name}
                      </span>
                    </td>

                    <td
                      className="px-3 py-3 whitespace-nowrap w-[100px]"
                      title={row.exchange}
                    >
                      {row.exchange}
                    </td>

                    <td className="px-3 py-3 whitespace-nowrap w-[70px]">
                      {row.currency}
                    </td>

                    {isMarket && (
                      <>
                        <td
                          className={`px-3 py-3 whitespace-nowrap font-mono text-right transition-all duration-300 w-[90px] ${
                            isPulsing
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-amber-500"
                          }`}
                        >
                          {p.last !== undefined ? `$${p.last.toFixed(2)}` : "—"}
                        </td>
                        <td
                          className={`px-3 py-3 whitespace-nowrap font-mono text-right transition-all duration-300 w-[90px] ${pcClass}`}
                          title={pc !== 0 ? `${pc}%` : undefined}
                        >
                          {p.percentChange !== undefined
                            ? (() => {
                                if (roundedPc === 0) return "0.00%";
                                return `${
                                  roundedPc > 0 ? "+" : ""
                                }${roundedPc.toFixed(2)}%`;
                              })()
                            : "—"}
                        </td>
                      </>
                    )}

                    <td className="px-3 py-3 w-[120px]">
                      <div className="flex items-center justify-center gap-2">
                        {isAdmin && row.inUse && (
                          <span className="px-2 py-0.5 text-[11px] rounded-full border flex items-center gap-1">
                            <DynamicIcon iconName="user-check" size={12} />
                            In use
                          </span>
                        )}

                        {isAdmin ? (
                          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={row.enabled}
                              onChange={(e) =>
                                onToggle?.(row, e.target.checked)
                              }
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
                            className="flex items-center gap-2"
                          >
                            <DynamicIcon
                              iconName="plus-circle"
                              size={16}
                              className="text-[var(--text-accent)]"
                            />
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
    </div>
  );
}
