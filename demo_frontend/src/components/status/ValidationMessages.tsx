"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { BaseComponentProps } from "@/types/components";

export interface ValidationMessagesProps extends BaseComponentProps {
  canAfford: boolean;
  totalCost: number;
  walletLoading: boolean;
  lastPrice: number;
  success?: string;
  loading?: boolean;
}

export default function ValidationMessages({
  canAfford,
  totalCost,
  walletLoading,
  lastPrice,
  success,
  loading,
}: ValidationMessagesProps) {
  return (
    <>
      {!canAfford &&
        totalCost > 0 &&
        !walletLoading &&
        !success &&
        !loading && (
          <div className="flex items-center gap-2 text-sm text-rose-500">
            <DynamicIcon iconName="alertcircle" size={16} />
            Insufficient funds
          </div>
        )}

      {lastPrice <= 0 && !success && !loading && (
        <div className="flex items-center gap-2 text-sm text-amber-500">
          <DynamicIcon iconName="alertcircle" size={16} />
          Price data unavailable
        </div>
      )}
    </>
  );
}
