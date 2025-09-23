"use client";

import NeumorphicButton from "@/components/button/NeumorphicButton";
import type { Universe } from "@/types/symbol";
import type { BaseComponentProps } from "@/types/components";

export interface UniverseImportBarProps extends BaseComponentProps {
  universe: Universe;
  setUniverse: (u: Universe) => void;
  onImport: () => void;
  importBusy: boolean;
  importRunning: boolean;
}

export default function UniverseImportBar({
  universe,
  setUniverse,
  onImport,
  importBusy,
  importRunning,
}: UniverseImportBarProps) {
  const disabled = importBusy || importRunning;

  return (
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

      <div className="w-[160px] mb-3 sm:mb-0">
        <NeumorphicButton
          onClick={onImport}
          disabled={disabled}
          aria-live="polite"
          aria-busy={disabled}
          className="w-full "
        >
          {disabled ? "Importing…" : "Import / Refresh"}
        </NeumorphicButton>
      </div>
    </div>
  );
}
