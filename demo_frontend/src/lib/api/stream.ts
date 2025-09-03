import type { PriceEvent } from "@/types";

type Handlers = {
  onPrice?: (e: PriceEvent) => void;
  onHeartbeat?: (e: PriceEvent) => void;
  onOpen?: (ev: Event) => void;
  onError?: (ev: Event) => void;
  onClose?: () => void;
};

export type StreamController = {
  close: () => void;
  readyState: () => number;
};

export function openPriceStream(
  symbols: string[],
  handlers: Handlers = {}
): StreamController {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const params = new URLSearchParams({ symbols: symbols.join(",") });
  const url = `${baseUrl}/api/stream/prices?${params.toString()}`;

  let es: EventSource | null = null;
  let closed = false;

  const open = () => {
    if (closed) return;
    es = new EventSource(url, { withCredentials: true });

    es.onopen = (ev) => handlers.onOpen?.(ev);

    es.onerror = (ev) => {
      handlers.onError?.(ev);
      if (es && es.readyState === 2 && !closed) {
      }
    };

    es.addEventListener("price", (evt) => {
      try {
        const data = JSON.parse((evt as MessageEvent).data) as PriceEvent;
        handlers.onPrice?.(data);
      } catch {
        // ignore malformed
      }
    });

    es.addEventListener("heartbeat", (evt) => {
      try {
        const data = JSON.parse((evt as MessageEvent).data) as PriceEvent;
        handlers.onHeartbeat?.(data);
      } catch {
        // ignore malformed
      }
    });
  };

  open();

  return {
    close: () => {
      closed = true;
      if (es) {
        es.close();
        es = null;
      }
      handlers.onClose?.();
    },
    readyState: () => (es ? es.readyState : 2),
  };
}
