"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useAccessControl } from "@/hooks/useAuth";
import NoAccessModal from "@/components/ui/NoAccessModal";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import StatusMessage from "@/components/status/StatusMessage";
import Loader from "@/components/ui/Loader";
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
    if (!isLoading && !hasAccess && accessError) setShowModal(true);
  }, [isLoading, hasAccess, accessError]);

  if (showModal) {
    return (
      <NoAccessModal
        isOpen={showModal}
        accessType={accessError?.reason}
        message={accessError?.message || "Access denied"}
        onClose={() => setShowModal(false)}
      />
    );
  }

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

  useEffect(() => {
    if (isLoading || !hasAccess || showModal) return;

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
      } finally {
        if (!stop) timer = setTimeout(poll, 3000);
      }
    }

    poll();
    return () => {
      stop = true;
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, hasAccess, showModal]);

  const qRef = useRef(q);
  useEffect(() => void (qRef.current = q), [q]);

  const fetchPage = useCallback(
    async (idx = pageIdx) => {
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
    [enabledFilter, pageIdx, pageSize]
  );

  useEffect(() => {
    if (!isLoading && hasAccess) fetchPage(0);
  }, [enabledFilter, pageSize, fetchPage, isLoading, hasAccess]);

  useEffect(() => {
    const t = setTimeout(() => fetchPage(0), 350);
    return () => clearTimeout(t);
  }, [q, fetchPage]);

  const onImport = useCallback(async () => {
    setError("");
    try {
      await importSymbols(universe);
      await fetchPage(0);
    } catch (e) {
      setError(getErrorMessage(e) || "Import failed.");
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

  const enabledChips = useMemo(
    () => (
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            enabledFilter === "all" ? "bg-[var(--btn-bg)] shadow" : ""
          }`}
          onClick={() => setEnabledFilter("all")}
        >
          All
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            enabledFilter === "enabled" ? "bg-[var(--btn-bg)] shadow" : ""
          }`}
          onClick={() => setEnabledFilter("enabled")}
        >
          Enabled
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            enabledFilter === "disabled" ? "bg-[var(--btn-bg)] shadow" : ""
          }`}
          onClick={() => setEnabledFilter("disabled")}
        >
          Disabled
        </button>
      </div>
    ),
    [enabledFilter]
  );

  return (
    <div className="symbols-container page-container w-full font-sans px-6 py-6">
      <div className="symbols-card page-card p-6 rounded-2xl max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title text-3xl font-bold">SYMBOLS</h1>
          <div className="flex items-center gap-3">
            <select
              value={universe}
              onChange={(e) => setUniverse(e.target.value as Universe)}
              className="px-3 py-2 rounded-xl border bg-transparent"
            >
              <option value="NDX">NASDAQ-100</option>
              <option value="GSPC">S&amp;P 500</option>
            </select>
            <NeumorphicButton onClick={onImport} disabled={importRunning}>
              {importRunning ? "Importing…" : "Import / Refresh"}
            </NeumorphicButton>
          </div>
        </div>

        <div className="text-sm opacity-80 mb-3 flex flex-wrap items-center gap-4">
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

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <NeumorphicInput
            type="text"
            placeholder="Search symbol or name…"
            value={q}
            onChange={setQ}
            className="min-w-[260px]"
          />
          {enabledChips}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm opacity-80">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(parseInt(e.target.value))}
              className="px-2 py-1 rounded-xl border bg-transparent"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="min-h-[28px]">
          {error && <StatusMessage message={error} />}
        </div>

        <div className="rounded-2xl overflow-hidden border shadow-sm">
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
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8">
                    <div className="flex items-center justify-center">
                      <Loader />
                    </div>
                  </td>
                </tr>
              )}
              {!loading && page?.content?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center opacity-70">
                    No symbols found.
                  </td>
                </tr>
              )}
              {!loading &&
                page?.content?.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="px-4 py-3 font-semibold">{row.symbol}</td>
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
                            onChange={(e) => onToggle(row, e.target.checked)}
                            className="h-4 w-4 accent-[var(--primary)]"
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

        <div className="flex items-center justify-between mt-3">
          <div className="text-sm opacity-80">
            Page {pageIdx + 1} / {Math.max(totalPages, 1)} • Total{" "}
            {page?.totalElements ?? 0}
          </div>
          <div className="flex gap-2">
            <NeumorphicButton
              disabled={!canPrev || loading}
              onClick={() => fetchPage(pageIdx - 1)}
            >
              Prev
            </NeumorphicButton>
            <NeumorphicButton
              disabled={!canNext || loading}
              onClick={() => fetchPage(pageIdx + 1)}
            >
              Next
            </NeumorphicButton>
          </div>
        </div>
      </div>
    </div>
  );
}
