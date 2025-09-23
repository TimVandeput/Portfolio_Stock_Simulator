"use client";

import { useState, useEffect } from "react";
import { BREAKPOINTS } from "@/lib/constants/breakpoints";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia(BREAKPOINTS.MOBILE_DOWN).matches;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return { isMobile };
}
