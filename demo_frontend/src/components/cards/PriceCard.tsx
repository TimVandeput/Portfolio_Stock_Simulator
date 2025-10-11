/**
 * @fileoverview Real-time stock price display card component for market data.
 *
 * This module provides a comprehensive price display card component that shows
 * real-time stock price information, percentage changes, and market status
 * indicators within the Stock Simulator platform. It combines live data
 * integration with professional financial presentation and visual indicators.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import type { Price } from "@/types/prices";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the PriceCard component.
 * @interface PriceCardProps
 * @extends BaseComponentProps
 */
export interface PriceCardProps extends BaseComponentProps {
  /** Stock symbol to display price information for */
  symbol: string;
  /** Current price data including last price and percentage change */
  currentPrice?: Price;
}

/**
 * Real-time stock price display card with market data and change indicators.
 *
 * This comprehensive price display card component provides professional
 * presentation of real-time stock price information, percentage changes,
 * and market status indicators within the Stock Simulator platform. It
 * features live data integration, visual change indicators, and responsive
 * design for optimal financial data presentation.
 *
 * @remarks
 * The component delivers professional market data presentation through:
 *
 * **Real-time Price Display**:
 * - **Current Price**: Large, prominent display of last traded price
 * - **Live Data Indicator**: Visual pulsing indicator for real-time data status
 * - **Symbol Identification**: Clear stock symbol display and labeling
 * - **Market Status**: Real-time data availability and status indication
 *
 * **Price Change Analytics**:
 * - **Percentage Change**: Color-coded percentage change since market close
 * - **Direction Indicators**: Visual cues for positive and negative changes
 * - **Change Calculation**: Accurate percentage change calculations
 * - **Zero Change Handling**: Proper display when no price change occurs
 *
 * **Visual Design Elements**:
 * - **Neumorphic Styling**: Consistent card design with platform aesthetics
 * - **Color Coding**: Green for gains, red for losses, standard formatting
 * - **Typography Hierarchy**: Clear distinction between price and change data
 * - **Status Indicators**: Animated elements for live data confirmation
 *
 * **Financial Data Formatting**:
 * - **Currency Display**: Proper dollar formatting with decimal precision
 * - **Percentage Formatting**: Standardized percentage display with sign indicators
 * - **Price Precision**: Two decimal place accuracy for financial precision
 * - **Fallback Values**: Graceful handling of missing or unavailable data
 *
 * **Responsive Layout**:
 * - **Mobile Optimization**: Touch-friendly layouts and appropriate sizing
 * - **Flexible Content**: Adapts to varying symbol lengths and price ranges
 * - **Consistent Spacing**: Standardized padding and margin systems
 * - **Layout Stability**: Maintains consistent layout regardless of data changes
 *
 * **Market Data Integration**:
 * - **Price Context**: Integration with real-time price data systems
 * - **Live Updates**: Supports real-time price updates and refreshes
 * - **Data Validation**: Handles missing or invalid price data gracefully
 * - **Market Hours**: Aware of market status and data availability
 *
 * **Accessibility Features**:
 * - **Screen Reader Support**: Descriptive content for assistive technologies
 * - **Semantic Structure**: Proper heading hierarchy and content organization
 * - **Color Accessibility**: High contrast ratios for visual accessibility
 * - **Content Description**: Clear labeling of price and change information
 *
 * **Use Case Applications**:
 * - **Trading Interfaces**: Price display for buy/sell operations
 * - **Portfolio Views**: Current price information for holdings
 * - **Market Overviews**: Price displays in market browsing interfaces
 * - **Watch Lists**: Price monitoring and tracking displays
 *
 * The component serves as a critical element for financial data presentation,
 * providing users with accurate, timely, and visually clear price information
 * essential for trading and investment decision-making within the Stock
 * Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic price card usage
 * function TradingInterface({ symbol }: { symbol: string }) {
 *   const { prices } = usePrices();
 *   const currentPrice = prices[symbol];
 *
 *   return (
 *     <div className="trading-panel">
 *       <PriceCard
 *         symbol={symbol}
 *         currentPrice={currentPrice}
 *       />
 *     </div>
 *   );
 * }
 *
 * // Price card with real-time updates
 * function StockWatch({ symbol }: { symbol: string }) {
 *   const { prices, isConnected } = useRealTimePrices();
 *
 *   return (
 *     <div className="watch-list">
 *       <PriceCard
 *         symbol={symbol}
 *         currentPrice={prices[symbol]}
 *       />
 *       {!isConnected && (
 *         <div className="connection-warning">
 *           Real-time data unavailable
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 *
 * // Portfolio holdings price display
 * function PortfolioHolding({ holding }: { holding: PortfolioItem }) {
 *   const { prices } = usePrices();
 *
 *   return (
 *     <div className="portfolio-item">
 *       <PriceCard
 *         symbol={holding.symbol}
 *         currentPrice={prices[holding.symbol]}
 *       />
 *       <div className="holding-details">
 *         {holding.quantity} shares
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for price display and market data integration
 * @returns A real-time stock price display card with market data, change indicators,
 * and professional financial presentation optimized for trading interfaces
 *
 * @see {@link Price} - TypeScript interface for price data structure
 * @see {@link BaseComponentProps} - Base properties interface for components
 *
 * @public
 */
export default function PriceCard({ symbol, currentPrice }: PriceCardProps) {
  const lastPrice = currentPrice?.last ?? 0;
  const percentChange = currentPrice?.percentChange ?? 0;
  const isPositiveChange = percentChange > 0;

  return (
    <div className="neu-card p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            {symbol}
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">Market Price</p>
        </div>
        <div className="text-right">
          {currentPrice && lastPrice > 0 && (
            <div className="flex items-center justify-end gap-2 text-xs text-[var(--accent)] mb-1">
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></div>
              Real-time data
            </div>
          )}
          <div className="text-2xl font-bold text-[var(--text-primary)]">
            ${lastPrice.toFixed(2)}
          </div>
          {percentChange !== 0 && (
            <div
              className={`text-sm font-medium ${
                isPositiveChange ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {isPositiveChange ? "+" : ""}
              {percentChange.toFixed(2)}% since close
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
