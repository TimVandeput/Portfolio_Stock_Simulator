"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { EmptyPortfolioProps } from "@/types/components";

export default function EmptyPortfolio({ onViewMarkets }: EmptyPortfolioProps) {
  return (
    <div className="text-center py-12">
      <DynamicIcon
        iconName="briefcase"
        size={48}
        className="mx-auto mb-4 opacity-50"
      />
      <h3 className="text-lg font-medium text-[var(--text-secondary)] mb-2">
        Your Portfolio is Empty
      </h3>
      <p className="text-[var(--text-secondary)] mb-4 max-w-md mx-auto">
        Start investing by purchasing stocks. Your bought stocks will appear
        here with their current values, gains/losses, and performance.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onViewMarkets}
          className="neu-button px-6 py-3 rounded-xl hover:scale-105 transition-transform flex items-center gap-2 bg-[var(--accent)] text-white"
        >
          <DynamicIcon iconName="plus" size={16} />
          Browse Markets
        </button>
        <button
          onClick={onViewMarkets}
          className="neu-button px-6 py-3 rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
        >
          <DynamicIcon iconName="search" size={16} />
          Browse Stocks
        </button>
      </div>
    </div>
  );
}
