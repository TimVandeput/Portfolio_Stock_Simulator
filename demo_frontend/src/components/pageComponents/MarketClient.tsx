"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccessControl } from "@/hooks/useAuth";
import NoAccessModal from "@/components/ui/NoAccessModal";
import StatusMessage from "@/components/status/StatusMessage";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import SymbolsTableDesktop from "@/components/overview/SymbolsTableDesktop";
import SymbolsListMobile from "@/components/overview/SymbolsListMobile";

import { listSymbols } from "@/lib/api/symbols";
import { getAllCurrentPrices } from "@/lib/api/prices";
import { ApiError } from "@/lib/api/http";
import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";

type Prices = Record<
  string,
  { last?: number; percentChange?: number; lastUpdate?: number }
>;

export default function MarketClient() {
  const [showModal, setShowModal] = useState(false);
  const { isLoading, hasAccess, accessError } = useAccessControl({
    requireAuth: true,
    allowedRoles: ["ROLE_USER"],
  });

  useEffect(() => {
    if (!isLoading && !hasAccess && accessError) setShowModal(true);
  }, [isLoading, hasAccess, accessError]);

  useEffect(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  const [q, setQ] = useState("");
  const [pageIdx, setPageIdx] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const [page, setPage] = useState<Page<SymbolDTO> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [prices, setPrices] = useState<Prices>({});
  const [lastPriceUpdate, setLastPriceUpdate] = useState<number>(0);

  const qRef = useRef(q);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    qRef.current = q;
  }, [q]);

  const fetchPrices = useCallback(async () => {
    if (!hasAccess) return;

    try {
      console.log("🔄 Polling prices...");
      const allPrices = await getAllCurrentPrices();
      console.log(
        "✅ Got prices for",
        Object.keys(allPrices).length,
        "symbols"
      );

      setPrices((prev) => {
        const newPrices: Prices = { ...prev };
        let updatedCount = 0;

        Object.entries(allPrices).forEach(([symbol, priceData]) => {
          if (priceData && priceData.price !== null) {
            newPrices[symbol] = {
              last: priceData.price,
              percentChange: priceData.changePercent ?? undefined,
              lastUpdate: Date.now(),
            };
            updatedCount++;
          }
        });

        console.log(`💰 Updated prices for ${updatedCount} symbols`);
        return newPrices;
      });

      setLastPriceUpdate(Date.now());
      setError("");
    } catch (priceError) {
      console.error("❌ Failed to poll prices:", priceError);

      if (priceError instanceof ApiError) {
        if (priceError.status === 401) {
          console.warn("Authentication required for price polling");
        } else if (priceError.status === 403) {
          console.warn("Access denied for price polling");
        }
      }
    }
  }, [hasAccess]);

  const fetchPage = useCallback(
    async (idx: number) => {
      setError("");
      setLoading(true);
      try {
        console.log("🔍 Fetching page", idx);
        const res = await listSymbols({
          q: qRef.current.trim() || undefined,
          enabled: true,
          page: idx,
          size: pageSize,
        });
        setPage(res);
        setPageIdx(idx);

        setPrices((prev) => {
          const newPrices: Prices = {};
          for (const s of res.content) {
            newPrices[s.symbol] = prev[s.symbol] || {};
          }
          return newPrices;
        });

        await fetchPrices();
      } catch (e) {
        console.error("❌ Failed to load symbols:", e);
        setError((e as any)?.message || "Failed to load markets.");
      } finally {
        setLoading(false);
      }
    },
    [pageSize, fetchPrices]
  );

  useEffect(() => {
    if (!hasAccess) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    console.log("🔄 Starting price polling every 2 minutes");
    pollingIntervalRef.current = setInterval(fetchPrices, 120000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [hasAccess, fetchPrices]);

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

  const lastUpdateText = useMemo(() => {
    if (!lastPriceUpdate) return "Never";
    const now = Date.now();
    const diff = now - lastPriceUpdate;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  }, [lastPriceUpdate]);

  return (
    <>
      {showModal ? (
        <NoAccessModal
          isOpen={showModal}
          accessType={accessError?.reason}
          message={accessError?.message || "Access denied"}
          onClose={() => setShowModal(false)}
        />
      ) : (
        <div className="market-container page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
          <div className="page-card p-4 sm:p-6 rounded-2xl max-w-6xl mx-auto w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h1 className="page-title text-2xl sm:text-3xl font-bold">
                MARKETS
              </h1>

              {/* Search + page size */}
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
                    {[10, 25, 50, 100].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="min-h-[28px] mb-1">
              {error && <StatusMessage message={error} />}
              {/* Price update status */}
              {lastPriceUpdate > 0 && (
                <div className="text-xs opacity-60 mb-2">
                  Prices last updated: {lastUpdateText} • Auto-refresh every 2
                  minutes
                </div>
              )}
            </div>

            {/* Overview tables in market mode */}
            <SymbolsTableDesktop
              page={page}
              mode="market"
              prices={prices}
              onBuy={handleBuy}
            />
            <SymbolsListMobile
              page={page}
              mode="market"
              prices={prices}
              onBuy={handleBuy}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between mt-3 gap-3">
              <div className="text-sm opacity-80">
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
      )}
    </>
  );
}
