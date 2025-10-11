/**
 * @fileoverview Device orientation detection hook for mobile UX optimization.
 *
 * This hook detects mobile devices and their orientation to provide appropriate
 * user interface guidance, particularly for landscape-optimized content views.
 * It helps ensure optimal user experience across different device orientations.
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook for detecting device orientation and providing rotation guidance.
 *
 * Detects mobile devices and orientation changes to show appropriate UI hints
 * for landscape-optimized views and better user experience.
 *
 * @returns Boolean indicating whether rotation prompt should be displayed
 *
 * @example
 * ```tsx
 * function App() {
 *   const shouldShowRotationPrompt = useDeviceOrientation();
 *
 *   return (
 *     <div>
 *       {shouldShowRotationPrompt && <RotationPrompt />}
 *       <MainContent />
 *     </div>
 *   );
 * }
 * ```
 */
export function useDeviceOrientation() {
  const [shouldShow, setShouldShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkDeviceAndOrientation = () => {
      try {
        const isMobileDevice =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ) ||
          "ontouchstart" in window ||
          navigator.maxTouchPoints > 0;

        const isTablet =
          /iPad/i.test(navigator.userAgent) ||
          (/Android/i.test(navigator.userAgent) &&
            !/Mobile/i.test(navigator.userAgent)) ||
          (window.innerWidth >= 768 && window.innerHeight >= 768);

        const isLandscape = window.innerHeight < window.innerWidth;

        const hasFinePrecisionPointer =
          window.matchMedia("(pointer: fine)").matches;
        const hasHoverCapability = window.matchMedia("(hover: hover)").matches;

        const isDesktop =
          hasFinePrecisionPointer && hasHoverCapability && !isTablet;

        const shouldShowForPhone =
          isMobileDevice && !isTablet && isLandscape && !isDesktop;

        setShouldShow(shouldShowForPhone);
      } catch (error) {
        console.warn(
          "useDeviceOrientation: Error in checkDeviceAndOrientation",
          error
        );
        setShouldShow(false);
      }
    };

    checkDeviceAndOrientation();

    window.addEventListener("orientationchange", checkDeviceAndOrientation);
    window.addEventListener("resize", checkDeviceAndOrientation);

    return () => {
      window.removeEventListener(
        "orientationchange",
        checkDeviceAndOrientation
      );
      window.removeEventListener("resize", checkDeviceAndOrientation);
    };
  }, [pathname]);

  return { shouldShow };
}
