export interface Price {
  last?: number;
  percentChange?: number;
  lastUpdate?: number;
}

export type Prices = Record<string, Price>;

export interface PriceContextType {
  prices: Prices;
  pulsatingSymbols: Set<string>;
  isInitialLoading: boolean;
  hasInitialPrices: boolean;
  error: string | null;
  refreshPrices: () => Promise<void>;
}
