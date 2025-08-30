"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function RotationPrompt() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const checkDeviceAndOrientation = () => {
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

      const isNotDesktop = window.innerWidth <= 1366;

      const shouldShowForPhone =
        isMobileDevice && !isTablet && isLandscape && isNotDesktop;

      setShouldShow(shouldShowForPhone);
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
  }, []);

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <RotateCcw
        className="w-16 h-16 mb-4 animate-pulse"
        style={{ color: "var(--text-primary)" }}
      />
      <h2 className="text-xl font-bold mb-2 text-center">
        Please Rotate Your Device
      </h2>
      <p className="text-center text-sm opacity-80">
        This app is designed for portrait orientation
      </p>
    </div>
  );
}
