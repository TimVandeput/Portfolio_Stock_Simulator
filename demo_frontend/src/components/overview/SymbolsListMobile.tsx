/**
 * @fileoverview Mobile-optimized symbols list component for stock market data display
 *
 * This component provides a comprehensive mobile interface for displaying stock symbols
 * with real-time pricing, interactive controls, and adaptive functionality for both
 * administrative and market modes. Features include responsive card layouts, live price
 * updates, and seamless integration with trading workflows.
 */

"use client";

import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";
import type { Price } from "@/types/prices";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import type { BaseComponentProps, Mode } from "@/types/components";

/**
 * Props interface for SymbolsListMobile component configuration
 * @interface SymbolsListMobileProps
 * @extends {BaseComponentProps}
 */
export interface SymbolsListMobileProps extends BaseComponentProps {
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
 * Mobile-optimized symbols list component for stock market data display
 *
 * @remarks
 * The SymbolsListMobile component delivers comprehensive mobile stock symbol display with the following features:
 *
 * **Mobile Optimization:**
 * - Card-based layout optimized for touch interactions
 * - Responsive design with md:hidden for mobile-only display
 * - Touch-friendly button sizing and spacing
 * - Swipe-friendly list navigation
 *
 * **Dual Mode Support:**
 * - Administrative mode with enable/disable toggles
 * - Market mode with buy buttons and price displays
 * - Conditional rendering based on mode selection
 * - Role-specific functionality and controls
 *
 * **Real-Time Price Display:**
 * - Live price updates with visual feedback
 * - Percentage change indicators with color coding
 * - Pulsing animations for active price updates
 * - Recent update highlighting with timing logic
 *
 * **Interactive Features:**
 * - Toggle switches for admin symbol management
 * - Buy buttons for market trading actions
 * - Hover effects and smooth transitions
 * - Visual feedback for all user interactions
 *
 * **Data Presentation:**
 * - Symbol name and ticker display
 * - Exchange and currency information
 * - Last price and percentage change
 * - Status indicators for symbol usage
 *
 * **Visual Design:**
 * - Neumorphic card styling with subtle shadows
 * - Color-coded price changes (green/red/neutral)
 * - Professional grid layout for financial data
 * - Consistent spacing and typography
 *
 * **Accessibility:**
 * - ARIA labels for interactive elements
 * - Semantic HTML structure for screen readers
 * - Clear visual hierarchies and contrast
 * - Touch-accessible controls and sizing
 *
 * @param props - Configuration object for mobile symbols list
 * @returns SymbolsListMobile component with responsive stock display
 *
 * @example
 * ```tsx
 * // Basic market mode symbols list
 * <SymbolsListMobile
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
 * // Admin mode with symbol management
 * <SymbolsListMobile
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
 * // Full-featured market display with real-time updates
 * function MobileMarketView() {
 *   const { data: symbolsPage } = useSymbols();
 *   const { prices, pulsatingSymbols } = usePriceStream();
 *   const navigate = useRouter();
 *
 *   const handleBuyAction = (symbol: SymbolDTO) => {
 *     navigate.push(`/market/${symbol.symbol}`);
 *   };
 *
 *   return (
 *     <SymbolsListMobile
 *       page={symbolsPage}
 *       mode="market"
 *       prices={prices}
 *       pulsatingSymbols={pulsatingSymbols}
 *       onBuy={handleBuyAction}
 *     />
 *   );
 * }
 * ```
 */
export default function SymbolsListMobile({
  page,
  mode,
  onToggle,
  prices,
  pulsatingSymbols = new Set(),
  onBuy,
}: SymbolsListMobileProps) {
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
        {page.content.map((row: SymbolDTO) => {
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
              className="neu-card rounded-2xl border shadow-sm p-4 transition-all duration-500 bg-[var(--background)] hover:shadow-md"
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
                    <div
                      className={`rounded-xl border p-2 transition-all duration-500 ${
                        isPulsing ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <div className="opacity-70">Last</div>
                      <div
                        className={`font-mono transition-all duration-500 ${
                          isPulsing
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-amber-500"
                        }`}
                      >
                        {p.last !== undefined ? `$${p.last.toFixed(2)}` : "—"}
                      </div>
                    </div>
                    <div
                      className={`rounded-xl border p-2 transition-all duration-500 ${
                        isPulsing ? "bg-blue-50 dark:bg-blue-900/20" : ""
                      }`}
                    >
                      <div className="opacity-70">% Chg</div>
                      <div
                        className={`${pcClass} font-mono transition-all duration-500`}
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
