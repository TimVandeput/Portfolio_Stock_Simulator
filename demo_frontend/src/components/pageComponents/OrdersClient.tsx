"use client";

import { useState, useEffect } from "react";
import { getTransactionHistory } from "@/lib/api/trading";
import { getUserId } from "@/lib/auth/tokenStorage";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import TransactionsTableDesktop from "@/components/overview/TransactionsTableDesktop";
import TransactionsListMobile from "@/components/overview/TransactionsListMobile";
import StatusMessage from "@/components/status/StatusMessage";
import TransactionStats from "@/components/status/TransactionStats";
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
          <TransactionStats transactions={transactions} />
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
