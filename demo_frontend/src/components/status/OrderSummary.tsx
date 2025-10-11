/**
 * @fileoverview Professional order summary component for trading transaction details
 *
 * This component provides a comprehensive order summary display with financial calculations,
 * professional formatting, and adaptive labeling for both buy and sell operations.
 * Features include precise decimal formatting, clear visual hierarchy, and seamless
 * integration with trading workflows and order confirmation processes.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for OrderSummary component configuration
 * @interface OrderSummaryProps
 * @extends {BaseComponentProps}
 */
export interface OrderSummaryProps extends BaseComponentProps {
  /** Number of shares in the order */
  quantityNum: number;
  /** Price per share for the transaction */
  lastPrice: number;
  /** Total cost or proceeds for the order */
  totalCost: number;
  /** Trading operation mode: 'buy' or 'sell' */
  mode?: "buy" | "sell";
}

/**
 * Professional order summary component for trading transaction details
 *
 * @remarks
 * The OrderSummary component delivers comprehensive trading order display with the following features:
 *
 * **Financial Data Display:**
 * - Precise decimal formatting for share quantities
 * - Professional currency formatting with dollar signs
 * - Clear separation between individual and total amounts
 * - Consistent numerical precision (2 decimal places)
 *
 * **Adaptive Labeling:**
 * - Context-aware labels based on trading mode
 * - "Total Cost" for buy operations
 * - "Total Proceeds" for sell operations
 * - Professional financial terminology
 *
 * **Visual Design:**
 * - Clean card layout with surface background
 * - Clear visual hierarchy with typography weights
 * - Border separation for total amount emphasis
 * - Consistent spacing and alignment
 *
 * **Information Architecture:**
 * - Structured data presentation with key-value pairs
 * - Logical flow from shares to price to total
 * - Clear visual separation between line items
 * - Prominent total amount display
 *
 * **Trading Integration:**
 * - Seamless integration with buy/sell workflows
 * - Real-time calculation display
 * - Order confirmation compatibility
 * - Professional trading interface styling
 *
 * **Typography:**
 * - Secondary text for labels and descriptions
 * - Primary text for important values
 * - Bold emphasis for total amounts
 * - Consistent font sizing and weights
 *
 * **Theme Integration:**
 * - CSS custom properties for consistent theming
 * - Surface background for card styling
 * - Border colors that adapt to theme
 * - Text colors that follow theme conventions
 *
 * **Accessibility:**
 * - Clear visual hierarchy for screen readers
 * - Semantic HTML structure
 * - Proper contrast ratios
 * - Logical reading order
 *
 * @param props - Configuration object for order summary display
 * @returns OrderSummary component with formatted trading details
 *
 * @example
 * ```tsx
 * // Basic buy order summary
 * <OrderSummary
 *   quantityNum={100}
 *   lastPrice={150.25}
 *   totalCost={15025.00}
 *   mode="buy"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Sell order summary with proceeds
 * <OrderSummary
 *   quantityNum={50}
 *   lastPrice={200.50}
 *   totalCost={10025.00}
 *   mode="sell"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with trading form
 * function TradingOrderForm({ mode }: { mode: "buy" | "sell" }) {
 *   const [quantity, setQuantity] = useState(0);
 *   const { data: currentPrice } = useStockPrice(symbol);
 *
 *   const totalAmount = quantity * currentPrice;
 *
 *   return (
 *     <div className="space-y-6">
 *       <QuantityInput
 *         quantity={quantity.toString()}
 *         onQuantityChange={(q) => setQuantity(parseFloat(q) || 0)}
 *       />
 *
 *       <OrderSummary
 *         quantityNum={quantity}
 *         lastPrice={currentPrice}
 *         totalCost={totalAmount}
 *         mode={mode}
 *       />
 *
 *       <ConfirmButton>
 *         Confirm {mode === "buy" ? "Purchase" : "Sale"}
 *       </ConfirmButton>
 *     </div>
 *   );
 * }
 * ```
 */
export default function OrderSummary({
  quantityNum,
  lastPrice,
  totalCost,
  mode = "buy",
}: OrderSummaryProps) {
  return (
    <div className="bg-[var(--surface)] p-4 rounded-xl space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-secondary)]">Shares:</span>
        <span className="font-medium">{quantityNum.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-secondary)]">Price per share:</span>
        <span className="font-medium">${lastPrice.toFixed(2)}</span>
      </div>
      <div className="border-t border-[var(--border)] pt-2">
        <div className="flex justify-between">
          <span className="font-medium text-[var(--text-primary)]">
            {mode === "sell" ? "Total Proceeds:" : "Total Cost:"}
          </span>
          <span className="font-bold text-lg text-[var(--text-primary)]">
            ${totalCost.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
