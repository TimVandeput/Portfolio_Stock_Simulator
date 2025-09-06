export type PriceEventType = "price" | "heartbeat";

export interface PriceEvent {
  type: PriceEventType;
  symbol: string;
  price: number;
  percentChange?: number;
  ts: number;
}
