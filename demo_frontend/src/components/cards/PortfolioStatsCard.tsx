"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { PortfolioStatsCardProps } from "@/types/components";

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
          className="text-[var(--accent)]"
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
