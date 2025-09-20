"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { usePrices } from "@/contexts/PriceContext";
import { usePagedData } from "@/hooks/usePagedData";
import StatusMessage from "@/components/status/StatusMessage";
import MarketStatus from "@/components/status/MarketStatus";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import SortDropdown from "@/components/ui/SortDropdown";
import SymbolsTableDesktop from "@/components/overview/SymbolsTableDesktop";
import SymbolsListMobile from "@/components/overview/SymbolsListMobile";
import SymbolsPagination from "@/components/button/SymbolsPagination";

import { listSymbols } from "@/lib/api/symbols";
import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";

export default function MarketClient() {
  const router = useRouter();
  const {
    prices,
    pulsatingSymbols,
    isInitialLoading,
    error: priceError,
  } = usePrices();

  const fetchFn = useCallback(
    async ({ q, page, size }: { q?: string; page: number; size: number }) => {
      console.log("🔍 Fetching page", page);
      const res = await listSymbols({
        q: q || undefined,
        enabled: true,
        page,
        size,
      });
      console.log("✅ Loaded page", page, "with", res.content.length, "items");
      return res;
    },
    []
  );

  const {
    page,
    loading,
    error,
    q,
    setQ,
    pageIdx,
    pageSize,
    setPageSize,
    sortBy,
    setSortBy,
    totalPages,
    totalElements,
    fetchPage,
  } = usePagedData<SymbolDTO>({
    fetchFn,
    errorPrefix: "Failed to load markets",
  });

  const handleBuy = useCallback(
    (row: SymbolDTO) => {
      router.push(`/market/${row.symbol.toLowerCase()}`);
    },
    [router]
  );

  const marketSortOptions = [
    { value: "symbol-asc", label: "Symbol A-Z" },
    { value: "symbol-desc", label: "Symbol Z-A" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "exchange-asc", label: "Exchange A-Z" },
    { value: "exchange-desc", label: "Exchange Z-A" },
    { value: "price-high", label: "Price ↓" },
    { value: "price-low", label: "Price ↑" },
    { value: "change-high", label: "% Chg ↓" },
    { value: "change-low", label: "% Chg ↑" },
  ];

  const sortedPage = useMemo(() => {
    if (!page || !page.content) return page;

    const sorted = [...page.content].sort((a, b) => {
      const priceA = prices[a.symbol];
      const priceB = prices[b.symbol];

      switch (sortBy) {
        case "symbol-asc":
        case "symbol":
          return a.symbol.localeCompare(b.symbol);
        case "symbol-desc":
          return b.symbol.localeCompare(a.symbol);
        case "name-asc":
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "exchange-asc":
        case "exchange":
          return a.exchange.localeCompare(b.exchange);
        case "exchange-desc":
          return b.exchange.localeCompare(a.exchange);
        case "price-high":
          return (priceB?.last ?? 0) - (priceA?.last ?? 0);
        case "price-low":
          return (priceA?.last ?? 0) - (priceB?.last ?? 0);
        case "change-high":
          return (priceB?.percentChange ?? 0) - (priceA?.percentChange ?? 0);
        case "change-low":
          return (priceA?.percentChange ?? 0) - (priceB?.percentChange ?? 0);
        default:
          return a.symbol.localeCompare(b.symbol);
      }
    });

    return { ...page, content: sorted };
  }, [page, prices, sortBy]);

  return (
    <div className="market-container page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="page-card p-4 sm:p-6 rounded-2xl max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="page-title text-2xl sm:text-3xl font-bold">MARKETS</h1>
          <MarketStatus />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3 mb-4">
          <NeumorphicInput
            type="text"
            placeholder="Search symbol or name…"
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
              options={marketSortOptions}
            />
          </div>
        </div>

        <div className="min-h-[28px] mb-1">
          {error && <StatusMessage message={error} />}
          {priceError && <StatusMessage message={priceError} />}
          {isInitialLoading && (
            <div className="text-xs opacity-60 mb-2 flex items-center gap-2">
              <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-[var(--accent)]"></div>
              <span>Loading initial prices...</span>
            </div>
          )}
        </div>

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

        <SymbolsPagination
          pageIdx={pageIdx}
          totalPages={totalPages}
          totalElements={totalElements}
          loading={loading}
          onPrev={() => fetchPage(pageIdx - 1)}
          onNext={() => fetchPage(pageIdx + 1)}
          onGoto={(idx) => fetchPage(idx)}
        />
      </div>
    </div>
  );
}
