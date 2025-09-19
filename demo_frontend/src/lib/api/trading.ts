import { HttpClient, ApiError } from "@/lib/api/http";
import type {
  BuyOrderRequest,
  SellOrderRequest,
  TradeExecutionResponse,
  PortfolioSummaryDTO,
  Transaction,
} from "@/types/trading";

const client = new HttpClient();

export async function executeBuyOrder(
  request: BuyOrderRequest
): Promise<TradeExecutionResponse> {
  try {
    return await client.post<TradeExecutionResponse>(
      "/api/trading/buy",
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
  request: SellOrderRequest
): Promise<TradeExecutionResponse> {
  try {
    return await client.post<TradeExecutionResponse>(
      "/api/trading/sell",
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

export async function getTransactionHistory(): Promise<Transaction[]> {
  try {
    return await client.get<Transaction[]>("/api/trading/transactions");
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

export async function getPortfolioSummary(): Promise<PortfolioSummaryDTO> {
  try {
    return await client.get<PortfolioSummaryDTO>("/api/trading/portfolio");
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
