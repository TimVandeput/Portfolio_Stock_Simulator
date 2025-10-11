/**
 * @fileoverview TimeRangeSelector component for financial chart time period controls
 *
 * This component provides an intuitive interface for selecting time ranges for financial
 * charts and data visualization. Features responsive button groups, active state management,
 * and seamless integration with chart components for dynamic data filtering and display.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { BaseComponentProps } from "@/types";

/**
 * Props interface for TimeRangeSelector component configuration
 * @interface TimeRangeSelectorProps
 * @extends {BaseComponentProps}
 */
export interface TimeRangeSelectorProps extends BaseComponentProps {
  /** Currently selected time range value */
  selectedRange: string;
  /** Callback function when time range selection changes */
  onRangeChange: (range: string) => void;
  /** Additional CSS classes for styling customization */
  className?: string;
}

/**
 * Interface for time range option configuration
 * @interface TimeRangeOption
 */
export interface TimeRangeOption {
  /** Internal value used for API calls and data filtering */
  value: string;
  /** Display label shown to users */
  label: string;
}

/**
 * Available time range options for chart filtering
 */
const timeRanges: TimeRangeOption[] = [
  { value: "1mo", label: "1M" },
  { value: "1y", label: "1Y" },
  { value: "5y", label: "5Y" },
];

/**
 * TimeRangeSelector component for financial chart time period controls
 *
 * @remarks
 * The TimeRangeSelector component provides intuitive time period selection with the following features:
 *
 * **Selection Interface:**
 * - Clean button group design with rounded pill styling
 * - Visual feedback for active selection state
 * - Hover effects for improved user interaction
 * - Responsive spacing and typography
 *
 * **Time Range Options:**
 * - 1 Month (1mo) - Recent short-term price movements
 * - 1 Year (1y) - Medium-term trend analysis
 * - 5 Years (5y) - Long-term historical perspective
 * - Configurable range options for future extensions
 *
 * **State Management:**
 * - Controlled component with external state management
 * - Callback-based range change notifications
 * - Active state persistence across re-renders
 * - Seamless integration with parent components
 *
 * **Visual Design:**
 * - Chip-based styling with theme integration
 * - Selected state highlighting with custom styling
 * - Smooth transitions between selection states
 * - Consistent spacing and alignment
 *
 * **Integration Features:**
 * - Works seamlessly with StockChart component
 * - Compatible with various chart data APIs
 * - Flexible callback system for custom implementations
 * - Responsive design for mobile and desktop
 *
 * **Accessibility:**
 * - Semantic button elements with proper focus states
 * - Clear visual indicators for selected state
 * - Keyboard navigation support
 * - Screen reader friendly labeling
 *
 * @param props - Configuration object for selector behavior
 * @returns TimeRangeSelector component with interactive time period buttons
 *
 * @example
 * ```tsx
 * // Basic time range selector with state management
 * const [selectedRange, setSelectedRange] = useState("1y");
 *
 * <TimeRangeSelector
 *   selectedRange={selectedRange}
 *   onRangeChange={setSelectedRange}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integrated with stock chart component
 * function StockAnalysis({ symbol }: { symbol: string }) {
 *   const [timeRange, setTimeRange] = useState("1y");
 *   const { data: chartData } = useStockData(symbol, timeRange);
 *
 *   return (
 *     <div className="space-y-4">
 *       <div className="flex justify-between items-center">
 *         <h2 className="text-xl font-bold">{symbol}</h2>
 *         <TimeRangeSelector
 *           selectedRange={timeRange}
 *           onRangeChange={setTimeRange}
 *         />
 *       </div>
 *       <StockChart chartData={chartData} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom styled selector with additional ranges
 * <TimeRangeSelector
 *   selectedRange={currentRange}
 *   onRangeChange={(range) => {
 *     setCurrentRange(range);
 *     fetchChartData(symbol, range);
 *   }}
 *   className="justify-center border-t pt-4"
 * />
 * ```
 */
export default function TimeRangeSelector({
  selectedRange,
  onRangeChange,
  className = "",
}: TimeRangeSelectorProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onRangeChange(range.value)}
          className={`px-3 py-1 text-sm rounded-full border transition-colors chip ${
            selectedRange === range.value
              ? "chip-selected"
              : "hover:bg-[var(--surface)]"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
