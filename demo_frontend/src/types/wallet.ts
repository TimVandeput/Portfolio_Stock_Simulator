export interface AddCashRequest {
  amount: number;
  reason: string;
}

export interface WalletBalanceResponse {
  cashBalance: number;
  totalMarketValue: number;
  totalPortfolioValue: number;
}
