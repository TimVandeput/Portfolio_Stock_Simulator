"use client";

import { useMemo, useCallback, useState } from "react";
import { useImportStatus } from "@/hooks/useImportStatus";
import { usePagedData } from "@/hooks/usePagedData";
import { useAuth } from "@/hooks/useAuth";
import StatusMessage from "@/components/status/StatusMessage";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import {
  importSymbols,
  listSymbols,
  setSymbolEnabled,
} from "@/lib/api/symbols";
import type { Universe, SymbolDTO, ImportSummaryDTO } from "@/types/symbol";

import UniverseImportBar from "@/components/button/UniverseImportBar";
import FiltersBar from "@/components/ui/FiltersBar";
import SymbolsMeta from "@/components/status/SymbolsMeta";
import SymbolsTableDesktop from "@/components/overview/SymbolsTableDesktop";
import SymbolsListMobile from "@/components/overview/SymbolsListMobile";
import SymbolsPagination from "@/components/button/SymbolsPagination";

export default function SymbolsClient() {
  const { isAuthenticated, role, isLoading } = useAuth();
  const [universe, setUniverse] = useState<Universe>("NDX");
  const [enabledFilter, setEnabledFilter] = useState<
    "all" | "enabled" | "disabled"
  >("all");

  const hasAdminAccess = isAuthenticated && role === "ROLE_ADMIN";
  const shouldDisableDataFetching = isLoading || !hasAdminAccess;

  const fetchFn = useCallback(
    async ({ q, page, size }: { q?: string; page: number; size: number }) => {
      const res = await listSymbols({
        q: q || undefined,
        enabled:
          enabledFilter === "all" ? undefined : enabledFilter === "enabled",
        page,
        size,
      });
      return res;
    },
    [enabledFilter]
  );

  const additionalParams = useMemo(() => ({ enabledFilter }), [enabledFilter]);

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
    setPage,
    setError,
  } = usePagedData<SymbolDTO>({
    fetchFn,
    additionalParams,
    errorPrefix: "Failed to load symbols",
    disabled: shouldDisableDataFetching,
  });

  const importStatus = useImportStatus();
  const importRunning = importStatus?.running || false;
  const lastImportedAt = importStatus?.lastImportedAt || null;
  const lastSummary = importStatus?.lastSummary || null;

  const [importBusy, setImportBusy] = useState(false);

  const onImport = useCallback(async () => {
    setError("");
    setImportBusy(true);
    try {
      await importSymbols(universe);
      await fetchPage(0);
    } catch (e) {
      setError(getErrorMessage(e) || "Import failed.");
    } finally {
      setImportBusy(false);
    }
  }, [universe, fetchPage, setError]);

  const onToggle = useCallback(
    async (row: SymbolDTO, next: boolean) => {
      setPage((prev) =>
        prev
          ? {
              ...prev,
              content: prev.content.map((r) =>
                r.id === row.id ? { ...r, enabled: next } : r
              ),
            }
          : prev
      );

      try {
        await setSymbolEnabled(row.id, next);

        if (enabledFilter !== "all") {
          const willBeRemoved =
            (enabledFilter === "enabled" && !next) ||
            (enabledFilter === "disabled" && next);
          if (willBeRemoved) {
            const isLastOnPage = (page?.content?.length ?? 0) === 1;
            const targetPage =
              isLastOnPage && pageIdx > 0 ? pageIdx - 1 : pageIdx;
            await fetchPage(targetPage);
          }
        }
      } catch (e) {
        setPage((prev) =>
          prev
            ? {
                ...prev,
                content: prev.content.map((r) =>
                  r.id === row.id ? { ...r, enabled: row.enabled } : r
                ),
              }
            : prev
        );
        setError(getErrorMessage(e) || "Failed to update symbol.");
      }
    },
    [enabledFilter, pageIdx, page, fetchPage, setError, setPage]
  );

  const sortOptions = [
    { value: "symbol-asc", label: "Symbol A-Z" },
    { value: "symbol-desc", label: "Symbol Z-A" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "exchange-asc", label: "Exchange A-Z" },
    { value: "exchange-desc", label: "Exchange Z-A" },
    { value: "currency-asc", label: "Currency A-Z" },
    { value: "currency-desc", label: "Currency Z-A" },
  ];

  const sortedPage = useMemo(() => {
    if (!page || !page.content) return page;

    const sorted = [...page.content].sort((a, b) => {
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
        case "currency-asc":
        case "currency":
          return a.currency.localeCompare(b.currency);
        case "currency-desc":
          return b.currency.localeCompare(a.currency);
        default:
          return a.symbol.localeCompare(b.symbol);
      }
    });

    return { ...page, content: sorted };
  }, [page, sortBy]);

  return (
    <div className="symbols-container page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="symbols-card page-card p-4 sm:p-6 rounded-2xl max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="page-title text-2xl sm:text-3xl font-bold">SYMBOLS</h1>
          <UniverseImportBar
            universe={universe}
            setUniverse={setUniverse}
            onImport={onImport}
            importBusy={importBusy}
            importRunning={importRunning}
          />
        </div>

        <SymbolsMeta
          lastImportedAt={lastImportedAt}
          lastSummary={lastSummary}
        />

        <FiltersBar
          q={q}
          setQ={setQ}
          enabledFilter={enabledFilter}
          setEnabledFilter={setEnabledFilter}
          pageSize={pageSize}
          setPageSize={setPageSize}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={sortOptions}
        />

        <div className="min-h-[28px]">
          {error && <StatusMessage message={error} />}
        </div>

        <SymbolsTableDesktop
          page={sortedPage}
          mode="admin"
          onToggle={onToggle}
        />
        <SymbolsListMobile page={sortedPage} mode="admin" onToggle={onToggle} />

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
