"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAccessControl } from "@/hooks/useAuth";
import NoAccessModal from "@/components/ui/NoAccessModal";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import NeumorphicInput from "@/components/input/NeumorphicInput";
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

  const onToggle = useCallback(async (row: SymbolDTO, next: boolean) => {
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
  }, []);

  const totalPages = page?.totalPages ?? 0;
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
        <div className="symbols-container page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
          <div className="symbols-card page-card p-4 sm:p-6 rounded-2xl max-w-6xl mx-auto w-full">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
              <h1 className="page-title text-2xl sm:text-3xl font-bold">
                SYMBOLS
              </h1>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <select
                  value={universe}
                  onChange={(e) => setUniverse(e.target.value as Universe)}
                  className="px-3 py-2 rounded-xl border bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] w-full sm:w-auto"
                  aria-label="Universe"
                >
                  <option value="NDX">NASDAQ-100</option>
                  <option value="GSPC">S&amp;P 500</option>
                </select>

                <div className="w-[160px]">
                  <NeumorphicButton
                    onClick={onImport}
                    disabled={importBusy || importRunning}
                    aria-live="polite"
                    aria-busy={importBusy || importRunning}
                    className="w-full"
                  >
                    {importBusy || importRunning
                      ? "Importing…"
                      : "Import / Refresh"}
                  </NeumorphicButton>
                </div>
              </div>
            </div>

            <div className="text-xs sm:text-sm opacity-80 mb-3 flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-4">
              <span>
                Last imported:{" "}
                {lastImportedAt
                  ? new Date(lastImportedAt).toLocaleString()
                  : "never"}
              </span>
              {lastSummary && (
                <span>
                  Summary: +{lastSummary.imported} / upd {lastSummary.updated} /
                  skip {lastSummary.skipped}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 mb-3">
              <NeumorphicInput
                type="text"
                placeholder="Search symbol or name…"
                value={q}
                onChange={setQ}
                className="w-full sm:min-w-[260px]"
              />

              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm border transition-colors chip ${
                    enabledFilter === "all" ? "chip-selected" : ""
                  }`}
                  onClick={() => setEnabledFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm border transition-colors chip ${
                    enabledFilter === "enabled" ? "chip-selected" : ""
                  }`}
                  onClick={() => setEnabledFilter("enabled")}
                >
                  Enabled
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm border transition-colors chip ${
                    enabledFilter === "disabled" ? "chip-selected" : ""
                  }`}
                  onClick={() => setEnabledFilter("disabled")}
                >
                  Disabled
                </button>
              </div>

              <div className="flex items-center gap-2 sm:ml-auto">
                <span className="text-sm opacity-80 hidden xs:inline">
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
            </div>

            {/* Error row */}
            <div className="min-h-[28px] mb-1">
              {error && <StatusMessage message={error} />}
            </div>

            <div className="hidden md:block rounded-2xl overflow-hidden border shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--surface)]">
                    <tr className="text-left">
                      <th className="px-4 py-3">Symbol</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Exchange</th>
                      <th className="px-4 py-3">Currency</th>
                      <th className="px-4 py-3 text-center">Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page?.content?.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center opacity-70"
                        >
                          No symbols found.
                        </td>
                      </tr>
                    )}
                    {page?.content?.map((row) => (
                      <tr key={row.id} className="border-t">
                        <td className="px-4 py-3 font-semibold">
                          {row.symbol}
                        </td>
                        <td className="px-4 py-3">{row.name}</td>
                        <td className="px-4 py-3">{row.exchange}</td>
                        <td className="px-4 py-3">{row.currency}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            {row.inUse && (
                              <span className="px-2 py-0.5 text-[11px] rounded-full border">
                                In use
                              </span>
                            )}
                            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={row.enabled}
                                onChange={(e) =>
                                  onToggle(row, e.target.checked)
                                }
                                className="h-4 w-4 accent-[var(--primary)]"
                                aria-label={`Toggle ${row.symbol}`}
                              />
                              <span className="opacity-80">
                                {row.enabled ? "On" : "Off"}
                              </span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="md:hidden">
              {(!page || page.content.length === 0) && (
                <div className="rounded-2xl border shadow-sm p-4 text-center opacity-70">
                  No symbols found.
                </div>
              )}

              <ul className="space-y-3">
                {page?.content?.map((row) => (
                  <li
                    key={row.id}
                    className="rounded-2xl border shadow-sm p-4 bg-[var(--background)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-base">
                            {row.symbol}
                          </span>
                          {row.inUse && (
                            <span className="px-2 py-0.5 text-[11px] rounded-full border">
                              In use
                            </span>
                          )}
                        </div>
                        <div className="text-sm opacity-80">{row.name}</div>
                      </div>

                      <label className="inline-flex items-center gap-2 cursor-pointer select-none shrink-0">
                        <input
                          type="checkbox"
                          checked={row.enabled}
                          onChange={(e) => onToggle(row, e.target.checked)}
                          className="h-4 w-4 accent-[var(--primary)]"
                          aria-label={`Toggle ${row.symbol}`}
                        />
                        <span className="opacity-80 text-sm">
                          {row.enabled ? "On" : "Off"}
                        </span>
                      </label>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-xl border p-2">
                        <div className="opacity-70">Exchange</div>
                        <div>{row.exchange}</div>
                      </div>
                      <div className="rounded-xl border p-2">
                        <div className="opacity-70">Currency</div>
                        <div>{row.currency}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4">
              <div className="text-sm opacity-80 text-center sm:text-left">
                Page {pageIdx + 1} / {Math.max(totalPages, 1)} • Total{" "}
                {page?.totalElements ?? 0}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <NeumorphicButton
                  disabled={!canPrev || loading}
                  onClick={() => fetchPage(pageIdx - 1)}
                  aria-label="Previous page"
                >
                  Prev
                </NeumorphicButton>

                <div className="flex flex-wrap items-center justify-center gap-1">
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

                <NeumorphicButton
                  disabled={!canNext || loading}
                  onClick={() => fetchPage(pageIdx + 1)}
                  aria-label="Next page"
                >
                  Next
                </NeumorphicButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
