"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, DollarSign, Wallet, AlertCircle } from "lucide-react";
import { usePrices } from "@/contexts/PriceContext";
import { getWalletBalance } from "@/lib/api/wallet";
import { executeBuyOrder } from "@/lib/api/trading";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import { getUserId } from "@/lib/auth/tokenStorage";
import StatusMessage from "@/components/status/StatusMessage";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import type { WalletBalanceResponse } from "@/types/wallet";
import type { TradeExecutionResponse } from "@/types/trading";

interface BuySymbolClientProps {
  symbol: string;
}

export default function BuySymbolClient({ symbol }: BuySymbolClientProps) {
  const router = useRouter();
  const { prices } = usePrices();
  const [quantity, setQuantity] = useState<string>("1");
  const [walletBalance, setWalletBalance] =
    useState<WalletBalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [walletLoading, setWalletLoading] = useState(true);

  const currentPrice = prices[symbol];
  const lastPrice = currentPrice?.last ?? 0;
  const percentChange = currentPrice?.percentChange ?? 0;
  const isPositiveChange = percentChange > 0;

  const quantityNum = useMemo(() => {
    const num = parseFloat(quantity);
    return isNaN(num) || num <= 0 ? 0 : num;
  }, [quantity]);

  const totalCost = useMemo(() => {
    return quantityNum * lastPrice;
  }, [quantityNum, lastPrice]);

  const canAfford = useMemo(() => {
    return walletBalance ? totalCost <= walletBalance.cashBalance : false;
  }, [totalCost, walletBalance]);

  const isValidOrder = useMemo(() => {
    return quantityNum > 0 && lastPrice > 0 && canAfford;
  }, [quantityNum, lastPrice, canAfford]);

  useEffect(() => {
    const loadWalletBalance = async () => {
      const userId = getUserId();
      if (!userId) {
        setError("User authentication failed");
        setWalletLoading(false);
        return;
      }

      try {
        setWalletLoading(true);
        setError("");
        const balance = await getWalletBalance(userId);
        setWalletBalance(balance);
      } catch (err) {
        setError(getErrorMessage(err) || "Failed to load wallet balance");
      } finally {
        setWalletLoading(false);
      }
    };

    loadWalletBalance();
  }, []);

  const handleBuy = async () => {
    const userId = getUserId();
    if (!isValidOrder || !userId) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response: TradeExecutionResponse = await executeBuyOrder(userId, {
        symbol,
        quantity: quantityNum,
        expectedPrice: lastPrice,
      });

      setSuccess(
        `Successfully purchased ${response.quantity} shares of ${
          response.symbol
        } for $${response.totalAmount.toFixed(2)}`
      );

      setWalletBalance((prev) =>
        prev
          ? {
              ...prev,
              cashBalance: response.newCashBalance,
            }
          : null
      );

      setQuantity("1");

      setTimeout(() => {
        router.push("/portfolio");
      }, 2000);
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to execute buy order");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const setMaxAffordable = () => {
    if (walletBalance && lastPrice > 0) {
      const maxShares = Math.floor(walletBalance.cashBalance / lastPrice);
      setQuantity(maxShares.toString());
    }
  };

  return (
    <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl neu-button hover:scale-105 transition-transform"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Buy {symbol}
          </h1>
        </div>

        <div className="neu-card p-6 rounded-2xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {symbol}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Current Price
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                ${lastPrice.toFixed(2)}
              </div>
              {percentChange !== 0 && (
                <div
                  className={`text-sm font-medium ${
                    isPositiveChange ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {isPositiveChange ? "+" : ""}
                  {percentChange.toFixed(2)}%
                </div>
              )}
            </div>
          </div>

          {currentPrice?.lastUpdate &&
            Date.now() - currentPrice.lastUpdate < 5000 && (
              <div className="flex items-center gap-2 text-xs text-[var(--accent)]">
                <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></div>
                Live Price
              </div>
            )}
        </div>

        <div className="neu-card p-4 rounded-xl mb-6">
          <div className="flex items-center gap-3">
            <Wallet size={20} className="text-[var(--accent)]" />
            <div className="flex-1">
              <p className="text-sm text-[var(--text-secondary)]">
                Available Cash
              </p>
              {walletLoading ? (
                <div className="h-6 bg-[var(--surface)] rounded animate-pulse"></div>
              ) : (
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  ${walletBalance?.cashBalance.toFixed(2) ?? "0.00"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="neu-card p-6 rounded-2xl mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Quantity (Shares)
              </label>
              <div className="flex gap-2">
                <NeumorphicInput
                  type="text"
                  value={quantity}
                  onChange={handleQuantityChange}
                  placeholder="Enter quantity"
                  className="flex-1"
                />
                <button
                  onClick={setMaxAffordable}
                  className="px-3 py-2 text-sm neu-button rounded-xl hover:scale-105 transition-transform"
                  disabled={walletLoading || !walletBalance || lastPrice <= 0}
                >
                  Max
                </button>
              </div>
            </div>

            <div className="bg-[var(--surface)] p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Shares:</span>
                <span className="font-medium">{quantityNum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">
                  Price per share:
                </span>
                <span className="font-medium">${lastPrice.toFixed(2)}</span>
              </div>
              <div className="border-t border-[var(--border)] pt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-[var(--text-primary)]">
                    Total Cost:
                  </span>
                  <span className="font-bold text-lg text-[var(--text-primary)]">
                    ${totalCost.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {!canAfford && totalCost > 0 && (
              <div className="flex items-center gap-2 text-sm text-rose-500">
                <AlertCircle size={16} />
                Insufficient funds
              </div>
            )}

            {lastPrice <= 0 && (
              <div className="flex items-center gap-2 text-sm text-amber-500">
                <AlertCircle size={16} />
                Price data unavailable
              </div>
            )}
          </div>
        </div>

        <div className="min-h-[28px] mb-4">
          {error && <StatusMessage message={error} />}
          {success && <StatusMessage message={success} type="success" />}
        </div>

        <NeumorphicButton
          onClick={handleBuy}
          disabled={!isValidOrder || loading}
          className="w-full py-4 text-lg font-semibold"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <DollarSign size={20} />
              Buy {quantityNum > 0 ? `${quantityNum} shares` : "Shares"}
            </div>
          )}
        </NeumorphicButton>

        <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
          <p>Orders are executed at current market price</p>
          <p>Prices update in real-time</p>
        </div>
      </div>
    </div>
  );
}
