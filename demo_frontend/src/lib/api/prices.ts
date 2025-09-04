import { HttpClient, ApiError } from "@/lib/api/http";

const client = new HttpClient();

// Yahoo Finance Quote type (matches your backend)
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

/**
 * Get current prices for all enabled symbols (bulk fetch from Yahoo Finance)
 * Perfect for overview pages - loads all 674 symbols in ~5 seconds
 */
export async function getAllCurrentPrices(): Promise<
  Record<string, YahooQuote>
> {
  try {
    return await client.get<Record<string, YahooQuote>>("/api/prices/current");
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}

/**
 * Get current price for a specific symbol
 */
export async function getCurrentPrice(symbol: string): Promise<YahooQuote> {
  try {
    return await client.get<YahooQuote>(
      `/api/prices/current/${encodeURIComponent(symbol)}`
    );
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}

/**
 * DEPRECATED: Use getAllCurrentPrices() instead for better performance
 */
export async function getLastQuote(symbol: string): Promise<YahooQuote> {
  console.warn("getLastQuote() is deprecated. Use getCurrentPrice() instead.");
  return getCurrentPrice(symbol);
}
