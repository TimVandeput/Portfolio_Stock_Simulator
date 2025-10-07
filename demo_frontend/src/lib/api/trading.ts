import { HttpClient, ApiError } from "@/lib/api/http";
import type {
  BuyOrderRequest,
  SellOrderRequest,
  TradeExecutionResponse,
  Transaction,
} from "@/types/trading";

const client = new HttpClient();

export async function executeBuyOrder(
  userId: number,
  request: BuyOrderRequest
): Promise<TradeExecutionResponse> {
  try {
    return await client.post<TradeExecutionResponse>(
      `/api/trades/${userId}/buy`,
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

export async function executeSellOrder(
  userId: number,
  request: SellOrderRequest
): Promise<TradeExecutionResponse> {
  try {
    return await client.post<TradeExecutionResponse>(
      `/api/trades/${userId}/sell`,
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

export async function getTransactionHistory(
  userId: number
): Promise<Transaction[]> {
  try {
    return await client.get<Transaction[]>(`/api/trades/${userId}/history`);
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
