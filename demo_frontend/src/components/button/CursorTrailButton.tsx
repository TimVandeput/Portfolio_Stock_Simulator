"use client";

import { useState, useEffect } from "react";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { getCookie, setCookie } from "@/lib/utils/cookies";
import { BREAKPOINTS } from "@/lib/constants/breakpoints";
import type { BaseComponentProps } from "@/types/components";

interface CursorTrailButtonProps extends BaseComponentProps {
  onTrailChange?: (enabled: boolean) => void;
}

export default function CursorTrailButton({
  onTrailChange,
}: CursorTrailButtonProps) {
  const [cursorTrailEnabled, setCursorTrailEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const cookieValue = getCookie("cursorTrailEnabled");
    if (cookieValue === "true") {
      setCursorTrailEnabled(true);
    } else {
      setCursorTrailEnabled(false);
    }

    const checkMobile = () => {
      const mobile = window.matchMedia(BREAKPOINTS.MOBILE_DOWN).matches;
      setIsMobile(mobile);
      if (mobile) {
        setCursorTrailEnabled(false);
        onTrailChange?.(false);
      } else {
        const savedValue = getCookie("cursorTrailEnabled");
        const enabled = savedValue === "true";
        setCursorTrailEnabled(enabled);
        onTrailChange?.(enabled);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [onTrailChange]);

  useEffect(() => {
    if (!isMobile) {
      setCookie("cursorTrailEnabled", String(cursorTrailEnabled), {
        days: 365,
      });
    }
    onTrailChange?.(cursorTrailEnabled);
  }, [cursorTrailEnabled, isMobile, onTrailChange]);

  const handleToggle = () => {
    setCursorTrailEnabled(!cursorTrailEnabled);
  };

  if (isMobile) {
    return null;
  }

  return (
    <button
      className="neu-button p-3 rounded-xl font-bold active:translate-y-0.5 active:duration-75"
      title={
        cursorTrailEnabled ? "Disable Cursor Trail" : "Enable Cursor Trail"
      }
      onClick={handleToggle}
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
