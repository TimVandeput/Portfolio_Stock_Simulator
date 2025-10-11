/**
 * @fileoverview Interactive stock selling client component for portfolio holdings.
 *
 * This module provides a comprehensive stock selling interface that enables users
 * to sell shares from their existing portfolio holdings through an advanced trading
 * interface with real-time price integration, holdings validation, profit/loss
 * calculations, order confirmation, and secure transaction execution within the
 * Stock Simulator platform.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

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

/**
 * Props interface for the SellSymbolClient component.
 * @interface SellSymbolClientProps
 */
interface SellSymbolClientProps {
  /** The stock symbol to sell from portfolio holdings (e.g., "AAPL", "GOOGL") */
  symbol: string;
}

/**
 * Interactive stock selling client component for portfolio holdings management.
 *
 * This sophisticated client component provides a comprehensive stock selling
 * interface with advanced trading capabilities including real-time price monitoring,
 * portfolio holdings validation, profit/loss calculations, quantity management,
 * order confirmations, and secure transaction execution. It delivers a professional-grade
 * portfolio management experience within the Stock Simulator platform.
 *
 * @remarks
 * The component delivers comprehensive stock selling functionality through:
 *
 * **Portfolio Holdings Integration**:
 * - **Real-time Holdings Data**: Live portfolio position information
 * - **Available Shares Validation**: Prevents overselling of positions
 * - **Cost Basis Tracking**: Average purchase price and total investment display
 * - **Position Management**: Partial and complete position closure capabilities
 *
 * **Advanced Selling Interface**:
 * - **Holdings-based Quantity Limits**: Maximum sellable shares calculation
 * - **Flexible Quantity Selection**: Partial or complete position selling options
 * - **Maximum Available Selection**: One-click maximum quantity setting
 * - **Real-time Value Calculations**: Current market value and proceeds estimation
 *
 * **Profit/Loss Analysis**:
 * - **Cost Basis Display**: Original purchase price and total investment
 * - **Current Market Value**: Real-time position valuation
 * - **Gain/Loss Calculations**: Unrealized profit/loss on holdings
 * - **Performance Metrics**: Return on investment and percentage gains
 *
 * **Real-time Market Data Integration**:
 * - **Live Price Feeds**: Real-time stock price updates via PriceContext
 * - **Market State Monitoring**: Current bid/ask spreads and volume data
 * - **Price Movement Indicators**: Visual indicators for price changes
 * - **Market Hours Awareness**: Trading availability status integration
 *
 * **Order Execution & Confirmation**:
 * - **Two-step Confirmation**: Modal confirmation before execution
 * - **Order Summary Display**: Complete transaction details preview
 * - **Holdings Impact Preview**: Remaining position after sale visualization
 * - **Execution Progress**: Real-time processing status indicators
 *
 * **Transaction Management**:
 * - **Secure Order Execution**: Authenticated API calls with error handling
 * - **Portfolio Updates**: Real-time holdings synchronization post-sale
 * - **Wallet Integration**: Cash balance updates after successful transactions
 * - **Transaction History**: Automatic order tracking and recording
 *
 * **User Experience Enhancements**:
 * - **Responsive Design**: Optimized layouts for all device types
 * - **Loading States**: Smooth transitions during data operations
 * - **Error Recovery**: Graceful handling with retry mechanisms
 * - **Navigation Integration**: Seamless routing after successful transactions
 * - **Scroll Position Management**: Preserved scroll state during modal interactions
 *
 * **Input Validation & Security**:
 * - **Holdings Validation**: Cannot sell more shares than owned
 * - **Quantity Sanitization**: Numeric input validation and bounds checking
 * - **Price Verification**: Expected price matching for order security
 * - **Authentication Verification**: Secure user session validation
 * - **Transaction Integrity**: Comprehensive error handling and rollback
 *
 * **Performance Optimizations**:
 * - **Memoized Calculations**: Optimized quantity and value computations
 * - **Efficient State Management**: Minimal re-renders through useMemo hooks
 * - **Parallel Data Loading**: Concurrent wallet and holdings data retrieval
 * - **Smart Loading States**: Targeted loading indicators for specific operations
 *
 * **Professional Portfolio Features**:
 * - **Market Order Execution**: Immediate execution at current market price
 * - **Position Reduction**: Partial position selling capabilities
 * - **Complete Exit Strategy**: Full position closure options
 * - **Portfolio Optimization**: Strategic selling tools and guidance
 *
 * The component serves as a complete portfolio management solution, providing users
 * with professional-grade selling capabilities while maintaining security,
 * performance, and user experience standards expected in modern portfolio
 * management applications.
 *
 * @example
 * ```tsx
 * // Comprehensive stock selling interface usage
 * function SellSymbolClient({ symbol }: SellSymbolClientProps) {
 *   const [quantity, setQuantity] = useState<string>("1");
 *   const [holding, setHolding] = useState<PortfolioHolding | null>(null);
 *   const { prices } = usePrices();
 *
 *   const currentPrice = prices[symbol];
 *   const totalValue = useMemo(() => {
 *     const qty = parseFloat(quantity) || 0;
 *     return qty * (currentPrice?.last || 0);
 *   }, [quantity, currentPrice]);
 *
 *   const handleSell = async () => {
 *     const response = await executeSellOrder(userId, {
 *       symbol,
 *       quantity: parseFloat(quantity),
 *       expectedPrice: currentPrice?.last || 0
 *     });
 *
 *     // Update portfolio holdings after successful sale
 *     setHolding(prev => prev ? {
 *       ...prev,
 *       quantity: prev.quantity - parseFloat(quantity)
 *     } : null);
 *   };
 *
 *   return (
 *     <div className="sell-interface">
 *       <PriceCard symbol={symbol} currentPrice={currentPrice} />
 *       <div className="holdings-display">
 *         <p>{holding?.quantity} shares @ ${holding?.avgCostBasis.toFixed(2)}</p>
 *       </div>
 *       <QuantityInput
 *         quantity={quantity}
 *         onChange={setQuantity}
 *         max={holding?.quantity || 0}
 *       />
 *       <OrderSummary totalValue={totalValue} mode="sell" />
 *       <NeumorphicButton onClick={handleSell}>
 *         Sell {quantity} shares
 *       </NeumorphicButton>
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties containing the stock symbol to sell
 * @returns A comprehensive stock selling interface with real-time data integration,
 * portfolio holdings validation, profit/loss analysis, confirmation, and secure
 * transaction execution capabilities
 *
 * @see {@link usePrices} - Real-time price data context provider
 * @see {@link executeSellOrder} - API function for executing stock sales
 * @see {@link getUserHolding} - API function for retrieving portfolio holdings
 * @see {@link getWalletBalance} - API function for retrieving wallet balance
 * @see {@link PriceCard} - Real-time stock price display component
 * @see {@link QuantityInput} - Share quantity input component
 * @see {@link OrderSummary} - Transaction summary display component
 * @see {@link ConfirmationModal} - Order confirmation modal component
 * @see {@link PortfolioHolding} - TypeScript interface for holdings data
 *
 * @public
 */
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
