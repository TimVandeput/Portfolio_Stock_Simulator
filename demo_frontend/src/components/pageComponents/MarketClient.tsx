"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccessControl } from "@/hooks/useAuth";
import { usePrices } from "@/contexts/PriceContext";
import NoAccessModal from "@/components/ui/NoAccessModal";
import StatusMessage from "@/components/status/StatusMessage";
import MarketStatus from "@/components/status/MarketStatus";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import SortDropdown from "@/components/ui/SortDropdown";
import SymbolsTableDesktop from "@/components/overview/SymbolsTableDesktop";
import SymbolsListMobile from "@/components/overview/SymbolsListMobile";

import { listSymbols } from "@/lib/api/symbols";
import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";

export default function MarketClient() {
  const [showModal, setShowModal] = useState(false);
  const { isLoading, hasAccess, accessError } = useAccessControl({
    requireAuth: true,
    allowedRoles: ["ROLE_USER"],
  });

  const {
    prices,
    pulsatingSymbols,
    isInitialLoading,
    error: priceError,
  } = usePrices();

  useEffect(() => {
    if (!isLoading && !hasAccess && accessError?.reason === "role") {
      setShowModal(true);
    }
  }, [isLoading, hasAccess, accessError]);

  useEffect(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  const [q, setQ] = useState("");
  const [pageIdx, setPageIdx] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState<string>("symbol");

  const [page, setPage] = useState<Page<SymbolDTO> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(
    async (idx: number) => {
      setError("");
      setLoading(true);
      try {
        console.log("🔍 Fetching page", idx);
        const res = await listSymbols({
          q: q.trim() || undefined,
          enabled: true,
          page: idx,
          size: pageSize,
        });
        setPage(res);
        setPageIdx(idx);
      } catch (e) {
        console.error("❌ Failed to load symbols:", e);
        setError((e as any)?.message || "Failed to load markets.");
      } finally {
        setLoading(false);
      }
    },
    [pageSize, q]
  );

  useEffect(() => {
    if (hasAccess) {
      console.log("✅ Access granted, fetching initial page");
      fetchPage(0);
    }
  }, [hasAccess, fetchPage]);

  useEffect(() => {
    if (!hasAccess) return;
    fetchPage(0);
  }, [pageSize, hasAccess, fetchPage]);

  useEffect(() => {
    if (!hasAccess) return;
    const t = setTimeout(() => fetchPage(0), 350);
    return () => clearTimeout(t);
  }, [q, hasAccess, fetchPage]);

  const handleBuy = useCallback((row: SymbolDTO) => {
    console.log("Buy clicked:", row.symbol);
    alert(`Buy ${row.symbol} — hook up your order modal here.`);
  }, []);

  const totalPages = page?.totalPages ?? 0;
  const totalElements = page?.totalElements ?? 0;
  const canPrev = pageIdx > 0;
  const canNext = pageIdx + 1 < totalPages;

  const marketSortOptions = [
    { value: "symbol", label: "Symbol" },
    { value: "exchange", label: "Exchange" },
    { value: "price-high", label: "Price ↓" },
    { value: "price-low", label: "Price ↑" },
    { value: "change-high", label: "% Chg ↓" },
    { value: "change-low", label: "% Chg ↑" },
  ];

  const pageItems = useMemo<(number | "...")[]>(() => {
    const t = totalPages;
    const c = pageIdx;
    if (t <= 1) return [0];
    const items: (number | "...")[] = [];
    const start = Math.max(0, c - 2);
    const end = Math.min(t - 1, c + 2);
    if (start > 0) {
      items.push(0);
      if (start > 1) items.push("...");
    }
    for (let i = start; i <= end; i++) items.push(i);
    if (end < t - 1) {
      if (end < t - 2) items.push("...");
      items.push(t - 1);
    }
    return items;
  }, [pageIdx, totalPages]);

  const sortedPage = useMemo(() => {
    if (!page || !page.content) return page;

    const sorted = [...page.content].sort((a, b) => {
      const priceA = prices[a.symbol];
      const priceB = prices[b.symbol];

      switch (sortBy) {
        case "symbol":
          return a.symbol.localeCompare(b.symbol);
        case "exchange":
          return a.exchange.localeCompare(b.exchange);
        case "price-high":
          return (priceB?.last ?? 0) - (priceA?.last ?? 0);
        case "price-low":
          return (priceA?.last ?? 0) - (priceB?.last ?? 0);
        case "change-high":
          return (priceB?.percentChange ?? 0) - (priceA?.percentChange ?? 0);
        case "change-low":
          return (priceA?.percentChange ?? 0) - (priceB?.percentChange ?? 0);
        default:
          return 0;
      }
    });

    return { ...page, content: sorted };
  }, [page, prices, sortBy]);

  return (
    <>
      {showModal ? (
        <NoAccessModal
          isOpen={showModal}
          accessType={accessError?.reason}
          message={accessError?.message || "Access denied"}
          onClose={() => setShowModal(false)}
        />
      ) : !hasAccess && accessError?.reason === "login" ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {accessError?.message}
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="neu-button px-6 py-2 rounded-xl font-medium"
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <div className="market-container page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
          <div className="page-card p-4 sm:p-6 rounded-2xl max-w-6xl mx-auto w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="flex flex-col gap-2">
                <h1 className="page-title text-2xl sm:text-3xl font-bold">
                  MARKETS
                </h1>
                <MarketStatus />
              </div>

              {/* Search + page size + sort */}
              <div className="flex flex-wrap items-center gap-3">
                <NeumorphicInput
                  type="text"
                  placeholder="Search symbol or name…"
                  value={q}
                  onChange={setQ}
                  className="min-w-[260px]"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm opacity-80">Rows:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(parseInt(e.target.value))}
                    className="px-2 py-1 rounded-xl border bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)]"
                  >
                    {[10, 25, 50].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
                <SortDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  options={marketSortOptions}
                />
              </div>
            </div>

            <div className="min-h-[28px] mb-1">
              {error && <StatusMessage message={error} />}
              {priceError && <StatusMessage message={priceError} />}
              {/* Price update status */}
              {isInitialLoading && (
                <div className="text-xs opacity-60 mb-2 flex items-center gap-2">
                  <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-[var(--accent)]"></div>
                  <span>Loading initial prices...</span>
                </div>
              )}
            </div>

            {/* Overview tables in market mode */}
            <SymbolsTableDesktop
              page={sortedPage}
              mode="market"
              prices={prices}
              pulsatingSymbols={pulsatingSymbols}
              onBuy={handleBuy}
            />
            <SymbolsListMobile
              page={sortedPage}
              mode="market"
              prices={prices}
              pulsatingSymbols={pulsatingSymbols}
              onBuy={handleBuy}
            />

            {/* Pagination */}
            <div className="mt-3">
              <div className="text-sm opacity-80 text-center sm:hidden mb-3">
                Page {pageIdx + 1} / {Math.max(totalPages, 1)} • Total{" "}
                {totalElements}
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="hidden sm:block text-sm opacity-80">
                  Page {pageIdx + 1} / {Math.max(totalPages, 1)} • Total{" "}
                  {totalElements}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="neu-button px-4 py-2 rounded-xl"
                    disabled={!canPrev || loading}
                    onClick={() => fetchPage(pageIdx - 1)}
                  >
                    Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {pageItems.map((item, i) =>
                      item === "..." ? (
                        <span
                          key={`dots-${i}`}
                          className="px-2 select-none opacity-70"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => fetchPage(item)}
                          disabled={loading || item === pageIdx}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors chip ${
                            item === pageIdx
                              ? "chip-selected"
                              : "hover:bg-[var(--surface)]"
                          }`}
                          aria-current={item === pageIdx ? "page" : undefined}
                          aria-label={`Go to page ${item + 1}`}
                        >
                          {item + 1}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="neu-button px-4 py-2 rounded-xl"
                    disabled={!canNext || loading}
                    onClick={() => fetchPage(pageIdx + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
