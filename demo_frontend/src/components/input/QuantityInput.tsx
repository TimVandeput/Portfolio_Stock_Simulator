"use client";

import NeumorphicInput from "@/components/input/NeumorphicInput";
import type { WalletBalanceResponse } from "@/types/wallet";
import type { BaseComponentProps } from "@/types/components";

export interface QuantityInputProps extends BaseComponentProps {
  quantity: string;
  onQuantityChange: (value: string) => void;
  onSetMaxAffordable: () => void;
  walletLoading: boolean;
  walletBalance: WalletBalanceResponse | null;
  lastPrice: number;
  mode?: "buy" | "sell";
}

export default function QuantityInput({
  quantity,
  onQuantityChange,
  onSetMaxAffordable,
  walletLoading,
  walletBalance,
  lastPrice,
  mode = "buy",
}: QuantityInputProps) {
  const isMaxDisabled =
    mode === "buy"
      ? walletLoading || !walletBalance || lastPrice <= 0
      : walletLoading || lastPrice <= 0;

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
        Quantity (Shares)
      </label>
      <div className="flex gap-2">
        <NeumorphicInput
          type="text"
          value={quantity}
          onChange={onQuantityChange}
          placeholder="Enter quantity"
          className="flex-1"
        />
        <button
          onClick={onSetMaxAffordable}
          className="px-3 py-2 text-sm neu-button rounded-xl hover:scale-105 transition-transform"
          disabled={isMaxDisabled}
        >
          Max
        </button>
      </div>
    </div>
  );
}
