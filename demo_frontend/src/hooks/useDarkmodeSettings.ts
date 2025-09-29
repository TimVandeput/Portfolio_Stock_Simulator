"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookie, setCookie } from "@/lib/utils/cookies";

export function useDarkmodeSettings() {
  const [isDark, setIsDark] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const savedTheme = getCookie("theme") || "light";
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      *, *::before, *::after {
        transition: none !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);

    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      setCookie("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      setCookie("theme", "light");
    }

    setTimeout(() => {
      document.head.removeChild(style);
    }, 50);
  }, [isDark]);

  return {
    isDark,
    toggleTheme,
  };
}
