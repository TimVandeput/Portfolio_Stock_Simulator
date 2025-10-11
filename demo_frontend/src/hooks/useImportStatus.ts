/**
 * @fileoverview Import status tracking hook for symbol data management.
 *
 * This hook monitors the status of symbol imports and provides real-time updates
 * on import progress, completion status, and refresh capabilities for administrative functions.
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getImportStatus } from "@/lib/api/symbols";
import type { ImportStatusDTO } from "@/types/symbol";

/**
 * Hook for tracking symbol import status and providing refresh capabilities.
 *
 * @returns Import status object with current status and refresh function
 */
export function useImportStatus() {
  const [status, setStatus] = useState<ImportStatusDTO | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isAuthenticated, role, isLoading } = useAuth();

  const refresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (isLoading || !isAuthenticated || role !== "ROLE_ADMIN") {
      return;
    }

    let timer: any;
    let killed = false;

    async function tick() {
      try {
        const s = await getImportStatus();
        if (!killed) setStatus(s);
      } catch (error) {
      } finally {
        const pollMs = status?.running ? 10000 : 60000;
        if (!killed) timer = setTimeout(tick, pollMs);
      }
    }
    tick();
    return () => {
      killed = true;
      if (timer) clearTimeout(timer);
    };
  }, [status?.running, refreshTrigger, isLoading, isAuthenticated, role]);

  return { ...status, refresh };
}
