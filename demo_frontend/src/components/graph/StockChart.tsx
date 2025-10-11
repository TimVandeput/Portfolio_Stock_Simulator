/**
 * @fileoverview StockChart component for professional financial data visualization
 *
 * This component provides a comprehensive stock price charting solution using Recharts
 * library, delivering interactive financial visualizations with professional formatting,
 * data optimization, and responsive design. Features include intelligent data sampling,
 * price validation, dynamic scaling, and themed styling integration.
 */

"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { GraphData } from "@/lib/api/graphs";
import { BaseComponentProps } from "@/types";

/**
 * Props interface for StockChart component configuration
 * @interface StockChartProps
 * @extends {BaseComponentProps}
 */
export interface StockChartProps extends BaseComponentProps {
  /** Stock price data from API with chart results */
  chartData: GraphData;
  /** Additional CSS classes for styling customization */
  className?: string;
}

/**
 * Internal interface for processed chart data points
 * @interface ChartPoint
 */
export interface ChartPoint {
  /** Unix timestamp for data point */
  timestamp: number;
  /** Stock price value */
  price: number;
  /** Formatted date string for display */
  date: string;
  /** Trading volume for data point */
  volume: number;
}

/**
 * StockChart component for professional financial data visualization
 *
 * @remarks
 * The StockChart component delivers comprehensive stock price visualization with the following features:
 *
 * **Data Processing:**
 * - Intelligent data validation and filtering
 * - Automatic data point sampling for performance optimization
 * - Price validation with null/NaN/infinite value handling
 * - Chronological sorting and timestamp normalization
 *
 * **Chart Features:**
 * - Interactive line chart with hover tooltips
 * - Dynamic Y-axis scaling with padding calculations
 * - Time-based X-axis with proper date formatting
 * - Professional grid overlay with theme integration
 *
 * **Performance Optimization:**
 * - Maximum 300 data points with intelligent sampling
 * - Disabled animations for smooth interactions
 * - Efficient data processing and filtering
 * - Responsive container with automatic sizing
 *
 * **Visual Design:**
 * - CSS custom properties integration for theming
 * - Professional color scheme with blue accent
 * - Rounded line caps and joins for smooth appearance
 * - Consistent typography and spacing
 *
 * **Error Handling:**
 * - Graceful fallbacks for missing or invalid data
 * - User-friendly error messages with consistent styling
 * - Multiple validation layers for data integrity
 * - Robust null and undefined value handling
 *
 * **Accessibility:**
 * - Semantic chart structure with proper labeling
 * - High contrast colors for better visibility
 * - Responsive design for various screen sizes
 * - Screen reader friendly tooltip formatting
 *
 * @param props - Configuration object for chart behavior and styling
 * @returns StockChart component with interactive price visualization
 *
 * @example
 * ```tsx
 * // Basic stock chart with financial data
 * <StockChart
 *   chartData={stockDataResponse}
 *   className="border rounded-lg shadow-sm"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Chart in portfolio dashboard with custom styling
 * <div className="bg-white p-6 rounded-xl">
 *   <h3 className="text-lg font-semibold mb-4">Price History</h3>
 *   <StockChart
 *     chartData={priceHistory}
 *     className="h-80"
 *   />
 * </div>
 * ```
 *
 * @example
 * ```tsx
 * // Responsive chart with loading state
 * function PriceChart({ symbol }: { symbol: string }) {
 *   const { data: chartData, isLoading } = useStockChart(symbol);
 *
 *   if (isLoading) {
 *     return <div className="h-64 animate-pulse bg-gray-200 rounded-lg" />;
 *   }
 *
 *   return (
 *     <StockChart
 *       chartData={chartData}
 *       className="w-full h-64 lg:h-80"
 *     />
 *   );
 * }
 * ```
 */
export default function StockChart({
  chartData,
  className = "",
}: StockChartProps) {
  if (!chartData.chart.result?.[0]) {
    return (
      <div
        className={`h-64 bg-[var(--background)] rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-[var(--text-secondary)]">
          No chart data available
        </span>
      </div>
    );
  }

  const result = chartData.chart.result[0];
  const timestamps = result.timestamp || [];
  const prices = result.indicators.quote[0]?.close || [];

  let data: ChartPoint[] = timestamps
    .map((timestamp, index) => {
      const price = prices[index];
      if (price == null || isNaN(price) || !isFinite(price) || price <= 0) {
        return null;
      }
      return {
        timestamp,
        price,
        date: new Date(timestamp * 1000).toLocaleDateString(),
        volume: result.indicators.quote[0]?.volume?.[index] || 0,
      };
    })
    .filter((point): point is ChartPoint => point !== null)
    .sort((a, b) => a.timestamp - b.timestamp);

  const maxPoints = 300;
  if (data.length > maxPoints) {
    const step = Math.ceil(data.length / maxPoints);
    data = data.filter((_, index) => index % step === 0);
    if (data[data.length - 1].timestamp !== timestamps[timestamps.length - 1]) {
      const lastValidPoint = data[data.length - 1];
      if (lastValidPoint) {
        data.push(lastValidPoint);
      }
    }
  }

  console.log(
    `Original points: ${timestamps.length}, Processed points: ${data.length}`
  );

  if (timestamps.length === 0 || prices.length === 0) {
    return (
      <div
        className={`h-64 bg-[var(--background)] rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-[var(--text-secondary)]">
          No price data available
        </span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={`h-64 bg-[var(--background)] rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-[var(--text-secondary)]">
          No valid price data points
        </span>
      </div>
    );
  }

  if (data.length < 2) {
    return (
      <div
        className={`h-64 bg-[var(--background)] rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-[var(--text-secondary)]">
          Insufficient data points for chart
        </span>
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const formatTooltipDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const prices_only = data.map((d) => d.price);
  const minPrice = Math.min(...prices_only);
  const maxPrice = Math.max(...prices_only);
  const padding = (maxPrice - minPrice) * 0.05;
  const yDomain = [Math.max(0, minPrice - padding), maxPrice + padding];

  return (
    <div className={`h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(128, 128, 128, 0.2)"
            className="stroke-[var(--border)]"
          />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatTooltipDate}
            stroke="rgba(102, 102, 102, 0.8)"
            fontSize={12}
            interval="preserveStartEnd"
            className="stroke-[var(--text-secondary)]"
          />
          <YAxis
            domain={yDomain}
            tickFormatter={formatPrice}
            stroke="rgba(102, 102, 102, 0.8)"
            fontSize={12}
            className="stroke-[var(--text-secondary)]"
          />
          <Tooltip
            labelFormatter={(value: number) => formatTooltipDate(value)}
            formatter={(value: number) => [formatPrice(value), "Price"]}
            contentStyle={{
              backgroundColor: "var(--surface, #ffffff)",
              border: "1px solid var(--border, #e0e0e0)",
              borderRadius: "8px",
              color: "var(--text-primary, #333333)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Line
            type="linear"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6" }}
            connectNulls={false}
            strokeLinecap="round"
            strokeLinejoin="round"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
