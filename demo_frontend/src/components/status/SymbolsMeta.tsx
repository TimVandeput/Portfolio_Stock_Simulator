"use client";

import type { ImportSummaryDTO } from "@/types/symbol";

type Props = {
  lastImportedAt: string | null;
  lastSummary: ImportSummaryDTO | null;
};

export default function SymbolsMeta({ lastImportedAt, lastSummary }: Props) {
  return (
    <div className="text-xs sm:text-sm opacity-80 mb-3 flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-4">
      <span>
        Last imported:{" "}
        {lastImportedAt ? new Date(lastImportedAt).toLocaleString() : "never"}
      </span>
      {lastSummary && (
        <span>
          Summary: +{lastSummary.imported} / upd {lastSummary.updated} / skip{" "}
          {lastSummary.skipped}
        </span>
      )}
    </div>
  );
}
