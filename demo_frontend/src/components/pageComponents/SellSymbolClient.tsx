"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePrices } from "@/contexts/PriceContext";
import { getWalletBalance } from "@/lib/api/wallet";
import { executeSellOrder } from "@/lib/api/trading";
import { getUserHolding } from "@/lib/api/portfolio";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import { getUserId } from "@/lib/auth/tokenStorage";
import StatusMessage from "@/components/status/StatusMessage";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import DynamicIcon from "@/components/ui/DynamicIcon";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import PriceCard from "@/components/cards/PriceCard";
import QuantityInput from "@/components/input/QuantityInput";
import OrderSummary from "@/components/status/OrderSummary";
import ValidationMessages from "@/components/status/ValidationMessages";
import type { WalletBalanceResponse } from "@/types/wallet";
import type { TradeExecutionResponse } from "@/types/trading";
import type { PortfolioHolding } from "@/types";

interface SellSymbolClientProps {
  symbol: string;
}

export default function SellSymbolClient({ symbol }: SellSymbolClientProps) {
  const router = useRouter();
  const { prices } = usePrices();
  const [quantity, setQuantity] = useState<string>("1");
  const [walletBalance, setWalletBalance] =
    useState<WalletBalanceResponse | null>(null);
  const [holding, setHolding] = useState<PortfolioHolding | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [walletLoading, setWalletLoading] = useState(true);
  const [holdingLoading, setHoldingLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const scrollPosition = useRef<number>(0);

  useEffect(() => {
    if (!showConfirmation && scrollPosition.current > 0) {
      setTimeout(() => {
        const container = document.querySelector(".page-container");
        if (container) {
          container.scrollTop = scrollPosition.current;
        }
      }, 0);
    }
  }, [showConfirmation]);

  const currentPrice = prices[symbol];
  const lastPrice = currentPrice?.last ?? 0;

  const quantityNum = useMemo(() => {
    const num = parseFloat(quantity);
    return isNaN(num) || num <= 0 ? 0 : num;
  }, [quantity]);

  const totalValue = useMemo(() => {
    return quantityNum * lastPrice;
  }, [quantityNum, lastPrice]);

  const canSell = useMemo(() => {
    return holding ? quantityNum <= holding.quantity : false;
  }, [quantityNum, holding]);

  const isValidOrder = useMemo(() => {
    return quantityNum > 0 && lastPrice > 0 && canSell;
  }, [quantityNum, lastPrice, canSell]);

  useEffect(() => {
    const loadData = async () => {
      const userId = getUserId();
      if (!userId) {
        setError("User authentication failed");
        setWalletLoading(false);
        setHoldingLoading(false);
        return;
      }

      try {
        setError("");

        const [walletData, holdingData] = await Promise.all([
          getWalletBalance(userId),
          getUserHolding(userId, symbol),
        ]);

        setWalletBalance(walletData);
        setHolding(holdingData);
      } catch (err) {
        setError(getErrorMessage(err) || "Failed to load data");
      } finally {
        setWalletLoading(false);
        setHoldingLoading(false);
      }
    };

    loadData();
  }, [symbol]);

  const handleSell = async () => {
    const userId = getUserId();
    if (!isValidOrder || !userId) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setShowConfirmation(false);

      const response: TradeExecutionResponse = await executeSellOrder(userId, {
        symbol,
        quantity: quantityNum,
        expectedPrice: lastPrice,
      });

      setSuccess(
        `Successfully sold ${response.quantity} shares of ${
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

      setHolding((prev) =>
        prev
          ? {
              ...prev,
              quantity: prev.quantity - quantityNum,
            }
          : null
      );

      setQuantity("1");

      setTimeout(() => {
        router.push("/portfolio");
      }, 2000);
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to execute sell order");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };

  const setMaxAvailable = () => {
    if (holding) {
      setQuantity(holding.quantity.toString());
    }
  };

  if (holdingLoading) {
    return (
      <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
        <div className="w-full max-w-sm mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-[var(--surface)] rounded w-1/3"></div>
            <div className="h-32 bg-[var(--surface)] rounded"></div>
            <div className="h-20 bg-[var(--surface)] rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!holding) {
    return null;
  }

  return (
    <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="w-full max-w-sm mx-auto">
        {showConfirmation ? (
          <ConfirmationModal
            isOpen={showConfirmation}
            title="Confirm Sell Order"
            message={`Are you sure you want to sell ${quantityNum} shares of ${symbol} for $${totalValue.toFixed(
              2
            )}?

Current price: $${lastPrice.toFixed(2)} per share

This action cannot be undone.`}
            confirmText="Confirm Sell"
            cancelText="Cancel"
            onConfirm={handleSell}
            onCancel={() => {
              setShowConfirmation(false);
              setTimeout(() => window.scrollTo(0, scrollPosition.current), 50);
            }}
            confirmDisabled={loading}
            cancelDisabled={loading}
            buttonType="primary"
          />
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-xl neu-button hover:scale-105 transition-transform"
              >
                <DynamicIcon iconName="arrowleft" size={20} />
              </button>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Sell {symbol}
              </h1>
            </div>

            <PriceCard symbol={symbol} currentPrice={currentPrice} />

            <div className="neu-card p-4 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <DynamicIcon
                  iconName="briefcase"
                  size={20}
                  className="text-[var(--accent)]"
                />
                <div className="flex-1">
                  <p className="text-sm text-[var(--text-secondary)]">
                    Your Holdings
                  </p>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">
                    {holding.quantity} shares @ $
                    {holding.avgCostBasis.toFixed(2)} avg
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Total Invested: $
                    {(holding.quantity * holding.avgCostBasis).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="neu-card p-6 rounded-2xl mb-6">
              <div className="space-y-4">
                <QuantityInput
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  onSetMaxAffordable={setMaxAvailable}
                  walletLoading={holdingLoading}
                  walletBalance={walletBalance}
                  lastPrice={lastPrice}
                  mode="sell"
                />

                <OrderSummary
                  quantityNum={quantityNum}
                  lastPrice={lastPrice}
                  totalCost={totalValue}
                  mode="sell"
                />

                <ValidationMessages
                  canAfford={canSell}
                  totalCost={totalValue}
                  walletLoading={false}
                  lastPrice={lastPrice}
                  success={success}
                  loading={loading}
                  mode="sell"
                />

                {!canSell &&
                  quantityNum > 0 &&
                  holding &&
                  !success &&
                  !loading && (
                    <div className="flex items-center gap-2 text-sm text-rose-500">
                      <DynamicIcon iconName="alertcircle" size={16} />
                      Cannot sell more than {holding.quantity} shares
                    </div>
                  )}
              </div>
            </div>

            <div className="min-h-[28px] mb-4">
              {error && <StatusMessage message={error} />}
              {success && <StatusMessage message={success} type="success" />}
            </div>

            <NeumorphicButton
              onClick={() => {
                const container = document.querySelector(".page-container");
                scrollPosition.current = container?.scrollTop || 0;
                setShowConfirmation(true);
              }}
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
                  <DynamicIcon iconName="dollarsign" size={20} />
                  Sell {quantityNum > 0 ? `${quantityNum} shares` : "Shares"}
                </div>
              )}
            </NeumorphicButton>

            <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
              <p>Orders are executed at current market price</p>
              <p>Prices update in real-time</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
