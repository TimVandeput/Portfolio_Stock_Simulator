"use client";

import type { Transaction } from "@/types/trading";
import DynamicIcon from "@/components/ui/DynamicIcon";

interface TransactionsListMobileProps {
  transactions: Transaction[];
  loading?: boolean;
}

export default function TransactionsListMobile({
  transactions,
  loading = false,
}: TransactionsListMobileProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="md:hidden neu-card p-6 text-center rounded-2xl border shadow-sm">
        <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)]">
          <DynamicIcon iconName="loader-2" size={20} className="animate-spin" />
          <span>Loading transactions...</span>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="md:hidden neu-card p-6 text-center rounded-2xl border shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <DynamicIcon iconName="file-text" size={32} className="opacity-50" />
          <span className="font-medium">No transactions found</span>
          <span className="text-sm text-[var(--text-secondary)]">
            Your trading history will appear here.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="md:hidden">
      <ul className="space-y-3">
        {transactions.map((transaction) => {
          const profitLoss = transaction.profitLoss;

          return (
            <li
              key={transaction.id}
              className="neu-card p-4 rounded-xl border shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                        transaction.type === "BUY"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-700"
                          : "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/50 dark:text-rose-300 dark:border-rose-700"
                      }`}
                    >
                      <DynamicIcon
                        iconName={
                          transaction.type === "BUY"
                            ? "arrow-down-circle"
                            : "arrow-up-circle"
                        }
                        size={10}
                        className={
                          transaction.type === "BUY"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }
                      />
                      {transaction.type}
                    </span>
                    <span className="font-semibold text-lg">
                      {transaction.symbol}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] truncate">
                    {transaction.symbolName
                      ? transaction.symbolName
                      : `[${transaction.symbol}]`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-mono font-medium tabular-nums">
                    ${transaction.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {formatDate(transaction.executedAt)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm border-t pt-3">
                <div className="rounded-xl border p-2">
                  <div className="text-[var(--text-secondary)] text-xs mb-1">
                    Quantity
                  </div>
                  <div className="font-mono tabular-nums">
                    {transaction.quantity.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-xl border p-2">
                  <div className="text-[var(--text-secondary)] text-xs mb-1">
                    Price
                  </div>
                  <div className="font-mono tabular-nums">
                    ${transaction.pricePerShare.toFixed(2)}
                  </div>
                </div>
              </div>

              {profitLoss !== null && (
                <div className="flex justify-between text-sm border-t pt-2 mt-2">
                  <span className="text-[var(--text-secondary)]">P&L:</span>
                  <span
                    className={`font-mono font-medium tabular-nums ${
                      profitLoss >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {profitLoss >= 0 ? "+$" : "-$"}
                    {Math.abs(profitLoss).toFixed(2)}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
