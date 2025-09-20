"use client";

import type { Transaction } from "@/types/trading";
import DynamicIcon from "@/components/ui/DynamicIcon";

interface TransactionsTableDesktopProps {
  transactions: Transaction[];
  loading?: boolean;
}

export default function TransactionsTableDesktop({
  transactions,
  loading = false,
}: TransactionsTableDesktopProps) {
  const calculateProfitLoss = (sellTransaction: Transaction): number | null => {
    if (sellTransaction.type !== "SELL") return null;

    const symbolTransactions = transactions
      .filter((t) => t.symbol === sellTransaction.symbol)
      .sort(
        (a, b) =>
          new Date(a.executedAt).getTime() - new Date(b.executedAt).getTime()
      );

    const sellIndex = symbolTransactions.findIndex(
      (t) => t.id === sellTransaction.id
    );
    if (sellIndex === -1) return null;

    const relevantTransactions = symbolTransactions.slice(0, sellIndex + 1);

    let remainingShares = sellTransaction.quantity;
    let totalCostBasis = 0;

    for (const transaction of relevantTransactions) {
      if (transaction.type === "BUY" && remainingShares > 0) {
        const sharesToUse = Math.min(remainingShares, transaction.quantity);
        totalCostBasis += sharesToUse * transaction.pricePerShare;
        remainingShares -= sharesToUse;
      }
    }

    if (remainingShares > 0) {
      return null;
    }

    const sellValue = sellTransaction.quantity * sellTransaction.pricePerShare;
    return sellValue - totalCostBasis;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="neu-card hidden md:block rounded-2xl overflow-hidden border">
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)]">
            <DynamicIcon
              iconName="loader-2"
              size={20}
              className="animate-spin"
            />
            <span>Loading transactions...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="neu-card hidden md:block rounded-2xl overflow-hidden border shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="border-b border-[var(--accent)]/20">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] w-[100px]">
                <div className="flex items-center gap-1">
                  <span className="whitespace-nowrap">Date</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] w-[80px]">
                <div className="flex items-center gap-1">
                  <span className="whitespace-nowrap">Symbol</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)]">
                <div className="flex items-center gap-1">
                  <span className="whitespace-nowrap">Name</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] w-[80px]">
                <div className="flex items-center gap-1">
                  <span className="whitespace-nowrap">Type</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-primary)] w-[80px]">
                <div className="flex items-center justify-end gap-1">
                  <span className="whitespace-nowrap">Qty</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-primary)] w-[90px]">
                <div className="flex items-center justify-end gap-1">
                  <span className="whitespace-nowrap">Price</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-primary)] w-[100px]">
                <div className="flex items-center justify-end gap-1">
                  <span className="whitespace-nowrap">Total</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-[var(--text-primary)] w-[90px]">
                <div className="flex items-center justify-end gap-1">
                  <span className="whitespace-nowrap">P&L</span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center opacity-70 border-t"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span>No transactions found.</span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      Your trading history will appear here.
                    </span>
                  </div>
                </td>
              </tr>
            )}

            {transactions.map((transaction) => {
              const profitLoss = calculateProfitLoss(transaction);

              return (
                <tr
                  key={transaction.id}
                  className="border-t hover:bg-[var(--accent)]/5 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap w-[100px]">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {formatDate(transaction.executedAt)}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {formatTime(transaction.executedAt)}
                      </span>
                    </div>
                  </td>

                  <td
                    className="px-4 py-3 font-semibold whitespace-nowrap w-[80px]"
                    title={transaction.symbol}
                  >
                    {transaction.symbol}
                  </td>

                  <td className="px-4 py-3 max-w-0">
                    <span
                      className="block truncate"
                      title={transaction.symbolName}
                    >
                      {transaction.symbolName || transaction.symbol}
                    </span>
                  </td>

                  <td className="px-4 py-3 w-[80px]">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
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
                        size={12}
                        className={
                          transaction.type === "BUY"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }
                      />
                      {transaction.type}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right font-mono tabular-nums text-sm whitespace-nowrap w-[80px]">
                    {transaction.quantity.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-right font-mono tabular-nums text-sm whitespace-nowrap w-[90px]">
                    ${transaction.pricePerShare.toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right font-mono font-medium tabular-nums text-sm whitespace-nowrap w-[100px]">
                    ${transaction.totalAmount.toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-right font-mono tabular-nums text-sm whitespace-nowrap w-[90px]">
                    {profitLoss !== null ? (
                      <span
                        className={`font-medium ${
                          profitLoss >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[var(--text-secondary)]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
