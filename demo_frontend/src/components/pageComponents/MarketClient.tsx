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
import { openPriceStream, type StreamController } from "@/lib/api/stream";
import { ApiError } from "@/lib/api/http";
import type { Page } from "@/types/pagination";
import type { SymbolDTO } from "@/types/symbol";
import type { PriceEvent } from "@/types";

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

  const prevPricesRef = useRef<Record<string, number>>({});

  const qRef = useRef(q);
  useEffect(() => {
    qRef.current = q;
  }, [q]);

  const fetchPage = useCallback(
    async (idx: number) => {
      setError("");
      setLoading(true);
      try {
        console.log("🔍 Fetching page", idx, "hasAccess:", hasAccess);
        const res = await listSymbols({
          q: qRef.current.trim() || undefined,
          enabled: true,
          page: idx,
          size: pageSize,
        });
        setPage(res);
        setPageIdx(idx);

        // Get current symbols for this page
        const symbols = res.content.map((s) => s.symbol);

        // Load initial prices from Yahoo Finance API
        try {
          console.log("🔄 Loading initial prices for symbols:", symbols);
          const initialPrices = await getAllCurrentPrices();
          console.log(
            "✅ Got initial prices:",
            Object.keys(initialPrices).length,
            "symbols"
          );

          setPrices((prev) => {
            const newPrices: Prices = {};
            let pricesFound = 0;
            for (const s of res.content) {
              const yahooPriceData = initialPrices[s.symbol];
              if (yahooPriceData && yahooPriceData.price !== null) {
                // Use Yahoo Finance data for initial load
                newPrices[s.symbol] = {
                  last: yahooPriceData.price,
                  percentChange: yahooPriceData.changePercent ?? undefined,
                  lastUpdate: Date.now(),
                };
                pricesFound++;
                console.log(
                  `💰 Price for ${s.symbol}: $${yahooPriceData.price} (${yahooPriceData.changePercent}%)`
                );
              } else {
                // Preserve existing price data if Yahoo Finance doesn't have it
                newPrices[s.symbol] = prev[s.symbol] || {};
                console.log(`❌ No price data for ${s.symbol}`);
              }
            }
            console.log(
              `✅ Set prices for ${pricesFound}/${res.content.length} symbols`
            );
            return newPrices;
          });
        } catch (priceError) {
          console.error("❌ Failed to load initial prices:", priceError);

          // Handle specific error types
          if (priceError instanceof ApiError) {
            if (priceError.status === 401) {
              setError("Please log in to view market prices");
            } else if (priceError.status === 403) {
              setError("Access denied. Please check your permissions.");
            } else {
              setError(`Failed to load prices: ${priceError.message}`);
            }
          } else if (
            priceError instanceof Error &&
            priceError.message.includes("fetch")
          ) {
            setError(
              "Cannot connect to price server. Please check if the backend is running."
            );
          } else {
            setError("Failed to load prices. Please try again.");
          }

          // Fall back to preserving existing prices without Yahoo Finance data
          setPrices((prev) => {
            const newPrices: Prices = {};
            for (const s of res.content) {
              newPrices[s.symbol] = prev[s.symbol] || {};
            }
            return newPrices;
          });
        }
      } catch (e) {
        console.error("❌ Failed to load symbols:", e);
        setError((e as any)?.message || "Failed to load markets.");
      } finally {
        setLoading(false);
      }
    },
    [pageSize, hasAccess]
  );

  useEffect(() => {
    if (hasAccess) {
      console.log("✅ Access granted, fetching initial page");
      fetchPage(0);
    } else {
      console.log("❌ Access denied, not fetching data");
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

  const visibleSymbols = useMemo(
    () => (page?.content ?? []).map((s) => s.symbol),
    [page?.content]
  );
  const symKey = useMemo(() => visibleSymbols.join(","), [visibleSymbols]);

  const streamRef = useRef<StreamController | null>(null);
  const lastKeyRef = useRef<string>("");

  const mountedOnceRef = useRef(false);

  useEffect(() => {
    if (!hasAccess || visibleSymbols.length === 0) return;

    if (!mountedOnceRef.current) {
      mountedOnceRef.current = true;
    }

    if (lastKeyRef.current === symKey && streamRef.current) {
      return;
    }

    if (streamRef.current) {
      try {
        streamRef.current.close();
      } catch {}
      streamRef.current = null;
    }

    const ctrl = openPriceStream(visibleSymbols, {
      onPrice: (e: PriceEvent) => {
        console.log("📈 SSE Price update:", e.symbol, e.price, e.percentChange);
        if (e.type !== "price" || !e.symbol) return;

        setPrices((prev) => {
          prevPricesRef.current[e.symbol] = e.price;

          return {
            ...prev,
            [e.symbol]: {
              percentChange: e.percentChange,
              last: e.price,
              lastUpdate: Date.now(),
            },
          };
        });
      },
      onOpen: () => {
        console.log(
          "🔌 SSE connection opened for symbols:",
          visibleSymbols.join(",")
        );
      },
      onHeartbeat: () => {
        console.log("💓 SSE heartbeat");
      },
      onError: (error) => {
        console.error("❌ SSE connection error:", error);
      },
    });

    streamRef.current = ctrl;
    lastKeyRef.current = symKey;

    return () => {
      try {
        streamRef.current?.close();
      } catch {}
      streamRef.current = null;
      lastKeyRef.current = "";
    };
  }, [symKey, hasAccess]);
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
              {/* Debug info - remove this later */}
              {process.env.NODE_ENV === "development" && (
                <div className="text-xs opacity-60 mb-2">
                  Debug: hasAccess={String(hasAccess)}, isLoading=
                  {String(isLoading)}, symbols={visibleSymbols.length}, prices=
                  {Object.keys(prices).length}
                </div>
              )}
            </div>

            {/* Overview tables in market mode with live prices & Buy action */}
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
