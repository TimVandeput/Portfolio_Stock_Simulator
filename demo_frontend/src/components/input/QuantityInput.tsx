"use client";

import NeumorphicInput from "@/components/input/NeumorphicInput";
import type { QuantityInputProps } from "@/types/components";

export default function QuantityInput({
  quantity,
  onQuantityChange,
  onSetMaxAffordable,
  walletLoading,
  walletBalance,
  lastPrice,
}: QuantityInputProps) {
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
          disabled={walletLoading || !walletBalance || lastPrice <= 0}
        >
          Max
        </button>
      </div>
    </div>
  );
}
