"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";

interface ValidationMessagesProps {
  canAfford: boolean;
  totalCost: number;
  walletLoading: boolean;
  lastPrice: number;
}

export default function ValidationMessages({
  canAfford,
  totalCost,
  walletLoading,
  lastPrice,
}: ValidationMessagesProps) {
  return (
    <>
      {!canAfford && totalCost > 0 && !walletLoading && (
        <div className="flex items-center gap-2 text-sm text-rose-500">
          <DynamicIcon iconName="alertcircle" size={16} />
          Insufficient funds
        </div>
      )}

      {lastPrice <= 0 && (
        <div className="flex items-center gap-2 text-sm text-amber-500">
          <DynamicIcon iconName="alertcircle" size={16} />
          Price data unavailable
        </div>
      )}
    </>
  );
}
