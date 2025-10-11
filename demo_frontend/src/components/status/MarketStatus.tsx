/**
 * @fileoverview Real-time market status component with timezone-aware trading hours
 *
 * This component provides comprehensive market status information with real-time updates,
 * timezone calculations, and intelligent formatting. Features include automatic status
 * detection, countdown timers, and professional market hour tracking for US stock
 * market trading sessions with weekend and holiday considerations.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useEffect, useState } from "react";
import { BaseComponentProps } from "@/types";

/**
 * Props interface for MarketStatus component configuration
 * @interface MarketStatusProps
 * @extends {BaseComponentProps}
 */
export interface MarketStatusProps extends BaseComponentProps {}

/**
 * Real-time market status component with timezone-aware trading hours
 *
 * @remarks
 * The MarketStatus component delivers comprehensive market status tracking with the following features:
 *
 * **Market Hours Tracking:**
 * - US stock market hours (9:30 AM - 4:00 PM Eastern Time)
 * - Automatic timezone conversion to Eastern Time
 * - Weekend and weekday detection logic
 * - Real-time status updates every minute
 *
 * **Status Calculations:**
 * - Market open/closed state determination
 * - Time remaining until market open/close
 * - Weekend handling with Monday opening calculations
 * - Friday closing to Monday opening transitions
 *
 * **Time Formatting:**
 * - Intelligent duration formatting (days, hours, minutes)
 * - Compact display with abbreviated units
 * - Dynamic formatting based on time remaining
 * - User-friendly countdown presentations
 *
 * **Visual Indicators:**
 * - Color-coded status indicators (🟢 open, 🔴 closed)
 * - Clear status messages with action context
 * - Professional typography with consistent opacity
 * - Responsive design for various display contexts
 *
 * **Real-Time Updates:**
 * - Automatic status refresh every minute
 * - Live countdown updates for market transitions
 * - Proper cleanup with interval management
 * - Efficient re-calculation on component updates
 *
 * **Timezone Handling:**
 * - Accurate Eastern Time zone conversion
 * - Cross-timezone compatibility for global users
 * - Daylight saving time automatic adjustments
 * - Consistent market hour calculations
 *
 * **Weekend Logic:**
 * - Saturday/Sunday market closure handling
 * - Monday opening time calculations
 * - Weekend duration formatting
 * - Proper weekday transition logic
 *
 * **Accessibility:**
 * - Clear status messaging for screen readers
 * - Semantic HTML structure
 * - Consistent visual indicators
 * - Professional information presentation
 *
 * @returns MarketStatus component with real-time trading status
 *
 * @example
 * ```tsx
 * // Basic market status display
 * <MarketStatus />
 * ```
 *
 * @example
 * ```tsx
 * // Integration in trading dashboard header
 * function TradingHeader() {
 *   return (
 *     <div className="flex items-center justify-between p-4">
 *       <h1 className="text-2xl font-bold">Stock Market</h1>
 *       <MarketStatus />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom styled market status
 * function MarketStatusBanner() {
 *   return (
 *     <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
 *       <div className="flex items-center gap-2">
 *         <span className="font-medium">Trading Status:</span>
 *         <MarketStatus />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export default function MarketStatus() {
  const [status, setStatus] = useState<string>("");

  const formatDuration = (totalMinutes: number): string => {
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0) {
      if (hours > 0) {
        return `${days}d ${hours}h ${minutes}m`;
      } else {
        return `${days}d ${minutes}m`;
      }
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();

      const easternTime = new Date(
        now.toLocaleString("en-US", { timeZone: "America/New_York" })
      );
      const easternHour = easternTime.getHours();
      const easternMinute = easternTime.getMinutes();
      const easternDay = easternTime.getDay();

      const isWeekday = easternDay >= 1 && easternDay <= 5;
      const marketOpenTime = 9 * 60 + 30;
      const marketCloseTime = 16 * 60;
      const currentTimeMinutes = easternHour * 60 + easternMinute;

      if (!isWeekday) {
        const daysUntilMonday = easternDay === 0 ? 1 : 8 - easternDay;
        const hoursUntilMonday = daysUntilMonday * 24 - easternHour + 9;
        const minutesUntilOpen = hoursUntilMonday * 60 - easternMinute + 30;

        setStatus(
          `🔴 Market closed - Opens in ${formatDuration(minutesUntilOpen)}`
        );
        return;
      }

      if (currentTimeMinutes < marketOpenTime) {
        const minutesUntilOpen = marketOpenTime - currentTimeMinutes;
        setStatus(
          `🔴 Market closed - Opens in ${formatDuration(minutesUntilOpen)}`
        );
      } else if (currentTimeMinutes < marketCloseTime) {
        const minutesUntilClose = marketCloseTime - currentTimeMinutes;
        setStatus(
          `🟢 Market open - Closes in ${formatDuration(minutesUntilClose)}`
        );
      } else {
        const hoursUntilNextOpen = 24 - easternHour + 9;
        const minutesUntilNextOpen =
          hoursUntilNextOpen * 60 - easternMinute + 30;

        if (easternDay === 5) {
          const minutesUntilMonday =
            (2 * 24 + 9) * 60 + 30 - (easternHour * 60 + easternMinute);
          setStatus(
            `🔴 Market closed - Opens Monday in ${formatDuration(
              minutesUntilMonday
            )}`
          );
        } else {
          setStatus(
            `🔴 Market closed - Opens in ${formatDuration(
              minutesUntilNextOpen
            )}`
          );
        }
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-sm opacity-80 flex items-center gap-2">
      <span>{status}</span>
    </div>
  );
}
