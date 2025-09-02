"use client";

import NeumorphicButton from "@/components/button/NeumorphicButton";
import type { Universe } from "@/types/symbol";

type Props = {
  universe: Universe;
  setUniverse: (u: Universe) => void;
  onImport: () => void;
  importBusy: boolean;
  importRunning: boolean;
};

export default function UniverseImportBar({
  universe,
  setUniverse,
  onImport,
  importBusy,
  importRunning,
}: Props) {
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

      <div className="w-[160px]">
        <NeumorphicButton
          onClick={onImport}
          disabled={disabled}
          aria-live="polite"
          aria-busy={disabled}
          className="w-full"
        >
          {disabled ? "Importing…" : "Import / Refresh"}
        </NeumorphicButton>
      </div>
    </div>
  );
}
