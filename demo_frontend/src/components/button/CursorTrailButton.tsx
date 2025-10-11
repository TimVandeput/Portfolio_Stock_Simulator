"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import { useCursorTrailSettings } from "@/hooks/useCursorTrailSettings";
import type { BaseComponentProps } from "@/types/components";

interface CursorTrailButtonProps extends BaseComponentProps {
  onTrailChange?: (enabled: boolean) => void;
}

export default function CursorTrailButton({
  onTrailChange,
}: CursorTrailButtonProps) {
  const { cursorTrailEnabled, toggleCursorTrail } = useCursorTrailSettings(
    false,
    onTrailChange
  );

  return (
    <button
      className="hidden md:inline-flex neu-button p-3 rounded-xl font-bold active:translate-y-0.5 active:duration-75"
      title={
        cursorTrailEnabled ? "Disable Cursor Trail" : "Enable Cursor Trail"
      }
      onClick={toggleCursorTrail}
    >
      {cursorTrailEnabled ? (
        <DynamicIcon
          iconName="mouse-pointer-2"
          size={20}
          style={{ color: "orange" }}
        />
      ) : (
        <DynamicIcon
          iconName="mouse-pointer-ban"
          size={20}
          style={{ color: "orange" }}
        />
      )}
    </button>
  );
}
