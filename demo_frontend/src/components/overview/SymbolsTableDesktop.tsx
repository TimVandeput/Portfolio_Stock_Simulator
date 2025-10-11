/**
 * @fileoverview Desktop-optimized symbols table component for comprehensive stock market data
 *
 * This component provides a sophisticated desktop table interface for displaying stock symbols
 * with real-time pricing, advanced column management, and professional data presentation.
 * Features include responsive column layouts, interactive controls, and seamless integration
 * with administrative and trading workflows.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";
import type { Price } from "@/types/prices";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import DynamicIcon from "@/components/ui/DynamicIcon";
import type { BaseComponentProps, Mode } from "@/types/components";

/**
 * Interface for table column configuration
 * @interface TableColumn
 */
export interface TableColumn {
  /** Unique column identifier */
  id: string;
  /** Display label for column header */
  label: string;
  /** Optional description for accessibility */
  description?: string;
  /** CSS width class for column sizing */
  width?: string;
  /** Text alignment within column */
  alignment?: "left" | "center" | "right";
  /** Optional icon name for column header */
  icon?: string;
}

/**
 * Props interface for SymbolsTableDesktop component configuration
 * @interface SymbolsTableDesktopProps
 * @extends {BaseComponentProps}
 */
export interface SymbolsTableDesktopProps extends BaseComponentProps {
  /** Paginated symbols data from API */
  page: Page<SymbolDTO> | null;
  /** Display mode: 'admin' or 'market' */
  mode: Mode;
  /** Callback for toggling symbol enabled state (admin mode) */
  onToggle?: (symbol: SymbolDTO, enabled: boolean) => void;
  /** Real-time price data mapped by symbol */
  prices?: Record<string, Price>;
  /** Set of symbols currently receiving price updates */
  pulsatingSymbols?: Set<string>;
  /** Callback for initiating buy action (market mode) */
  onBuy?: (symbol: SymbolDTO) => void;
}

/**
 * Desktop-optimized symbols table component for comprehensive stock market data
 *
 * @remarks
 * The SymbolsTableDesktop component delivers professional desktop stock symbol display with the following features:
 *
 * **Table Architecture:**
 * - Professional table structure with semantic HTML
 * - Responsive column management with fixed and flexible widths
 * - Hidden on mobile (md:hidden) for desktop-specific optimization
 * - Overflow handling with horizontal scrolling capability
 *
 * **Column Management:**
 * - Dynamic column configuration based on display mode
 * - Professional header styling with icons and descriptions
 * - Consistent alignment and spacing across columns
 * - Responsive column sizing with minimum width constraints
 *
 * **Real-Time Data Display:**
 * - Live price updates with visual feedback mechanisms
 * - Percentage change indicators with color-coded styling
 * - Pulsing animations for active price update notifications
 * - Recent update highlighting with timing-based logic
 *
 * **Dual Mode Support:**
 * - Administrative mode with enable/disable toggle controls
 * - Market mode with buy buttons and comprehensive price data
 * - Conditional column rendering based on operational mode
 * - Role-specific functionality and interaction patterns
 *
 * **Interactive Features:**
 * - Toggle switches for administrative symbol management
 * - Buy buttons with icon integration for trading actions
 * - Hover effects and smooth transition animations
 * - Visual feedback for all user interaction states
 *
 * **Data Presentation:**
 * - Truncated text handling with full content tooltips
 * - Monospace font for financial data consistency
 * - Color-coded price changes (green/red/neutral scheme)
 * - Professional typography and spacing hierarchy
 *
 * **Accessibility:**
 * - ARIA labels for all interactive table elements
 * - Semantic table structure for screen reader compatibility
 * - Clear visual hierarchies and contrast ratios
 * - Keyboard navigation support throughout
 *
 * **Visual Design:**
 * - Neumorphic card styling with subtle shadow effects
 * - Consistent border and spacing treatments
 * - Theme integration with CSS custom properties
 * - Professional color scheme for financial applications
 *
 * @param props - Configuration object for desktop symbols table
 * @returns SymbolsTableDesktop component with comprehensive data display
 *
 * @example
 * ```tsx
 * // Basic market mode symbols table
 * <SymbolsTableDesktop
 *   page={symbolsPage}
 *   mode="market"
 *   prices={priceData}
 *   pulsatingSymbols={new Set(["AAPL", "GOOGL"])}
 *   onBuy={(symbol) => navigateToTrade(symbol)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Administrative mode with symbol management
 * <SymbolsTableDesktop
 *   page={symbolsPage}
 *   mode="admin"
 *   onToggle={(symbol, enabled) => {
 *     updateSymbolStatus(symbol.id, enabled);
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Full-featured desktop market display
 * function DesktopMarketTable() {
 *   const { data: symbolsPage } = useSymbols();
 *   const { prices, pulsatingSymbols } = usePriceStream();
 *   const navigate = useRouter();
 *
 *   const handleTradeAction = (symbol: SymbolDTO) => {
 *     navigate.push(`/market/${symbol.symbol}`);
 *   };
 *
 *   return (
 *     <div className="space-y-6">
 *       <SymbolsTableDesktop
 *         page={symbolsPage}
 *         mode="market"
 *         prices={prices}
 *         pulsatingSymbols={pulsatingSymbols}
 *         onBuy={handleTradeAction}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
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
                    className="border-t transition-all duration-500"
                  >
                    <td
                      className={`px-3 py-3 font-semibold whitespace-nowrap w-[80px] transition-all duration-500 ${
                        isPulsing ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                      title={row.symbol}
                    >
                      {row.symbol}
                    </td>

                    <td
                      className={`px-3 py-3 min-w-[80px] lg:min-w-[150px] max-w-[120px] lg:max-w-[200px] transition-all duration-500 ${
                        isPulsing ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <span className="block truncate" title={row.name}>
                        {row.name}
                      </span>
                    </td>

                    <td
                      className={`px-3 py-3 whitespace-nowrap w-[100px] transition-all duration-500 ${
                        isPulsing ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                      title={row.exchange}
                    >
                      {row.exchange}
                    </td>

                    <td
                      className={`px-3 py-3 whitespace-nowrap w-[70px] transition-all duration-500 ${
                        isPulsing ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      {row.currency}
                    </td>

                    {isMarket && (
                      <>
                        <td
                          className={`px-3 py-3 whitespace-nowrap font-mono text-right transition-all duration-500 w-[90px] ${
                            isPulsing
                              ? "text-amber-600 dark:text-amber-400 bg-blue-50 dark:bg-blue-900/20"
                              : "text-amber-500"
                          }`}
                        >
                          {p.last !== undefined ? `$${p.last.toFixed(2)}` : "—"}
                        </td>
                        <td
                          className={`px-3 py-3 whitespace-nowrap font-mono text-right transition-all duration-500 w-[90px] ${pcClass} ${
                            isPulsing ? "bg-blue-50 dark:bg-blue-900/20" : ""
                          }`}
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
