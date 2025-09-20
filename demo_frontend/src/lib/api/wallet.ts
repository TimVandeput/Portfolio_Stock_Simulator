import { HttpClient, ApiError } from "@/lib/api/http";
import type { AddCashRequest, WalletBalanceResponse } from "@/types/wallet";

const client = new HttpClient();

export async function getWalletBalance(
  userId: number
): Promise<WalletBalanceResponse> {
  try {
    return await client.get<WalletBalanceResponse>(
      `/api/wallet/${userId}/balance`
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

export async function addCash(
  userId: number,
  request: AddCashRequest
): Promise<WalletBalanceResponse> {
  try {
    return await client.post<WalletBalanceResponse>(
      `/api/wallet/${userId}/add-cash`,
      request
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
