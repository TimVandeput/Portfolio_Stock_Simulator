/**
 * @fileoverview Cursor trail visual effect settings management hook.
 *
 * This hook manages cursor trail effect preferences with persistent storage
 * and mobile device considerations for optimal performance and user experience.
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookie, setCookie } from "@/lib/utils/cookies";

/**
 * Hook for managing cursor trail visual effect settings.
 *
 * @param isMobile - Whether the device is mobile (disables trail for performance)
 * @param onTrailChange - Optional callback when trail setting changes
 * @returns Cursor trail control object with state and toggle function
 */
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
