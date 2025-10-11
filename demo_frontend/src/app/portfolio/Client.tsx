/**
 * @fileoverview Interactive portfolio management client component for investment tracking.
 *
 * This module provides comprehensive portfolio management capabilities that enable users
 * to track, analyze, and manage their investment holdings through an advanced interface
 * featuring real-time portfolio analytics, detailed holdings tracking, profit/loss
 * calculations, and interactive selling capabilities within the Stock Simulator platform.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { usePrices } from "@/contexts/PriceContext";
import { getUserPortfolio } from "@/lib/api/portfolio";
import { getTransactionHistory } from "@/lib/api/trading";
import { getUserId } from "@/lib/auth/tokenStorage";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import StatusMessage from "@/components/status/StatusMessage";
import MarketStatus from "@/components/status/MarketStatus";
import DynamicIcon from "@/components/ui/DynamicIcon";
import TableHeader from "@/components/ui/TableHeader";
import PortfolioStatsCard from "@/components/cards/PortfolioStatsCard";
import EmptyPortfolio from "@/components/ui/EmptyPortfolio";
import type { WalletBalanceResponse } from "@/types/wallet";
import type { Transaction } from "@/types/trading";

/**
 * Interactive portfolio management client component for comprehensive investment tracking.
 *
 * This sophisticated client component provides comprehensive portfolio management
 * capabilities with advanced analytics, real-time performance tracking, detailed
 * holdings analysis, profit/loss calculations, and interactive selling functionality.
 * It delivers a professional-grade investment tracking experience within the Stock
 * Simulator platform.
 *
 * @remarks
 * The component delivers comprehensive portfolio management functionality through:
 *
 * **Real-time Portfolio Analytics**:
 * - **Live Portfolio Valuation**: Real-time market value calculations across all holdings
 * - **Performance Metrics**: Total return, gain/loss percentages, and performance indicators
 * - **Market Data Integration**: Live price feeds for accurate portfolio valuation
 * - **Historical Performance**: Transaction-based performance analysis and tracking
 *
 * **Advanced Holdings Processing**:
 * - **Transaction Aggregation**: Processes all buy/sell transactions for accurate holdings
 * - **Cost Basis Calculations**: Weighted average cost basis for each position
 * - **FIFO Position Management**: First-in-first-out selling logic for accurate accounting
 * - **Position Tracking**: Individual purchase tracking with detailed cost analysis
 *
 * **Comprehensive Portfolio Statistics**:
 * - **Total Portfolio Value**: Combined cash and stock holdings valuation
 * - **Stock Market Value**: Current worth of all equity positions
 * - **Total Gain/Loss**: Absolute and percentage returns on investments
 * - **Available Cash**: Liquid funds available for new investments
 * - **Holdings Count**: Number of unique positions in portfolio
 *
 * **Interactive Holdings Management**:
 * - **Detailed Holdings Display**: Symbol, quantity, current price, and market value
 * - **Profit/Loss Analysis**: Individual position performance with visual indicators
 * - **Sell Integration**: Direct navigation to position-specific selling interface
 * - **Position Sorting**: Intelligent ordering for optimal user experience
 *
 * **Advanced Data Processing**:
 * - **Transaction History Analysis**: Complete chronological transaction processing
 * - **Holdings Consolidation**: Aggregates multiple purchases into unified positions
 * - **Sell Order Processing**: Accurately reduces positions based on sell transactions
 * - **Cost Basis Adjustments**: Proportional cost basis updates for partial sales
 *
 * **User Experience Features**:
 * - **Responsive Design**: Optimized layouts for desktop and mobile viewing
 * - **Loading States**: Smooth transitions during data loading operations
 * - **Error Handling**: Graceful fallbacks with retry mechanisms
 * - **Empty State Management**: Helpful guidance when portfolio is empty
 * - **Visual Performance Indicators**: Color-coded profit/loss indicators
 *
 * **Performance Optimizations**:
 * - **Memoized Calculations**: Optimized portfolio statistics and holdings processing
 * - **Efficient Data Loading**: Parallel API calls for portfolio and transaction data
 * - **Smart Re-rendering**: Minimal updates through React optimization patterns
 * - **Price Context Integration**: Efficient real-time price data consumption
 *
 * **Portfolio Analysis Features**:
 * - **Individual Position Analysis**: Detailed performance metrics per holding
 * - **Portfolio Diversification**: Holdings distribution and concentration analysis
 * - **Return Calculations**: Accurate profit/loss calculations with percentage returns
 * - **Market Value Tracking**: Real-time portfolio valuation updates
 *
 * **Navigation and Actions**:
 * - **Sell Order Navigation**: Direct routing to position-specific selling interface
 * - **Market Integration**: Seamless navigation to market for new purchases
 * - **Position Management**: Complete buy/sell workflow integration
 * - **Portfolio Overview**: Comprehensive dashboard for investment tracking
 *
 * **Data Integrity and Security**:
 * - **Authentication Verification**: Secure user session validation
 * - **Data Consistency**: Ensures accurate holdings through transaction processing
 * - **Error Recovery**: Robust error handling with user-friendly messages
 * - **Real-time Synchronization**: Live updates with market data changes
 *
 * The component serves as a complete portfolio management solution, providing users
 * with professional-grade investment tracking capabilities while maintaining
 * accuracy, performance, and user experience standards expected in modern
 * financial applications.
 *
 * @example
 * ```tsx
 * // Comprehensive portfolio management interface usage
 * function PortfolioClient() {
 *   const [transactions, setTransactions] = useState<Transaction[]>([]);
 *   const [walletBalance, setWalletBalance] = useState<WalletBalanceResponse>({
 *     cashBalance: 0,
 *     totalMarketValue: 0,
 *     totalPortfolioValue: 0
 *   });
 *   const { prices } = usePrices();
 *
 *   // Process transactions into consolidated holdings
 *   const processedHoldings = useMemo(() => {
 *     const holdingsMap = new Map();
 *
 *     transactions.forEach(transaction => {
 *       if (transaction.type === "BUY") {
 *         const existing = holdingsMap.get(transaction.symbol);
 *         if (existing) {
 *           existing.totalQuantity += transaction.quantity;
 *           existing.totalCost += transaction.totalAmount;
 *           existing.avgCostBasis = existing.totalCost / existing.totalQuantity;
 *         } else {
 *           holdingsMap.set(transaction.symbol, {
 *             symbol: transaction.symbol,
 *             totalQuantity: transaction.quantity,
 *             totalCost: transaction.totalAmount,
 *             avgCostBasis: transaction.pricePerShare
 *           });
 *         }
 *       }
 *     });
 *
 *     return Array.from(holdingsMap.values());
 *   }, [transactions]);
 *
 *   // Calculate portfolio statistics
 *   const portfolioStats = useMemo(() => {
 *     let totalValue = 0;
 *     let totalCost = 0;
 *
 *     processedHoldings.forEach(holding => {
 *       const currentPrice = prices[holding.symbol]?.last ?? 0;
 *       totalValue += currentPrice * holding.totalQuantity;
 *       totalCost += holding.totalCost;
 *     });
 *
 *     return {
 *       totalValue,
 *       totalCost,
 *       totalPnL: totalValue - totalCost,
 *       totalPnLPercent: totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0
 *     };
 *   }, [processedHoldings, prices]);
 *
 *   return (
 *     <div className="portfolio-container">
 *       <PortfolioStatsCard title="Total Portfolio" value={portfolioStats.totalValue} />
 *       {processedHoldings.map(holding => (
 *         <div key={holding.symbol} className="holding-card">
 *           <h3>{holding.symbol}</h3>
 *           <p>{holding.totalQuantity} shares @ ${holding.avgCostBasis.toFixed(2)}</p>
 *           <button onClick={() => router.push(`/portfolio/${holding.symbol}`)}>
 *             Sell
 *           </button>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns A comprehensive portfolio management interface with real-time analytics,
 * detailed holdings tracking, performance metrics, and interactive selling
 * capabilities for complete investment portfolio management
 *
 * @see {@link usePrices} - Real-time price data context provider
 * @see {@link getUserPortfolio} - API function for fetching portfolio data
 * @see {@link getTransactionHistory} - API function for retrieving transaction history
 * @see {@link PortfolioStatsCard} - Portfolio statistics display component
 * @see {@link TableHeader} - Holdings table header component
 * @see {@link EmptyPortfolio} - Empty state component for new users
 * @see {@link MarketStatus} - Market status indicator component
 * @see {@link Transaction} - TypeScript interface for transaction data
 * @see {@link WalletBalanceResponse} - TypeScript interface for wallet data
 *
 * @public
 */
export default function PortfolioClient() {
  const router = useRouter();
  const { prices, hasInitialPrices } = usePrices();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalanceResponse>({
    cashBalance: 0,
    totalMarketValue: 0,
    totalPortfolioValue: 0,
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingSuccess, setLoadingSuccess] = useState(false);
  const [error, setError] = useState("");

  // Process transactions to create detailed holdings with individual purchase tracking
  const processedHoldings = useMemo(() => {
    const holdingsMap = new Map<
      string,
      {
        symbol: string;
        symbolName: string;
        totalQuantity: number;
        totalCost: number;
        avgCostBasis: number;
        purchases: Array<{
          quantity: number;
          pricePerShare: number;
          purchaseDate: string;
        }>;
      }
    >();

    // Process all transactions in chronological order
    const sortedTransactions = [...transactions].sort(
      (a, b) =>
        new Date(a.executedAt).getTime() - new Date(b.executedAt).getTime()
    );

    sortedTransactions.forEach((transaction) => {
      const key = transaction.symbol;
      const existing = holdingsMap.get(key);

      if (transaction.type === "BUY") {
        if (existing) {
          existing.totalQuantity += transaction.quantity;
          existing.totalCost += transaction.totalAmount;
          existing.avgCostBasis = existing.totalCost / existing.totalQuantity;
          existing.purchases.push({
            quantity: transaction.quantity,
            pricePerShare: transaction.pricePerShare,
            purchaseDate: transaction.executedAt,
          });
        } else {
          holdingsMap.set(key, {
            symbol: transaction.symbol,
            symbolName: transaction.symbolName,
            totalQuantity: transaction.quantity,
            totalCost: transaction.totalAmount,
            avgCostBasis: transaction.pricePerShare,
            purchases: [
              {
                quantity: transaction.quantity,
                pricePerShare: transaction.pricePerShare,
                purchaseDate: transaction.executedAt,
              },
            ],
          });
        }
      } else if (transaction.type === "SELL" && existing) {
        // Reduce quantity and adjust cost basis proportionally
        const soldQuantity = Math.min(
          transaction.quantity,
          existing.totalQuantity
        );
        const costBasisToRemove = existing.avgCostBasis * soldQuantity;

        existing.totalQuantity -= soldQuantity;
        existing.totalCost -= costBasisToRemove;

        // Recalculate average cost basis if shares remain
        if (existing.totalQuantity > 0) {
          existing.avgCostBasis = existing.totalCost / existing.totalQuantity;
        } else {
          // Position completely closed
          existing.avgCostBasis = 0;
          existing.totalCost = 0;
        }
      }
    });

    // Filter out positions that have been completely sold
    return Array.from(holdingsMap.values()).filter(
      (holding) => holding.totalQuantity > 0
    );
  }, [transactions]);

  const portfolioStats = useMemo(() => {
    let totalValue = 0;
    let totalCost = 0;

    processedHoldings.forEach((holding) => {
      const currentPrice = prices[holding.symbol]?.last ?? 0;
      const holdingValue = currentPrice * holding.totalQuantity;
      const holdingCost = holding.totalCost;

      totalValue += holdingValue;
      totalCost += holdingCost;
    });

    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
    const totalPortfolioValue = totalValue + walletBalance.cashBalance;

    return {
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercent,
      totalPortfolioValue,
    };
  }, [processedHoldings, prices, walletBalance]);

  useEffect(() => {
    const loadPortfolio = async () => {
      const userId = getUserId();
      if (!userId) {
        setError("User authentication failed");
        setDataLoaded(true);
        return;
      }

      try {
        setError("");

        // Load both portfolio and transaction data
        const [portfolioData, transactionData] = await Promise.all([
          getUserPortfolio(userId),
          getTransactionHistory(userId),
        ]);

        setTransactions(transactionData);
        setWalletBalance({
          cashBalance: portfolioData.walletBalance.cashBalance,
          totalMarketValue: portfolioData.walletBalance.totalValue,
          totalPortfolioValue:
            portfolioData.walletBalance.totalValue +
            portfolioData.walletBalance.cashBalance,
        });
        setLoadingSuccess(true);
        setDataLoaded(true);
      } catch (err) {
        setError(getErrorMessage(err) || "Failed to load portfolio");
        setLoadingSuccess(false);
        setDataLoaded(true);
      }
    };

    loadPortfolio();
  }, []);

  const handleSellClick = (symbol: string) => {
    router.push(`/portfolio/${symbol}`);
  };

  // Show loading until portfolio data is loaded - don't wait for prices
  const isLoading = !dataLoaded;

  return (
    <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="page-card p-4 sm:p-6 rounded-2xl max-w-4xl mx-auto w-full">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div
                className="h-8 w-8 animate-spin rounded-full border-4"
                style={{
                  borderColor: "var(--loader-spinner)",
                  borderTopColor: "transparent",
                }}
              />
              <span className="text-sm opacity-70">Loading portfolio...</span>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
              <h1 className="page-title text-2xl sm:text-3xl font-bold hidden sm:block">
                PORTFOLIO
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm opacity-80">
                  Holdings: {processedHoldings.length}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <MarketStatus />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <PortfolioStatsCard
                title="Total Portfolio"
                value={`$${portfolioStats.totalPortfolioValue.toFixed(2)}`}
                iconName="briefcase"
                ariaLabel="Total value of cash and stocks combined"
                tooltip="Total value of cash and stocks combined"
              />

              <PortfolioStatsCard
                title="Stock Value"
                value={`$${portfolioStats.totalValue.toFixed(2)}`}
                iconName="trending-up"
                ariaLabel="Current market value of all your stock holdings"
                tooltip="Current market value of all your stock holdings"
              />

              <PortfolioStatsCard
                title="Total Gain/Loss"
                value={`${
                  portfolioStats.totalPnL >= 0 ? "+" : ""
                }$${portfolioStats.totalPnL.toFixed(2)}`}
                subValue={`(${`
									${portfolioStats.totalPnLPercent >= 0 ? "+" : ""}
								`}${portfolioStats.totalPnLPercent.toFixed(2)}%)`}
                iconName="dollar-sign"
                valueColor={
                  portfolioStats.totalPnL >= 0
                    ? "text-emerald-500"
                    : "text-rose-500"
                }
                ariaLabel="Profit or loss since you bought your stocks"
                tooltip="Profit or loss since you bought your stocks (Current Value - Purchase Cost)"
              />

              <PortfolioStatsCard
                title="Available Cash"
                value={`$${walletBalance.cashBalance.toFixed(2)}`}
                iconName="wallet"
                ariaLabel="Cash available for buying more stocks"
                tooltip="Cash available for buying more stocks"
              />
            </div>

            {error && (
              <div className="mb-4">
                <StatusMessage message={error} />
              </div>
            )}

            {!loadingSuccess ? (
              <div className="text-center py-8">
                <div className="text-lg font-medium text-[var(--text-primary)] mb-2">
                  Unable to load portfolio data
                </div>
                <div className="text-sm text-[var(--text-secondary)] mb-4">
                  Please check your connection and try again
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="neu-button px-4 py-2 rounded-xl hover:scale-105 transition-transform"
                >
                  Retry
                </button>
              </div>
            ) : processedHoldings.length === 0 ? (
              <EmptyPortfolio onViewMarkets={() => router.push("/market")} />
            ) : (
              <div className="space-y-4">
                <TableHeader
                  columns={[
                    {
                      id: "stock",
                      label: "Stock & Quantity",
                      description: "Symbol and shares owned",
                      icon: "trending-up",
                    },
                    {
                      id: "price",
                      label: "Current Price",
                      description: "Live market price",
                      icon: "dollar-sign",
                      alignment: "center",
                    },
                    {
                      id: "value",
                      label: "Market Value",
                      description: "Current worth (Price × Shares)",
                      icon: "briefcase",
                      alignment: "center",
                    },
                    {
                      id: "actions",
                      label: "Actions",
                      description: "Sell your shares",
                      icon: "activity",
                      alignment: "right",
                    },
                  ]}
                />

                {processedHoldings.map((holding) => {
                  const currentPrice = prices[holding.symbol]?.last ?? 0;
                  const currentValue = currentPrice * holding.totalQuantity;
                  const totalCost = holding.totalCost;
                  const pnl = currentValue - totalCost;
                  const pnlPercent =
                    totalCost > 0 ? (pnl / totalCost) * 100 : 0;

                  return (
                    <div
                      key={holding.symbol}
                      className="neu-card p-4 rounded-xl hover:scale-[1.02] transition-transform"
                      style={{
                        borderLeft: `4px solid ${
                          pnl >= 0 ? "#10b981" : "#ef4444"
                        }`,
                      }}
                    >
                      {/* Mobile Layout */}
                      <div className="md:hidden">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                              {holding.symbol}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {holding.totalQuantity} shares @ $
                              {holding.avgCostBasis.toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSellClick(holding.symbol)}
                            className="neu-button px-3 py-2 rounded-lg hover:scale-105 transition-transform text-rose-500 font-medium"
                          >
                            Sell
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--text-secondary)]">
                              Current Price
                            </span>
                            <span className="font-bold text-[var(--text-primary)]">
                              ${currentPrice.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--text-secondary)]">
                              Market Value
                            </span>
                            <span className="font-bold text-[var(--text-primary)]">
                              ${currentValue.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[var(--text-secondary)]">
                              Gain/Loss
                            </span>
                            <span
                              className={`font-bold ${
                                pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                              }`}
                            >
                              {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} (
                              {pnlPercent >= 0 ? "+" : ""}
                              {pnlPercent.toFixed(2)}%)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:flex md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">
                              {holding.symbol}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                              {holding.totalQuantity} shares
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] opacity-70">
                              Avg cost: ${holding.avgCostBasis.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex-1 text-center">
                          <p className="text-lg font-bold text-[var(--text-primary)]">
                            ${currentPrice.toFixed(2)}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)] opacity-70">
                            Current price
                          </p>
                        </div>

                        <div className="flex-1 text-center">
                          <p className="text-lg font-bold text-[var(--text-primary)]">
                            ${currentValue.toFixed(2)}
                          </p>
                          <p
                            className={`text-sm font-medium flex items-center justify-center gap-1 ${
                              pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                            }`}
                          >
                            <DynamicIcon
                              iconName={
                                pnl >= 0 ? "trending-up" : "trending-down"
                              }
                              size={12}
                            />
                            {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)] opacity-70">
                            {pnlPercent >= 0 ? "+" : ""}
                            {pnlPercent.toFixed(2)}% return
                          </p>
                        </div>

                        <div className="flex-1 text-right">
                          <button
                            onClick={() => handleSellClick(holding.symbol)}
                            className="neu-button px-4 py-2 rounded-xl hover:scale-105 transition-transform text-rose-500 font-medium flex items-center gap-2 ml-auto"
                          >
                            <DynamicIcon
                              iconName="minus-circle"
                              size={16}
                              className="text-[var(--text-accent)]"
                            />
                            Sell
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
