"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePrices } from "@/contexts/PriceContext";
import { getWalletBalance } from "@/lib/api/wallet";
import { executeBuyOrder } from "@/lib/api/trading";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import { getUserId } from "@/lib/auth/tokenStorage";
import StatusMessage from "@/components/status/StatusMessage";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import DynamicIcon from "@/components/ui/DynamicIcon";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import PriceCard from "@/components/cards/PriceCard";
import WalletBalanceCard from "@/components/cards/WalletBalanceCard";
import QuantityInput from "@/components/input/QuantityInput";
import OrderSummary from "@/components/status/OrderSummary";
import ValidationMessages from "@/components/status/ValidationMessages";
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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const scrollPosition = useRef<number>(0);

  // Restore scroll position when modal closes
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
      setShowConfirmation(false);

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
        {showConfirmation ? (
          <ConfirmationModal
            isOpen={showConfirmation}
            title="Confirm Buy Order"
            message={`Are you sure you want to buy ${quantityNum} shares of ${symbol} for $${totalCost.toFixed(
              2
            )}?

Current price: $${lastPrice.toFixed(2)} per share

This will deduct $${totalCost.toFixed(2)} from your available cash balance.`}
            confirmText="Confirm Buy"
            cancelText="Cancel"
            onConfirm={handleBuy}
            onCancel={() => {
              setShowConfirmation(false);
            }}
            confirmDisabled={loading}
            cancelDisabled={loading}
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
                Buy {symbol}
              </h1>
            </div>

            <PriceCard symbol={symbol} currentPrice={currentPrice} />

            <WalletBalanceCard
              walletBalance={walletBalance}
              walletLoading={walletLoading}
            />

            <div className="neu-card p-6 rounded-2xl mb-6">
              <div className="space-y-4">
                <QuantityInput
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                  onSetMaxAffordable={setMaxAffordable}
                  walletLoading={walletLoading}
                  walletBalance={walletBalance}
                  lastPrice={lastPrice}
                />

                <OrderSummary
                  quantityNum={quantityNum}
                  lastPrice={lastPrice}
                  totalCost={totalCost}
                />

                <ValidationMessages
                  canAfford={canAfford}
                  totalCost={totalCost}
                  walletLoading={walletLoading}
                  lastPrice={lastPrice}
                />
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
                  Buy {quantityNum > 0 ? `${quantityNum} shares` : "Shares"}
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
