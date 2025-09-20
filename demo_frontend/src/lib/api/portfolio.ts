import { HttpClient, ApiError } from "@/lib/api/http";
import type { PortfolioResponse, PortfolioHolding } from "@/types/portfolio";

const client = new HttpClient();

export async function getUserPortfolio(
  userId: number
): Promise<PortfolioResponse> {
  try {
    return await client.get<PortfolioResponse>(`/api/portfolio/${userId}`);
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

export async function getUserHolding(
  userId: number,
  symbol: string
): Promise<PortfolioHolding> {
  try {
    return await client.get<PortfolioHolding>(
      `/api/portfolio/${userId}/holdings/${symbol}`
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
