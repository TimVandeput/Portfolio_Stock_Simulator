import type {
  PriceEvent,
  StreamHandlers,
  StreamController,
} from "@/types/stream";
import { getCookie } from "@/lib/utils/cookies";

export function openPriceStream(
  symbols: string[],
  handlers: StreamHandlers = {}
): StreamController {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const mkUrl = () => {
    const token = getCookie("auth.access");
    const params = new URLSearchParams({
      symbols: symbols.join(","),
      v: String(Date.now()),
    });
    if (token) {
      params.set("token", token);
    }
    return `${baseUrl}/api/stream/prices?${params.toString()}`;
  };

  let es: EventSource | null = null;
  let closed = false;
  let reopenTimer: ReturnType<typeof setTimeout> | null = null;
  let backoff = 800;

  const clearReopen = () => {
    if (reopenTimer) {
      clearTimeout(reopenTimer);
      reopenTimer = null;
    }
  };

  const scheduleReopen = () => {
    if (closed) return;
    clearReopen();
    reopenTimer = setTimeout(() => {
      backoff = Math.min(backoff * 1.5, 5_000);
      open();
    }, backoff);
  };

  const open = () => {
    if (closed) return;
    clearReopen();

    es = new EventSource(mkUrl(), {
      withCredentials: true,
    });

    es.onopen = (ev) => {
      console.log("✅ SSE Connected");
      console.log(
        "🔍 Streaming symbols:",
        symbols.slice(0, 5),
        `(${symbols.length} total)`
      );
      backoff = 800;
      handlers.onOpen?.(ev);
    };

    es.onmessage = (evt) => {
      try {
        const data = JSON.parse((evt as MessageEvent).data) as PriceEvent;
        if (data?.type === "price") handlers.onPrice?.(data);
        else if (data?.type === "heartbeat") handlers.onHeartbeat?.(data);
      } catch (e) {
        console.error("❌ SSE PARSE ERROR:", e);
      }
    };

    es.addEventListener("price", (evt) => {
      try {
        const data = JSON.parse((evt as MessageEvent).data) as PriceEvent;
        console.log(
          "💰 PRICE UPDATE:",
          data.symbol,
          data.price,
          `(${data.percentChange}%)`
        );
        handlers.onPrice?.(data);
      } catch (e) {
        console.error("❌ PRICE PARSE ERROR:", e);
      }
    });

    es.addEventListener("heartbeat", (evt) => {
      try {
        const data = JSON.parse((evt as MessageEvent).data) as PriceEvent;
        console.log("💓 HEARTBEAT received");
        handlers.onHeartbeat?.(data);
      } catch {
        /* ignore */
      }
    });

    es.onerror = (ev) => {
      console.error("🚨 SSE ERROR");
      handlers.onError?.(ev);

      if (!closed) {
        if (es && es.readyState === 2 /* CLOSED */) {
          console.log("🔄 Reconnecting...");
          try {
            es.close();
          } catch {}
          es = null;
          scheduleReopen();
        }
      }
    };
  };

  open();

  return {
    close: () => {
      closed = true;
      clearReopen();
      try {
        es?.close();
      } catch {}
      es = null;
      handlers.onClose?.();
    },
    readyState: () => (es ? es.readyState : 2),
  };
}
