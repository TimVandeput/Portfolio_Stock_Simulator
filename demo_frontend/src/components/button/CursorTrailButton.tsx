"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useCursorTrailSettings } from "@/hooks/useCursorTrailSettings";
import type { BaseComponentProps } from "@/types/components";

interface CursorTrailButtonProps extends BaseComponentProps {
  onTrailChange?: (enabled: boolean) => void;
}

export default function CursorTrailButton({
  onTrailChange,
}: CursorTrailButtonProps) {
  const { isMobile } = useIsMobile();
  const { cursorTrailEnabled, toggleCursorTrail } = useCursorTrailSettings(
    isMobile,
    onTrailChange
  );

  if (isMobile) {
    return null;
  }

  return (
    <button
      className="neu-button p-3 rounded-xl font-bold active:translate-y-0.5 active:duration-75"
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
