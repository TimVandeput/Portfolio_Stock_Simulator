import { HttpClient, ApiError } from "@/lib/api/http";
import type { YahooQuote } from "@/types";

const client = new HttpClient();

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
