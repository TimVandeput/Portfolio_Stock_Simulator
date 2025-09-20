"use client";

import type { Price } from "@/types/prices";

interface PriceCardProps {
  symbol: string;
  currentPrice?: Price;
}

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
          <p className="text-sm text-[var(--text-secondary)]">Current Price</p>
        </div>
        <div className="text-right">
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
              {percentChange.toFixed(2)}%
            </div>
          )}
        </div>
      </div>

      {currentPrice?.lastUpdate &&
        Date.now() - currentPrice.lastUpdate < 5000 && (
          <div className="flex items-center gap-2 text-xs text-[var(--accent)]">
            <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></div>
            Live Price
          </div>
        )}
    </div>
  );
}
