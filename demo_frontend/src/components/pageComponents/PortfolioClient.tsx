"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { usePrices } from "@/contexts/PriceContext";
import { getUserPortfolio } from "@/lib/api/portfolio";
import { getUserId } from "@/lib/auth/tokenStorage";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import StatusMessage from "@/components/status/StatusMessage";
import Loader from "@/components/ui/Loader";
import DynamicIcon from "@/components/ui/DynamicIcon";
import TableHeader from "@/components/ui/TableHeader";
import PortfolioStatsCard from "@/components/cards/PortfolioStatsCard";
import EmptyPortfolio from "@/components/ui/EmptyPortfolio";
import type { WalletBalanceResponse } from "@/types/wallet";
import type { PortfolioHolding } from "@/types";

export default function PortfolioClient() {
  const router = useRouter();
  const { prices } = usePrices();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [walletBalance, setWalletBalance] =
    useState<WalletBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const portfolioStats = useMemo(() => {
    let totalValue = 0;
    let totalCost = 0;
    let todayChange = 0;

    holdings.forEach((holding) => {
      const currentPrice = prices[holding.symbol]?.last ?? 0;
      const holdingValue = currentPrice * holding.quantity;
      const holdingCost = holding.avgCostBasis * holding.quantity;

      totalValue += holdingValue;
      totalCost += holdingCost;

      const percentChange = prices[holding.symbol]?.percentChange ?? 0;
      todayChange += (holdingValue * percentChange) / 100;
    });

    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercent,
      todayChange,
      todayChangePercent: totalValue > 0 ? (todayChange / totalValue) * 100 : 0,
    };
  }, [holdings, prices]);

  useEffect(() => {
    const loadPortfolio = async () => {
      const userId = getUserId();
      if (!userId) {
        setError("User authentication failed");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const portfolioData = await getUserPortfolio(userId);
        setHoldings(portfolioData.holdings);
        setWalletBalance({
          cashBalance: portfolioData.walletBalance.cashBalance,
          totalMarketValue: portfolioData.walletBalance.totalValue,
          totalPortfolioValue:
            portfolioData.walletBalance.totalValue +
            portfolioData.walletBalance.cashBalance,
        });
      } catch (err) {
        setError(getErrorMessage(err) || "Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  const handleSellClick = (symbol: string) => {
    router.push(`/sell/${symbol}`);
  };

  if (loading) {
    return (
      <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
        <div className="page-card p-4 sm:p-6 rounded-2xl max-w-4xl mx-auto w-full">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="page-card p-4 sm:p-6 rounded-2xl max-w-4xl mx-auto w-full">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="page-title text-2xl sm:text-3xl font-bold hidden sm:block">
            PORTFOLIO
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm opacity-80">
              Holdings: {holdings.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <PortfolioStatsCard
            title="Portfolio Value"
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
            subValue={`(${
              portfolioStats.totalPnLPercent >= 0 ? "+" : ""
            }${portfolioStats.totalPnLPercent.toFixed(2)}%)`}
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
            title="Today's Change"
            value={`${
              portfolioStats.todayChange >= 0 ? "+" : ""
            }$${portfolioStats.todayChange.toFixed(2)}`}
            subValue={`(${
              portfolioStats.todayChangePercent >= 0 ? "+" : ""
            }${portfolioStats.todayChangePercent.toFixed(2)}%)`}
            iconName="clock"
            valueColor={
              portfolioStats.todayChange >= 0
                ? "text-emerald-500"
                : "text-rose-500"
            }
            ariaLabel="How much your portfolio value changed today"
            tooltip="How much your portfolio value changed today based on stock price movements"
          />

          {walletBalance && (
            <PortfolioStatsCard
              title="Available Cash"
              value={`$${walletBalance.cashBalance.toFixed(2)}`}
              iconName="wallet"
              ariaLabel="Cash available for buying more stocks"
              tooltip="Cash available for buying more stocks"
            />
          )}
        </div>

        {error && (
          <div className="mb-4">
            <StatusMessage message={error} />
          </div>
        )}

        {holdings.length === 0 ? (
          <EmptyPortfolio onViewMarkets={() => router.push("/markets")} />
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

            {holdings.map((holding) => {
              const currentPrice = prices[holding.symbol]?.last ?? 0;
              const currentValue = currentPrice * holding.quantity;
              const totalCost = holding.avgCostBasis * holding.quantity;
              const pnl = currentValue - totalCost;
              const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
              const percentChange = prices[holding.symbol]?.percentChange ?? 0;

              return (
                <div
                  key={holding.symbol}
                  className="neu-card p-4 rounded-xl hover:scale-[1.02] transition-transform"
                >
                  {/* Mobile Layout */}
                  <div className="md:hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">
                          {holding.symbol}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {holding.quantity} shares @ $
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
                        <div className="text-right">
                          <span className="font-bold text-[var(--text-primary)]">
                            ${currentPrice.toFixed(2)}
                          </span>
                          {percentChange !== 0 && (
                            <span
                              className={`ml-2 text-sm ${
                                percentChange >= 0
                                  ? "text-emerald-500"
                                  : "text-rose-500"
                              }`}
                            >
                              {percentChange >= 0 ? "+" : ""}
                              {percentChange.toFixed(2)}%
                            </span>
                          )}
                        </div>
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
                          {holding.quantity} shares
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
                      {percentChange !== 0 && (
                        <p
                          className={`text-sm font-medium flex items-center justify-center gap-1 ${
                            percentChange >= 0
                              ? "text-emerald-500"
                              : "text-rose-500"
                          }`}
                        >
                          <DynamicIcon
                            iconName={
                              percentChange >= 0 ? "arrow-up" : "arrow-down"
                            }
                            size={12}
                          />
                          {percentChange >= 0 ? "+" : ""}
                          {percentChange.toFixed(2)}%
                        </p>
                      )}
                      <p className="text-xs text-[var(--text-secondary)] opacity-70">
                        Today's change
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
                          iconName={pnl >= 0 ? "trending-up" : "trending-down"}
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
                        <DynamicIcon iconName="minus-circle" size={16} />
                        Sell
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
