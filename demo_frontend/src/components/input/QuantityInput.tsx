/**
 * @fileoverview Specialized quantity input component for stock trading operations
 *
 * This component provides a comprehensive quantity input solution for stock trading,
 * featuring automatic maximum calculation, wallet balance integration, and adaptive
 * behavior for both buy and sell operations. Includes neumorphic styling, real-time
 * validation, and seamless integration with trading workflows.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import NeumorphicInput from "@/components/input/NeumorphicInput";
import type { WalletBalanceResponse } from "@/types/wallet";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for QuantityInput component configuration
 * @interface QuantityInputProps
 * @extends {BaseComponentProps}
 */
export interface QuantityInputProps extends BaseComponentProps {
  /** Current quantity value as string */
  quantity: string;
  /** Callback function when quantity value changes */
  onQuantityChange: (value: string) => void;
  /** Callback function to set maximum affordable quantity */
  onSetMaxAffordable: () => void;
  /** Loading state for wallet balance data */
  walletLoading: boolean;
  /** Current wallet balance information */
  walletBalance: WalletBalanceResponse | null;
  /** Current stock price for calculations */
  lastPrice: number;
  /** Trading mode: 'buy' or 'sell' operations */
  mode?: "buy" | "sell";
}

/**
 * Specialized quantity input component for stock trading operations
 *
 * @remarks
 * The QuantityInput component delivers comprehensive trading quantity management with the following features:
 *
 * **Trading Integration:**
 * - Adaptive behavior for buy and sell operations
 * - Automatic maximum quantity calculation based on available funds
 * - Real-time wallet balance integration
 * - Stock price-aware quantity validation
 *
 * **Input Features:**
 * - Neumorphic-styled input field for consistent design
 * - Text-based input with flexible formatting
 * - Placeholder guidance for user interaction
 * - Real-time value updates through callback system
 *
 * **Maximum Calculation:**
 * - "Max" button for automatic quantity calculation
 * - Intelligent enabling/disabling based on data availability
 * - Different logic for buy vs sell operations
 * - Loading state awareness for async operations
 *
 * **User Experience:**
 * - Clear labeling with "Quantity (Shares)" description
 * - Side-by-side layout with input and max button
 * - Hover effects and smooth transitions
 * - Disabled state handling with visual feedback
 *
 * **State Management:**
 * - Controlled component with external state management
 * - Loading state integration for async data
 * - Price validation and error handling
 * - Mode-specific behavior customization
 *
 * **Accessibility:**
 * - Proper form labeling with semantic HTML
 * - Clear visual hierarchy and spacing
 * - Button state management with proper disabled states
 * - Screen reader friendly component structure
 *
 * @param props - Configuration object for quantity input behavior
 * @returns QuantityInput component with trading-specific functionality
 *
 * @example
 * ```tsx
 * // Basic buy operation quantity input
 * const [quantity, setQuantity] = useState("");
 * const { data: walletBalance, isLoading } = useWalletBalance();
 *
 * <QuantityInput
 *   quantity={quantity}
 *   onQuantityChange={setQuantity}
 *   onSetMaxAffordable={() => {
 *     const maxShares = Math.floor(walletBalance.cash / currentPrice);
 *     setQuantity(maxShares.toString());
 *   }}
 *   walletLoading={isLoading}
 *   walletBalance={walletBalance}
 *   lastPrice={currentPrice}
 *   mode="buy"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Sell operation with holdings validation
 * <QuantityInput
 *   quantity={sellQuantity}
 *   onQuantityChange={setSellQuantity}
 *   onSetMaxAffordable={() => {
 *     setSellQuantity(currentHolding.quantity.toString());
 *   }}
 *   walletLoading={false}
 *   walletBalance={null}
 *   lastPrice={stockPrice}
 *   mode="sell"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Complete trading form integration
 * function TradingForm({ symbol, mode }: { symbol: string, mode: "buy" | "sell" }) {
 *   const [quantity, setQuantity] = useState("");
 *   const { data: walletBalance, isLoading } = useWalletBalance();
 *   const { data: stockPrice } = useStockPrice(symbol);
 *
 *   const handleMaxQuantity = () => {
 *     if (mode === "buy" && walletBalance && stockPrice) {
 *       const maxShares = Math.floor(walletBalance.cash / stockPrice);
 *       setQuantity(maxShares.toString());
 *     }
 *   };
 *
 *   return (
 *     <div className="space-y-4">
 *       <QuantityInput
 *         quantity={quantity}
 *         onQuantityChange={setQuantity}
 *         onSetMaxAffordable={handleMaxQuantity}
 *         walletLoading={isLoading}
 *         walletBalance={walletBalance}
 *         lastPrice={stockPrice || 0}
 *         mode={mode}
 *       />
 *
 *       <div className="text-sm text-gray-600">
 *         Total: ${((parseFloat(quantity) || 0) * (stockPrice || 0)).toFixed(2)}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export default function QuantityInput({
  quantity,
  onQuantityChange,
  onSetMaxAffordable,
  walletLoading,
  walletBalance,
  lastPrice,
  mode = "buy",
}: QuantityInputProps) {
  const isMaxDisabled =
    mode === "buy"
      ? walletLoading || !walletBalance || lastPrice <= 0
      : walletLoading || lastPrice <= 0;

  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
        Quantity (Shares)
      </label>
      <div className="flex gap-2">
        <NeumorphicInput
          type="text"
          value={quantity}
          onChange={onQuantityChange}
          placeholder="Enter quantity"
          className="flex-1"
        />
        <button
          onClick={onSetMaxAffordable}
          className="px-3 py-2 text-sm neu-button rounded-xl hover:scale-105 transition-transform"
          disabled={isMaxDisabled}
        >
          Max
        </button>
      </div>
    </div>
  );
}
