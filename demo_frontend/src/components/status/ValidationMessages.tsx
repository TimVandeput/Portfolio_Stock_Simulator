/**
 * @fileoverview Validation messages component for trading operation feedback and error handling
 *
 * This component provides comprehensive validation feedback for trading operations
 * with context-aware messaging, dynamic iconography, and professional error states.
 * Features include insufficient fund detection, price validation, loading state
 * management, and seamless integration with trading forms and order validation.
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for ValidationMessages component configuration
 * @interface ValidationMessagesProps
 * @extends {BaseComponentProps}
 */
export interface ValidationMessagesProps extends BaseComponentProps {
  /** Whether the user can afford the transaction */
  canAfford: boolean;
  /** Total cost of the proposed transaction */
  totalCost: number;
  /** Whether wallet data is currently loading */
  walletLoading: boolean;
  /** Current price per share */
  lastPrice: number;
  /** Success message to display */
  success?: string;
  /** Whether operation is in progress */
  loading?: boolean;
  /** Trading operation mode affecting validation logic */
  mode?: "buy" | "sell";
}

/**
 * Validation messages component for trading operation feedback and error handling
 *
 * @remarks
 * The ValidationMessages component delivers comprehensive trading validation with the following features:
 *
 * **Affordability Validation:**
 * - Insufficient funds detection for buy operations
 * - Insufficient shares detection for sell operations
 * - Context-aware messaging based on trading mode
 * - Real-time validation state management
 *
 * **Price Validation:**
 * - Price data availability checking
 * - Zero or negative price detection
 * - Market data connectivity validation
 * - Professional price error messaging
 *
 * **State Management:**
 * - Loading state awareness
 * - Success state handling
 * - Wallet loading state integration
 * - Conditional message display logic
 *
 * **Visual Feedback:**
 * - Color-coded error states (rose for critical, amber for warnings)
 * - Dynamic alert circle icons
 * - Consistent iconography across message types
 * - Professional error state styling
 *
 * **Conditional Display:**
 * - Multi-condition validation logic
 * - State-based message filtering
 * - Clean conditional rendering
 * - Priority-based message display
 *
 * **Icon Integration:**
 * - Alert circle icons for all validation messages
 * - Consistent 16px icon sizing
 * - Color-coordinated iconography
 * - Professional warning indicators
 *
 * **Typography:**
 * - Small text sizing for validation context
 * - Color-coded text matching icon themes
 * - Professional error message styling
 * - Clear readability and contrast
 *
 * **Trading Mode Adaptation:**
 * - Buy mode: "Insufficient funds" messaging
 * - Sell mode: "Insufficient shares" messaging
 * - Context-aware validation logic
 * - Professional trading terminology
 *
 * **Component Architecture:**
 * - Fragment return for conditional rendering
 * - Clean boolean logic chains
 * - TypeScript type safety
 * - Efficient conditional evaluation
 *
 * **Error Categories:**
 * - Financial constraint errors (rose theming)
 * - Data availability warnings (amber theming)
 * - Clear error categorization
 * - Professional error handling
 *
 * @param props - Configuration object for validation message display
 * @returns ValidationMessages component with contextual feedback
 *
 * @example
 * ```tsx
 * // Buy order validation
 * <ValidationMessages
 *   canAfford={false}
 *   totalCost={1500.00}
 *   walletLoading={false}
 *   lastPrice={150.25}
 *   mode="buy"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Sell order validation
 * <ValidationMessages
 *   canAfford={false}
 *   totalCost={2500.00}
 *   walletLoading={false}
 *   lastPrice={250.00}
 *   mode="sell"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with trading form
 * function TradingForm({ symbol, mode }: { symbol: string; mode: "buy" | "sell" }) {
 *   const [quantity, setQuantity] = useState(0);
 *   const { data: price, isLoading: priceLoading } = useStockPrice(symbol);
 *   const { data: wallet, isLoading: walletLoading } = useWallet();
 *   const [success, setSuccess] = useState("");
 *   const [loading, setLoading] = useState(false);
 *
 *   const totalCost = quantity * (price || 0);
 *   const canAfford = mode === "buy"
 *     ? (wallet?.balance || 0) >= totalCost
 *     : (wallet?.positions[symbol] || 0) >= quantity;
 *
 *   return (
 *     <form className="space-y-4">
 *       <QuantityInput
 *         quantity={quantity.toString()}
 *         onQuantityChange={(q) => setQuantity(parseFloat(q) || 0)}
 *       />
 *
 *       <ValidationMessages
 *         canAfford={canAfford}
 *         totalCost={totalCost}
 *         walletLoading={walletLoading}
 *         lastPrice={price || 0}
 *         success={success}
 *         loading={loading}
 *         mode={mode}
 *       />
 *
 *       <SubmitButton disabled={!canAfford || loading}>
 *         {mode === "buy" ? "Buy" : "Sell"} {symbol}
 *       </SubmitButton>
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Real-time validation with price monitoring
 * function OrderValidation({ order }: { order: TradingOrder }) {
 *   const { data: currentPrice } = useRealtimePrice(order.symbol);
 *   const { data: account } = useAccountBalance();
 *   const [orderStatus, setOrderStatus] = useState<{
 *     success?: string;
 *     loading: boolean;
 *   }>({ loading: false });
 *
 *   const canExecute = order.mode === "buy"
 *     ? account.balance >= order.quantity * currentPrice
 *     : account.positions[order.symbol] >= order.quantity;
 *
 *   return (
 *     <div className="order-validation">
 *       <OrderSummary order={order} currentPrice={currentPrice} />
 *
 *       <ValidationMessages
 *         canAfford={canExecute}
 *         totalCost={order.quantity * currentPrice}
 *         walletLoading={!account}
 *         lastPrice={currentPrice}
 *         success={orderStatus.success}
 *         loading={orderStatus.loading}
 *         mode={order.mode}
 *       />
 *
 *       <OrderActions
 *         order={order}
 *         canExecute={canExecute}
 *         onStatusChange={setOrderStatus}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export default function ValidationMessages({
  canAfford,
  totalCost,
  walletLoading,
  lastPrice,
  success,
  loading,
  mode = "buy",
}: ValidationMessagesProps) {
  return (
    <>
      {!canAfford &&
        totalCost > 0 &&
        !walletLoading &&
        !success &&
        !loading && (
          <div className="flex items-center gap-2 text-sm text-rose-500">
            <DynamicIcon iconName="alertcircle" size={16} />
            {mode === "sell" ? "Insufficient shares" : "Insufficient funds"}
          </div>
        )}

      {lastPrice <= 0 && !success && !loading && (
        <div className="flex items-center gap-2 text-sm text-amber-500">
          <DynamicIcon iconName="alertcircle" size={16} />
          Price data unavailable
        </div>
      )}
    </>
  );
}
