"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

export function useLogoutFlow() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const startLogout = useCallback(() => {
    setIsLoggingOut(true);
  }, []);

  const endLogout = useCallback(() => {
    setIsLoggingOut(false);
  }, []);

  useEffect(() => {
    if (pathname === "/" && isLoggingOut) {
      setIsLoggingOut(false);
    }
  }, [pathname, isLoggingOut]);

  return {
    isLoggingOut,
    startLogout,
    endLogout,
  };
}
