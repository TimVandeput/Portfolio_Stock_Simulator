"use client";

import { useState, useEffect } from "react";
import { getTransactionHistory } from "@/lib/api/trading";
import { getUserId } from "@/lib/auth/tokenStorage";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import TransactionsTableDesktop from "@/components/overview/TransactionsTableDesktop";
import TransactionsListMobile from "@/components/overview/TransactionsListMobile";
import StatusMessage from "@/components/status/StatusMessage";
import DynamicIcon from "@/components/ui/DynamicIcon";
import type { Transaction } from "@/types/trading";

export default function OrdersClient() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTransactionHistory = async () => {
      const userId = getUserId();
      if (!userId) {
        setError("Please log in to view your transaction history.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const history = await getTransactionHistory(userId);
        setTransactions(history);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadTransactionHistory();
  }, []);

  return (
    <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="page-card p-4 sm:p-6 rounded-2xl max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="page-title text-2xl sm:text-3xl font-bold">
            TRANSACTION HISTORY
          </h1>
          <p className="text-[var(--text-secondary)]">
            View all your trading transactions and order history
          </p>
        </div>

        <div className="min-h-[28px] mb-4">
          {error && <StatusMessage message={error} />}
        </div>

        {!loading && !error && transactions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="neu-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  Total Transactions
                </span>
              </div>
              <span className="text-2xl font-bold">{transactions.length}</span>
            </div>

            <div className="neu-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  Buy Orders
                </span>
              </div>
              <span className="text-2xl font-bold text-emerald-600">
                {transactions.filter((t) => t.type === "BUY").length}
              </span>
            </div>

            <div className="neu-card p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  Sell Orders
                </span>
              </div>
              <span className="text-2xl font-bold text-rose-600">
                {transactions.filter((t) => t.type === "SELL").length}
              </span>
            </div>
          </div>
        )}

        <TransactionsTableDesktop
          transactions={transactions}
          loading={loading}
        />
        <TransactionsListMobile transactions={transactions} loading={loading} />
      </div>
    </div>
  );
}
