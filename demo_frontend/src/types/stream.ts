export type PriceEventType = "price" | "heartbeat";

export interface PriceEvent {
  type: PriceEventType;
  symbol: string;
  price: number;
  percentChange?: number;
  timestamp?: number;
}

export interface StreamHandlers {
  onPrice?: (event: PriceEvent) => void;
  onHeartbeat?: (event: PriceEvent) => void;
  onOpen?: (ev: Event) => void;
  onError?: (ev: Event) => void;
  onClose?: () => void;
}

export interface StreamController {
  close: () => void;
  readyState: () => number;
}
