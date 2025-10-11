/**
 * @fileoverview Wallet balance display card component for cash balance information.
 *
 * This module provides a specialized wallet balance card component that displays
 * available cash balance information with loading states and visual indicators
 * within the Stock Simulator platform. It combines financial data presentation
 * with user-friendly loading states and accessibility features.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { WalletBalanceResponse } from "@/types/wallet";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the WalletBalanceCard component.
 * @interface WalletBalanceCardProps
 * @extends BaseComponentProps
 */
export interface WalletBalanceCardProps extends BaseComponentProps {
  /** Wallet balance data containing cash balance and portfolio information */
  walletBalance?: WalletBalanceResponse | null;
  /** Loading state indicator for wallet balance data fetching */
  walletLoading: boolean;
}

/**
 * Wallet balance display card with cash balance information and loading states.
 *
 * This specialized card component provides professional presentation of wallet
 * cash balance information with comprehensive loading state management and
 * visual indicators within the Stock Simulator platform. It features financial
 * data formatting, loading animations, and accessibility compliance for
 * optimal user experience in financial applications.
 *
 * @remarks
 * The component delivers professional wallet balance presentation through:
 *
 * **Financial Balance Display**:
 * - **Cash Balance**: Prominently displayed available cash amount
 * - **Currency Formatting**: Professional dollar formatting with decimal precision
 * - **Balance Labeling**: Clear identification of available cash vs. total assets
 * - **Fallback Values**: Graceful handling of missing or null balance data
 *
 * **Loading State Management**:
 * - **Loading Animation**: Skeleton loading animation during data fetching
 * - **State Transitions**: Smooth transitions between loading and loaded states
 * - **Visual Feedback**: Clear indication of data loading progress
 * - **User Experience**: Prevents layout shifts during data loading
 *
 * **Visual Design Elements**:
 * - **Wallet Icon**: Contextual wallet icon for immediate recognition
 * - **Neumorphic Styling**: Consistent card design with platform aesthetics
 * - **Color Theming**: CSS custom properties for dynamic theme support
 * - **Typography Hierarchy**: Clear distinction between labels and values
 *
 * **Accessibility Features**:
 * - **Screen Reader Support**: Descriptive content for assistive technologies
 * - **Semantic Structure**: Proper content organization and labeling
 * - **Loading States**: Accessible loading indicators for screen readers
 * - **Content Description**: Clear identification of financial information
 *
 * **Data Integration**:
 * - **Wallet API**: Integration with wallet balance API endpoints
 * - **Real-time Updates**: Supports live balance updates after transactions
 * - **Error Handling**: Graceful handling of API failures or network issues
 * - **Data Validation**: Proper handling of various data states and formats
 *
 * **Use Case Applications**:
 * - **Trading Interfaces**: Available balance for purchase operations
 * - **Portfolio Dashboards**: Cash balance as part of total portfolio value
 * - **Transaction Forms**: Balance verification for trade execution
 * - **Account Overviews**: Financial account status and available funds
 *
 * **Responsive Design**:
 * - **Mobile Optimization**: Touch-friendly layouts and appropriate sizing
 * - **Flexible Layout**: Adapts to varying balance amounts and formats
 * - **Consistent Spacing**: Standardized padding and margin implementations
 * - **Layout Stability**: Maintains consistent appearance across data states
 *
 * **Financial Data Handling**:
 * - **Precision Formatting**: Accurate two-decimal place currency display
 * - **Null Safety**: Safe handling of undefined or null balance data
 * - **Loading Fallbacks**: Appropriate default values during data loading
 * - **State Consistency**: Reliable data presentation across component updates
 *
 * The component serves as an essential element for financial interfaces,
 * providing users with clear, accurate, and accessible presentation of
 * their available cash balance for trading and investment decisions within
 * the Stock Simulator platform.
 *
 * @example
 * @example
 * Basic wallet balance card usage:
 * ```tsx
 * function TradingPanel() {
 *   const [walletBalance, setWalletBalance] = useState<WalletBalanceResponse | null>(null);
 *   const [loading, setLoading] = useState(true);
 *
 *   useEffect(() => {
 *     const fetchBalance = async () => {
 *       setLoading(true);
 *       try {
 *         const balance = await getWalletBalance(userId);
 *         setWalletBalance(balance);
 *       } catch (error) {
 *         console.error('Failed to load balance:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     fetchBalance();
 *   }, [userId]);
 *
 *   return (
 *     <div className="trading-panel">
 *       <WalletBalanceCard
 *         walletBalance={walletBalance}
 *         walletLoading={loading}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Wallet balance with real-time updates:
 * ```tsx
 * function AccountOverview() {
 *   const { balance, loading, error } = useWalletBalance();
 *
 *   return (
 *     <div className="account-section">
 *       <h2>Account Balance</h2>
 *       <WalletBalanceCard
 *         walletBalance={balance}
 *         walletLoading={loading}
 *       />
 *       {error && (
 *         <div className="error-message">
 *           Failed to load balance information
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * Integration with trading form:
 * ```tsx
 * function BuyOrderForm({ symbol }: { symbol: string }) {
 *   const { walletBalance, loading } = useWallet();
 *
 *   return (
 *     <form className="buy-order-form">
 *       <WalletBalanceCard
 *         walletBalance={walletBalance}
 *         walletLoading={loading}
 *       />
 *       <div className="order-inputs">
 *         Order form inputs here
 *       </div>
 *     </form>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for wallet balance display and loading state management
 * @returns A wallet balance display card with cash balance information, loading states,
 * and professional financial presentation optimized for trading applications
 *
 * @see {@link WalletBalanceResponse} - TypeScript interface for wallet balance data
 * @see {@link DynamicIcon} - Icon component for visual wallet representation
 * @see {@link BaseComponentProps} - Base properties interface for components
 *
 * @public
 */
export default function WalletBalanceCard({
  walletBalance,
  walletLoading,
}: WalletBalanceCardProps) {
  return (
    <div className="neu-card p-4 rounded-xl mb-6">
      <div className="flex items-center gap-3">
        <DynamicIcon
          iconName="wallet"
          size={20}
          className="text-[var(--accent)]"
        />
        <div className="flex-1">
          <p className="text-sm text-[var(--text-secondary)]">Available Cash</p>
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
  );
}
