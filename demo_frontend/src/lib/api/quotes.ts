import { HttpClient, ApiError } from "@/lib/api/http";
import type { QuoteDTO } from "@/types";

const client = new HttpClient();

export async function getLastQuote(symbol: string): Promise<QuoteDTO> {
  try {
    return await client.get<QuoteDTO>(
      `/api/quotes/last?symbol=${encodeURIComponent(symbol)}`
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
