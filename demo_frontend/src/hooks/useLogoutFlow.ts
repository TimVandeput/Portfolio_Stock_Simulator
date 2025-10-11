/**
 * @fileoverview Logout flow management hook with state tracking.
 *
 * This hook manages the logout process state and provides utilities
 * for tracking logout progress and completion across the application.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * Hook for managing logout flow state and completion tracking.
 *
 * @returns Logout flow control object with state and management functions
 */
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
