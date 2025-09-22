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
import DateRangeFilter, {
  type DateRange,
} from "@/components/input/DateRangeFilter";
import SortDropdown from "@/components/ui/SortDropdown";
import SymbolsPagination from "@/components/button/SymbolsPagination";
import TransactionExporter from "@/components/ui/TransactionExporter";
import type { Transaction } from "@/types/trading";
import type { SortOption } from "@/types/components";

export default function OrdersClient() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: "",
    endDate: "",
  });
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

    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.executedAt);
        const startDate = dateRange.startDate
          ? new Date(dateRange.startDate)
          : null;
        const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

        if (endDate) {
          endDate.setHours(23, 59, 59, 999);
        }

        const afterStart = !startDate || transactionDate >= startDate;
        const beforeEnd = !endDate || transactionDate <= endDate;

        return afterStart && beforeEnd;
      });
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
  }, [transactions, q, dateRange, sortBy]);

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
  }, [q, dateRange, sortBy]);

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
        <div className="flex flex-col gap-2 mb-2">
          {/* Mobile title with export button */}
          <div className="flex justify-between items-center sm:hidden">
            <h1 className="page-title text-2xl font-bold">ORDER HISTORY</h1>
            {!loading && !error && transactions.length > 0 && (
              <TransactionExporter
                transactions={filteredAndSortedTransactions}
                allTransactions={transactions}
                filename={`transactions-${
                  new Date().toISOString().split("T")[0]
                }`}
              />
            )}
          </div>

          {/* Desktop/Tablet title with export button */}
          <div className="hidden sm:flex sm:items-start sm:justify-between gap-2">
            <h1 className="page-title text-2xl sm:text-3xl font-bold">
              ORDER HISTORY
            </h1>
            {!loading && !error && transactions.length > 0 && (
              <div className="flex-shrink-0">
                <TransactionExporter
                  transactions={filteredAndSortedTransactions}
                  allTransactions={transactions}
                  filename={`transactions-${
                    new Date().toISOString().split("T")[0]
                  }`}
                />
              </div>
            )}
          </div>
          {!loading && !error && transactions.length > 0 && (
            <TransactionStats transactions={filteredAndSortedTransactions} />
          )}
        </div>

        {!loading && !error && transactions.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between min-[768px]:max-[1023px]:portrait:flex-row min-[768px]:max-[1023px]:portrait:gap-2">
            <NeumorphicInput
              type="text"
              placeholder="Search transactions..."
              value={q}
              onChange={setQ}
              className="w-full sm:min-w-[260px] sm:max-w-md min-[768px]:max-[1023px]:portrait:max-w-[200px] min-[768px]:max-[1023px]:portrait:flex-shrink"
            />

            <div className="flex items-center gap-2 flex-wrap min-[768px]:max-[1023px]:portrait:gap-1 max-sm:hidden">
              <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />

              <div className="flex items-center gap-2 min-[768px]:max-[1023px]:portrait:gap-1">
                <span className="text-sm opacity-80 whitespace-nowrap">
                  Rows:
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value))}
                  className="px-2 py-1 rounded-xl border bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] min-w-[60px]"
                  aria-label="Rows per page"
                >
                  {[10, 25, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <SortDropdown
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
              />
            </div>
          </div>
        )}

        {/* Mobile controls - Rows and Date on one row, Sort below */}
        {!loading && !error && transactions.length > 0 && (
          <div className="flex flex-col gap-3 mt-4 sm:hidden">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm opacity-80 whitespace-nowrap">
                  Rows:
                </span>
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
              </div>
              <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />
            </div>
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
            />
          </div>
        )}

        <div className="min-h-[28px]">
          {error && <StatusMessage message={error} />}
        </div>

        <TransactionsTableDesktop
          transactions={paginatedTransactions}
          allTransactions={transactions}
          loading={loading}
        />
        <TransactionsListMobile
          transactions={paginatedTransactions}
          allTransactions={transactions}
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
