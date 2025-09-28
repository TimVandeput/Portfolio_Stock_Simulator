export type TransactionType = "BUY" | "SELL";

export interface BuyOrderRequest {
  symbol: string;
  quantity: number;
  expectedPrice: number;
}

export interface SellOrderRequest {
  symbol: string;
  quantity: number;
  expectedPrice: number;
}

export interface TradeExecutionResponse {
  symbol: string;
  quantity: number;
  executionPrice: number;
  totalAmount: number;
  transactionType: TransactionType;
  newCashBalance: number;
  newSharesOwned: number;
  message: string;
  executedAt: string;
}

export interface PortfolioHoldingDTO {
  symbol: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
}

export interface PortfolioSummaryDTO {
  cashBalance: number;
  totalMarketValue: number;
  totalPortfolioValue: number;
  totalUnrealizedGainLoss: number;
  holdings: PortfolioHoldingDTO[];
}

export interface Transaction {
  id: number;
  userId?: number;
  symbol: string;
  symbolName: string;
  quantity: number;
  pricePerShare: number;
  totalAmount: number;
  profitLoss: number | null;
  type: TransactionType;
  executedAt: string;
}
