/**
 * @fileoverview Portfolio statistics display card component for financial metrics.
 *
 * This module provides a specialized statistics card component designed for
 * displaying portfolio financial metrics, performance indicators, and key
 * statistics within the Stock Simulator platform. It combines iconography,
 * numerical values, and accessibility features for comprehensive financial
 * data presentation.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the PortfolioStatsCard component.
 * @interface PortfolioStatsCardProps
 * @extends BaseComponentProps
 */
export interface PortfolioStatsCardProps extends BaseComponentProps {
  /** Title or label for the statistic being displayed */
  title: string;
  /** Primary value to display (typically formatted currency or percentage) */
  value: string;
  /** Optional secondary value or additional context information */
  subValue?: string;
  /** Icon name for visual representation of the statistic type */
  iconName: string;
  /** Optional CSS class or color for value text styling */
  valueColor?: string;
  /** Accessibility label for screen readers */
  ariaLabel?: string;
  /** Tooltip text for additional context or explanation */
  tooltip?: string;
}

/**
 * Portfolio statistics display card with financial metrics and visual indicators.
 *
 * This specialized card component provides a professional way to display
 * portfolio financial metrics, performance indicators, and key statistics
 * within the Stock Simulator platform. It features customizable iconography,
 * flexible value formatting, accessibility compliance, and visual theming
 * for comprehensive financial data presentation.
 *
 * @remarks
 * The component delivers professional financial data presentation through:
 *
 * **Financial Data Display**:
 * - **Primary Values**: Prominently displayed main statistics or metrics
 * - **Secondary Values**: Additional context or supplementary information
 * - **Currency Formatting**: Optimized for financial value presentation
 * - **Percentage Display**: Supports performance percentages and ratios
 *
 * **Visual Design Elements**:
 * - **Contextual Icons**: Financial icons representing different metric types
 * - **Color Coding**: Customizable value colors for positive/negative indicators
 * - **Typography Hierarchy**: Clear distinction between titles and values
 * - **Neumorphic Styling**: Consistent card design with platform aesthetics
 *
 * **Accessibility Integration**:
 * - **ARIA Labels**: Comprehensive accessibility labels for screen readers
 * - **Tooltip Support**: Additional context through hover tooltips
 * - **Semantic Structure**: Proper HTML structure for assistive technologies
 * - **Screen Reader Optimization**: Descriptive content for financial data
 *
 * **Metric Type Support**:
 * - **Portfolio Value**: Total portfolio worth and market value
 * - **Gain/Loss Metrics**: Performance indicators with color coding
 * - **Cash Balances**: Available funds and liquidity metrics
 * - **Statistical Data**: Various financial ratios and calculations
 *
 * **Theming and Customization**:
 * - **Icon Selection**: Flexible icon choices for different metric types
 * - **Color Theming**: CSS custom properties for consistent theming
 * - **Value Formatting**: Supports various number formats and currencies
 * - **Layout Flexibility**: Adapts to different content lengths and types
 *
 * **Use Case Applications**:
 * - **Portfolio Dashboards**: Key financial metrics overview
 * - **Performance Tracking**: Investment performance indicators
 * - **Balance Displays**: Cash and asset balance presentations
 * - **Statistics Panels**: Comprehensive financial data summaries
 *
 * **Interactive Features**:
 * - **Hover Effects**: Visual feedback for interactive elements
 * - **Tooltip Integration**: Contextual help and explanations
 * - **Accessibility Focus**: Keyboard navigation and screen reader support
 * - **Responsive Design**: Mobile-optimized layouts and interactions
 *
 * **Data Visualization**:
 * - **Value Emphasis**: Bold typography for important financial figures
 * - **Status Indicators**: Color-coded values for performance status
 * - **Icon Context**: Visual symbols for quick metric identification
 * - **Hierarchical Layout**: Clear information architecture
 *
 * The component serves as a fundamental building block for financial
 * dashboards and portfolio interfaces, providing users with clear,
 * accessible, and visually appealing presentation of their financial
 * data within the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic portfolio stats card usage
 * function PortfolioDashboard() {
 *   const portfolioStats = {
 *     totalValue: 125432.50,
 *     gainLoss: 8432.25,
 *     gainLossPercent: 7.2,
 *     cashBalance: 15000.00
 *   };
 *
 *   return (
 *     <div className="stats-grid">
 *       <PortfolioStatsCard
 *         title="Total Portfolio"
 *         value={`$${portfolioStats.totalValue.toFixed(2)}`}
 *         iconName="briefcase"
 *         ariaLabel="Total portfolio value"
 *         tooltip="Combined value of all holdings and cash"
 *       />
 *
 *       <PortfolioStatsCard
 *         title="Total Gain/Loss"
 *         value={`${portfolioStats.gainLoss >= 0 ? '+' : ''}$${portfolioStats.gainLoss.toFixed(2)}`}
 *         subValue={`(${portfolioStats.gainLossPercent >= 0 ? '+' : ''}${portfolioStats.gainLossPercent.toFixed(2)}%)`}
 *         iconName="trending-up"
 *         valueColor={portfolioStats.gainLoss >= 0 ? "text-green-500" : "text-red-500"}
 *         ariaLabel="Portfolio performance"
 *         tooltip="Total profit or loss since initial investment"
 *       />
 *     </div>
 *   );
 * }
 *
 * // Statistics card with conditional styling
 * function PerformanceMetrics() {
 *   const performance = { value: -1234.56, percentage: -2.8 };
 *   const isPositive = performance.value >= 0;
 *
 *   return (
 *     <PortfolioStatsCard
 *       title="Daily Change"
 *       value={`${isPositive ? '+' : ''}$${Math.abs(performance.value).toFixed(2)}`}
 *       subValue={`(${isPositive ? '+' : ''}${performance.percentage.toFixed(2)}%)`}
 *       iconName={isPositive ? "trending-up" : "trending-down"}
 *       valueColor={isPositive ? "text-emerald-500" : "text-rose-500"}
 *       ariaLabel="Daily portfolio change"
 *       tooltip="Portfolio value change since market open"
 *     />
 *   );
 * }
 * ```
 *
 * @param props - Component properties for portfolio statistics display and styling
 * @returns A portfolio statistics card with financial metrics, visual indicators,
 * and comprehensive accessibility support for professional financial data presentation
 *
 * @see {@link DynamicIcon} - Icon component for visual metric representation
 * @see {@link BaseComponentProps} - Base properties interface for components
 *
 * @public
 */
export default function PortfolioStatsCard({
  title,
  value,
  subValue,
  iconName,
  valueColor,
  ariaLabel,
  tooltip,
}: PortfolioStatsCardProps) {
  return (
    <div
      className="neu-card p-4 rounded-xl"
      aria-label={ariaLabel}
      title={tooltip}
    >
      <div className="flex items-center gap-2 mb-1">
        <DynamicIcon
          iconName={iconName}
          size={16}
          className="text-[var(--text-accent)]"
        />
        <p className="text-sm text-[var(--text-secondary)]">{title}</p>
      </div>
      <p
        className={`text-lg font-bold ${
          valueColor || "text-[var(--text-primary)]"
        }`}
      >
        {value}
        {subValue && <span className="text-sm ml-1">{subValue}</span>}
      </p>
    </div>
  );
}
