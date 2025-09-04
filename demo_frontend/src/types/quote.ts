export interface QuoteDTO {
  current: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

export type YahooQuote = {
  symbol: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
  currency: string;
  marketCap: number | null;
  previousClose: number | null;
  dayHigh: number | null;
  dayLow: number | null;
  volume: number | null;
};
