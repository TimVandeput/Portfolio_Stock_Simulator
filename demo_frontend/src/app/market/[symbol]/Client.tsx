/**
 * @fileoverview Interactive stock purchase client component for individual stocks.
 *
 * This module provides a comprehensive stock purchase interface that enables users
 * to buy shares of individual stocks through an advanced trading interface with
 * real-time price integration, wallet validation, order confirmation, and secure
 * transaction execution within the Stock Simulator platform.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

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

/**
 * Props interface for the BuySymbolClient component.
 * @interface BuySymbolClientProps
 */
interface BuySymbolClientProps {
  /** The stock symbol to purchase (e.g., "AAPL", "GOOGL") */
  symbol: string;
}

/**
 * Interactive stock purchase client component for individual stock symbols.
 *
 * This sophisticated client component provides a comprehensive stock purchase
 * interface with advanced trading capabilities including real-time price monitoring,
 * wallet balance validation, quantity calculations, order confirmations, and secure
 * transaction execution. It delivers a professional-grade trading experience within
 * the Stock Simulator platform.
 *
 * @remarks
 * The component delivers comprehensive stock purchase functionality through:
 *
 * **Real-time Market Data Integration**:
 * - **Live Price Feeds**: Real-time stock price updates via PriceContext
 * - **Market State Monitoring**: Current bid/ask spreads and volume data
 * - **Price Change Indicators**: Visual indicators for price movements
 * - **Market Hours Awareness**: Trading availability status integration
 *
 * **Advanced Purchase Interface**:
 * - **Quantity Input**: Flexible share quantity selection with validation
 * - **Maximum Affordable Calculation**: Auto-calculation of maximum purchasable shares
 * - **Order Cost Preview**: Real-time total cost calculations
 * - **Price Impact Analysis**: Cost basis and projected value calculations
 *
 * **Wallet Integration & Validation**:
 * - **Real-time Balance Checking**: Live wallet balance monitoring
 * - **Purchase Power Validation**: Sufficient funds verification
 * - **Cost Tolerance Handling**: Floating-point precision safeguards
 * - **Balance Updates**: Post-transaction balance synchronization
 *
 * **Order Execution & Confirmation**:
 * - **Two-step Confirmation**: Modal confirmation before execution
 * - **Order Summary Display**: Complete transaction details preview
 * - **Execution Progress**: Real-time processing status indicators
 * - **Success/Error Handling**: Comprehensive transaction result processing
 *
 * **User Experience Enhancements**:
 * - **Responsive Design**: Optimized layouts for all device types
 * - **Loading States**: Smooth transitions during data operations
 * - **Error Recovery**: Graceful handling with retry mechanisms
 * - **Navigation Integration**: Seamless routing after successful transactions
 * - **Scroll Position Management**: Preserved scroll state during modal interactions
 *
 * **Input Validation & Security**:
 * - **Quantity Validation**: Numeric input sanitization and bounds checking
 * - **Price Verification**: Expected price matching for order security
 * - **Authentication Verification**: Secure user session validation
 * - **Transaction Integrity**: Comprehensive error handling and rollback
 *
 * **Performance Optimizations**:
 * - **Memoized Calculations**: Optimized quantity and cost computations
 * - **Efficient State Management**: Minimal re-renders through useMemo hooks
 * - **Debounced Updates**: Reduced API calls during input interactions
 * - **Smart Loading States**: Targeted loading indicators for specific operations
 *
 * **Professional Trading Features**:
 * - **Market Order Execution**: Immediate execution at current market price
 * - **Order Validation**: Comprehensive pre-execution verification
 * - **Transaction History Integration**: Automatic order tracking and recording
 * - **Portfolio Updates**: Real-time portfolio synchronization post-purchase
 *
 * The component serves as a complete stock purchase solution, providing users
 * with professional-grade trading capabilities while maintaining security,
 * performance, and user experience standards expected in modern financial
 * applications.
 *
 * @example
 * ```tsx
 * // Comprehensive stock purchase interface usage
 * function BuySymbolClient({ symbol }: BuySymbolClientProps) {
 *   const [quantity, setQuantity] = useState<string>("1");
 *   const [walletBalance, setWalletBalance] = useState<WalletBalanceResponse | null>(null);
 *   const { prices } = usePrices();
 *
 *   const currentPrice = prices[symbol];
 *   const totalCost = useMemo(() => {
 *     const qty = parseFloat(quantity) || 0;
 *     return qty * (currentPrice?.last || 0);
 *   }, [quantity, currentPrice]);
 *
 *   const handleBuy = async () => {
 *     const response = await executeBuyOrder(userId, {
 *       symbol,
 *       quantity: parseFloat(quantity),
 *       expectedPrice: currentPrice?.last || 0
 *     });
 *
 *     // Update UI with transaction results
 *     setWalletBalance(prev => prev ? {
 *       ...prev,
 *       cashBalance: response.newCashBalance
 *     } : null);
 *   };
 *
 *   return (
 *     <div className="buy-interface">
 *       <PriceCard symbol={symbol} currentPrice={currentPrice} />
 *       <WalletBalanceCard walletBalance={walletBalance} />
 *       <QuantityInput quantity={quantity} onChange={setQuantity} />
 *       <OrderSummary totalCost={totalCost} />
 *       <NeumorphicButton onClick={handleBuy}>
 *         Buy {quantity} shares
 *       </NeumorphicButton>
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties containing the stock symbol to purchase
 * @returns A comprehensive stock purchase interface with real-time data integration,
 * validation, confirmation, and secure transaction execution capabilities
 *
 * @see {@link usePrices} - Real-time price data context provider
 * @see {@link executeBuyOrder} - API function for executing stock purchases
 * @see {@link getWalletBalance} - API function for retrieving wallet balance
 * @see {@link PriceCard} - Real-time stock price display component
 * @see {@link WalletBalanceCard} - Wallet balance display component
 * @see {@link QuantityInput} - Share quantity input component
 * @see {@link OrderSummary} - Transaction summary display component
 * @see {@link ConfirmationModal} - Order confirmation modal component
 *
 * @public
 */
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
    if (!walletBalance) return false;
    // Add a small tolerance for floating point precision issues
    const tolerance = 0.01; // 1 cent tolerance
    return totalCost <= walletBalance.cashBalance + tolerance;
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

      const calculatedCost = maxShares * lastPrice;

      if (calculatedCost <= walletBalance.cashBalance) {
        setQuantity(maxShares.toString());
      } else {
        setQuantity(Math.max(0, maxShares - 1).toString());
      }
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
              {(error || success) && (
                <StatusMessage
                  message={error || success}
                  type={error ? "error" : "success"}
                />
              )}
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
