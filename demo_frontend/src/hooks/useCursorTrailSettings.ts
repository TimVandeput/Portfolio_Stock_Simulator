"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookie, setCookie } from "@/lib/utils/cookies";

export function useCursorTrailSettings(
  isMobile: boolean,
  onTrailChange?: (enabled: boolean) => void
) {
  const [cursorTrailEnabled, setCursorTrailEnabled] = useState(false);

  useEffect(() => {
    const cookieValue = getCookie("cursorTrailEnabled");
    if (cookieValue === "true") {
      setCursorTrailEnabled(true);
    } else {
      setCursorTrailEnabled(false);
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      setCursorTrailEnabled(false);
      onTrailChange?.(false);
    } else {
      const savedValue = getCookie("cursorTrailEnabled");
      const enabled = savedValue === "true";
      setCursorTrailEnabled(enabled);
      onTrailChange?.(enabled);
    }
  }, [isMobile, onTrailChange]);

  useEffect(() => {
    if (!isMobile) {
      setCookie("cursorTrailEnabled", String(cursorTrailEnabled), {
        days: 365,
      });
    }
    onTrailChange?.(cursorTrailEnabled);
  }, [cursorTrailEnabled, isMobile, onTrailChange]);

  const toggleCursorTrail = useCallback(() => {
    setCursorTrailEnabled(!cursorTrailEnabled);
  }, [cursorTrailEnabled]);

  return {
    cursorTrailEnabled,
    toggleCursorTrail,
  };
}
