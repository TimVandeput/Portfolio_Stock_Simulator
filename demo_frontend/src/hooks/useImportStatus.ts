import { useEffect, useState } from "react";
import { getImportStatus } from "@/lib/api/symbols";
import type { ImportStatusDTO } from "@/types/symbol";

export function useImportStatus(pollMs = 3000) {
  const [status, setStatus] = useState<ImportStatusDTO | null>(null);

  useEffect(() => {
    let timer: any;
    let killed = false;

    async function tick() {
      try {
        const s = await getImportStatus();
        if (!killed) setStatus(s);
      } finally {
        if (!killed) timer = setTimeout(tick, pollMs);
      }
    }
    tick();
    return () => {
      killed = true;
      if (timer) clearTimeout(timer);
    };
  }, [pollMs]);

  return status;
}
