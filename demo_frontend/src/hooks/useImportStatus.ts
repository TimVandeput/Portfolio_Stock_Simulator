import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getImportStatus } from "@/lib/api/symbols";
import type { ImportStatusDTO } from "@/types/symbol";

export function useImportStatus() {
  const [status, setStatus] = useState<ImportStatusDTO | null>(null);
  const { isAuthenticated, role, isLoading } = useAuth();

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
  }, [status?.running, isLoading, isAuthenticated, role]);

  return status;
}
