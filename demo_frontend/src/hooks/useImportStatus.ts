import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getImportStatus } from "@/lib/api/symbols";
import type { ImportStatusDTO } from "@/types/symbol";

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
