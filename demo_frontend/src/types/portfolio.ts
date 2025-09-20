export interface PortfolioHolding {
  symbol: string;
  quantity: number;
  avgCostBasis: number;
  totalCost: number;
  lastTradeDate: string;
}

export interface PortfolioResponse {
  holdings: PortfolioHolding[];
  walletBalance: {
    cashBalance: number;
    totalValue: number;
    totalInvested: number;
  };
  summary: {
    totalPortfolioValue: number;
    totalUnrealizedPnL: number;
    totalRealizedPnL: number;
    totalPnLPercent: number;
  };
}
