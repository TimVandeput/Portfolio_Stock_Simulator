"use client";

import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";
import type { Price } from "@/types/prices";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import TableHeader from "@/components/ui/TableHeader";
import DynamicIcon from "@/components/ui/DynamicIcon";
import type {
  SymbolsTableDesktopProps,
  Mode,
  TableColumn,
} from "@/types/components";

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
      <TableHeader columns={getColumns()} />

      <div className="neu-card hidden md:block rounded-2xl overflow-hidden border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed">
            <colgroup>{colEls}</colgroup>

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
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-amber-500"
                          }`}
                        >
                          {p.last !== undefined ? `$${p.last.toFixed(2)}` : "—"}
                        </td>
                        <td
                          className={`px-4 py-3 whitespace-nowrap font-mono text-right transition-all duration-300 ${pcClass}`}
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

                    <td className="px-4 py-3">
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
    </div>
  );
}
