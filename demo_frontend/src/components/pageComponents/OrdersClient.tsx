"use client";

import { useState, useEffect, useMemo } from "react";
import { getTransactionHistory } from "@/lib/api/trading";
import { getUserId } from "@/lib/auth/tokenStorage";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import TransactionsTableDesktop from "@/components/overview/TransactionsTableDesktop";
import TransactionsListMobile from "@/components/overview/TransactionsListMobile";
import StatusMessage from "@/components/status/StatusMessage";
import TransactionStats from "@/components/status/TransactionStats";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import SortDropdown from "@/components/ui/SortDropdown";
import SymbolsPagination from "@/components/button/SymbolsPagination";
import type { Transaction } from "@/types/trading";
import type { SortOption } from "@/types/components";

export default function OrdersClient() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);

  const sortOptions: SortOption[] = [
    { value: "date-desc", label: "Newest First" },
    { value: "date-asc", label: "Oldest First" },
    { value: "symbol-asc", label: "Symbol A-Z" },
    { value: "symbol-desc", label: "Symbol Z-A" },
    { value: "type-buy", label: "Buy Orders" },
    { value: "type-sell", label: "Sell Orders" },
    { value: "amount-desc", label: "Highest Amount" },
    { value: "amount-asc", label: "Lowest Amount" },
  ];

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    if (q.trim()) {
      const query = q.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.symbol.toLowerCase().includes(query) ||
          transaction.symbolName?.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
          );
        case "date-asc":
          return (
            new Date(a.executedAt).getTime() - new Date(b.executedAt).getTime()
          );
        case "symbol-asc":
          return a.symbol.localeCompare(b.symbol);
        case "symbol-desc":
          return b.symbol.localeCompare(a.symbol);
        case "type-buy":
          if (a.type === "BUY" && b.type !== "BUY") return -1;
          if (a.type !== "BUY" && b.type === "BUY") return 1;
          return (
            new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
          );
        case "type-sell":
          if (a.type === "SELL" && b.type !== "SELL") return -1;
          if (a.type !== "SELL" && b.type === "SELL") return 1;
          return (
            new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
          );
        case "amount-desc":
          return b.totalAmount - a.totalAmount;
        case "amount-asc":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    return sorted;
  }, [transactions, q, sortBy]);

  const totalElements = filteredAndSortedTransactions.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const startIdx = currentPage * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    startIdx,
    endIdx
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [q, sortBy]);

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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="page-title text-2xl sm:text-3xl font-bold">
              TRANSACTION HISTORY
            </h1>
            {!loading && !error && transactions.length > 0 && (
              <TransactionStats transactions={filteredAndSortedTransactions} />
            )}
          </div>

          {!loading && !error && transactions.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 lg:flex-shrink-0">
              <NeumorphicInput
                type="text"
                placeholder="Search transactions..."
                value={q}
                onChange={setQ}
                className="min-w-[260px]"
              />

              <div className="flex items-center gap-2 sm:ml-auto">
                <span className="text-sm opacity-80">Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value))}
                  className="px-2 py-1 rounded-xl border bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)]"
                  aria-label="Rows per page"
                >
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                <SortDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  options={sortOptions}
                />
              </div>
            </div>
          )}
        </div>

        <div className="min-h-[28px] mb-4">
          {error && <StatusMessage message={error} />}
        </div>

        <TransactionsTableDesktop
          transactions={paginatedTransactions}
          loading={loading}
        />
        <TransactionsListMobile
          transactions={paginatedTransactions}
          loading={loading}
        />

        {!loading && !error && totalElements > 0 && (
          <SymbolsPagination
            pageIdx={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            loading={loading}
            onPrev={() => setCurrentPage(currentPage - 1)}
            onNext={() => setCurrentPage(currentPage + 1)}
            onGoto={(idx) => setCurrentPage(idx)}
          />
        )}
      </div>
    </div>
  );
}
