"use client";

import { useEffect, useState } from "react";

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
