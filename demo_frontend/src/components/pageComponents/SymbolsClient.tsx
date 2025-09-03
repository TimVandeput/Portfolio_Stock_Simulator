"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAccessControl } from "@/hooks/useAuth";
import NoAccessModal from "@/components/ui/NoAccessModal";
import StatusMessage from "@/components/status/StatusMessage";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import { getCookie } from "@/lib/utils/cookies";
import {
  getImportStatus,
  importSymbols,
  listSymbols,
  setSymbolEnabled,
} from "@/lib/api/symbols";
import type { Universe, SymbolDTO, ImportSummaryDTO } from "@/types/symbol";
import type { Page } from "@/types/pagination";

import UniverseImportBar from "@/components/button/UniverseImportBar";
import FiltersBar from "@/components/filter/FiltersBar";
import SymbolsMeta from "@/components/status/SymbolsMeta";
import SymbolsTableDesktop from "@/components/overview/SymbolsTableDesktop";
import SymbolsListMobile from "@/components/overview/SymbolsListMobile";
import SymbolsPagination from "@/components/button/SymbolsPagination";

export default function SymbolsClient() {
  const [showModal, setShowModal] = useState(false);
  const { isLoading, hasAccess, accessError } = useAccessControl({
    requireAuth: true,
    allowedRoles: ["ROLE_ADMIN"],
  });

  useEffect(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  useEffect(() => {
    setShowModal(!isLoading && !hasAccess && !!accessError);
  }, [isLoading, hasAccess, accessError]);

  const [universe, setUniverse] = useState<Universe>("NDX");
  const [q, setQ] = useState("");
  const [enabledFilter, setEnabledFilter] = useState<
    "all" | "enabled" | "disabled"
  >("all");
  const [pageIdx, setPageIdx] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const [page, setPage] = useState<Page<SymbolDTO> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [importRunning, setImportRunning] = useState(false);
  const [lastImportedAt, setLastImportedAt] = useState<string | null>(null);
  const [lastSummary, setLastSummary] = useState<ImportSummaryDTO | null>(null);

  const [importBusy, setImportBusy] = useState(false);

  useEffect(() => {
    if (isLoading || !hasAccess) return;
    const as = getCookie("auth.as");
    if (as !== "ROLE_ADMIN") return;

    let timer: any;
    let stop = false;

    async function poll() {
      try {
        const s = await getImportStatus();
        if (stop) return;
        setImportRunning(!!s.running);
        setLastImportedAt(s.lastImportedAt ?? null);
        setLastSummary(s.lastSummary ?? null);
      } catch {
        // ignore
      } finally {
        if (!stop) timer = setTimeout(poll, 3000);
      }
    }

    poll();
    return () => {
      stop = true;
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, hasAccess]);

  const qRef = useRef(q);
  useEffect(() => {
    qRef.current = q;
  }, [q]);

  const fetchPage = useCallback(
    async (idx: number) => {
      setError("");
      setLoading(true);
      try {
        const res = await listSymbols({
          q: qRef.current.trim() || undefined,
          enabled:
            enabledFilter === "all" ? undefined : enabledFilter === "enabled",
          page: idx,
          size: pageSize,
        });
        setPage(res);
        setPageIdx(idx);
      } catch (e) {
        setError(getErrorMessage(e) || "Failed to load symbols.");
      } finally {
        setLoading(false);
      }
    },
    [enabledFilter, pageSize]
  );

  useEffect(() => {
    if (hasAccess) fetchPage(0);
  }, [hasAccess, fetchPage]);

  useEffect(() => {
    if (!hasAccess) return;
    fetchPage(0);
  }, [enabledFilter, pageSize, hasAccess, fetchPage]);

  useEffect(() => {
    if (!hasAccess) return;
    const t = setTimeout(() => fetchPage(0), 350);
    return () => clearTimeout(t);
  }, [q, hasAccess, fetchPage]);

  const onImport = useCallback(async () => {
    setError("");
    setImportBusy(true);
    setImportRunning(true);
    try {
      await importSymbols(universe);
      await fetchPage(0);
    } catch (e) {
      setError(getErrorMessage(e) || "Import failed.");
    } finally {
      setImportBusy(false);
    }
  }, [universe, fetchPage]);

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
    [enabledFilter, pageIdx, page, fetchPage]
  );

  const totalPages = page?.totalPages ?? 0;
  const totalElements = page?.totalElements ?? 0;

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
        <div className="symbols-container page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
          <div className="symbols-card page-card p-4 sm:p-6 rounded-2xl max-w-6xl mx-auto w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h1 className="page-title text-2xl sm:text-3xl font-bold">
                SYMBOLS
              </h1>
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
            />

            <div className="min-h-[28px] mb-1">
              {error && <StatusMessage message={error} />}
            </div>

            <SymbolsTableDesktop page={page} mode="admin" onToggle={onToggle} />
            <SymbolsListMobile page={page} mode="admin" onToggle={onToggle} />

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
      )}
    </>
  );
}
