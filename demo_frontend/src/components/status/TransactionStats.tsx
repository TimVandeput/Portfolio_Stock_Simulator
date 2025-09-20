"use client";

import type { Transaction } from "@/types/trading";
import DynamicIcon from "@/components/ui/DynamicIcon";

interface TransactionStatsProps {
  transactions: Transaction[];
}

export default function TransactionStats({
  transactions,
}: TransactionStatsProps) {
  const totalTransactions = transactions.length;
  const buyOrders = transactions.filter((t) => t.type === "BUY").length;
  const sellOrders = transactions.filter((t) => t.type === "SELL").length;

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
      <div className="flex items-center gap-2">
        <DynamicIcon iconName="receipt" size={14} className="text-blue-500" />
        <span className="text-[var(--text-secondary)]">Total:</span>
        <span className="font-semibold">{totalTransactions}</span>
      </div>

      <div className="flex items-center gap-2">
        <DynamicIcon
          iconName="shoppingcart"
          size={14}
          className="text-emerald-500"
        />
        <span className="text-[var(--text-secondary)]">Buy:</span>
        <span className="font-semibold text-emerald-600">{buyOrders}</span>
      </div>

      <div className="flex items-center gap-2">
        <DynamicIcon
          iconName="dollarsign"
          size={14}
          className="text-rose-500"
        />
        <span className="text-[var(--text-secondary)]">Sell:</span>
        <span className="font-semibold text-rose-600">{sellOrders}</span>
      </div>
    </div>
  );
}
