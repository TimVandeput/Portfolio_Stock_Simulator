/**
 * @fileoverview User Wallet Management API Module
 *
 * Provides comprehensive functionality for managing user wallet balances
 * within the Stock Simulator application. Handles cash balance retrieval,
 * buying power calculations, and account funding operations.
 *
 * @module lib/api/wallet
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @example
 * ```typescript
 * import { getWalletBalance } from '@/lib/api/wallet';
 *
 * // Get current wallet balance and buying power
 * const wallet = await getWalletBalance(123);
 * console.log(`Available Cash: $${wallet.cashBalance.toLocaleString()}`);
 * console.log(`Buying Power: $${wallet.buyingPower.toLocaleString()}`);
 * ```
 */

import { HttpClient, ApiError } from "@/lib/api/http";
import type { WalletBalanceResponse } from "@/types/wallet";

const client = new HttpClient();

/**
 * Retrieves comprehensive wallet balance information for a specific user.
 *
 * Fetches detailed wallet data including available cash balance, buying power,
 * pending transactions, margin information, and account funding status.
 * Essential for trading operations and portfolio management.
 *
 * @param userId - The unique identifier of the user whose wallet balance to retrieve
 * @returns Promise resolving to comprehensive wallet balance information
 *
 * @throws {ApiError} When API request fails or user is unauthorized
 * @throws {Error} When network or parsing errors occur
 *
 * @remarks
 * This function:
 * - Retrieves current available cash balance for trading
 * - Calculates total buying power including margin (if applicable)
 * - Includes pending transaction amounts and holds
 * - Provides account funding status and limitations
 * - Supports real-time balance updates and synchronization
 * - Automatically handles authentication via HttpClient
 * - Essential for order validation and trading interface updates
 *
 * Wallet information includes:
 * - Available cash balance for immediate trading
 * - Total buying power (cash + margin)
 * - Pending deposits and withdrawal amounts
 * - Held funds for open orders
 * - Account type and trading permissions
 * - Margin requirements and utilization
 *
 * Balance calculations:
 * - Cash balance: Immediately available funds
 * - Buying power: Total funds available for purchases
 * - Held funds: Money reserved for pending orders
 * - Net liquidation value: Total account value
 * - Margin used: Borrowed funds currently in use
 *
 * @example
 * ```typescript
 * // Get wallet balance for trading validation
 * const wallet = await getWalletBalance(123);
 *
 * console.log(`Account Summary:`);
 * console.log(`Cash Balance: $${wallet.cashBalance.toLocaleString()}`);
 * console.log(`Buying Power: $${wallet.buyingPower.toLocaleString()}`);
 * console.log(`Held Funds: $${wallet.heldFunds.toLocaleString()}`);
 *
 * if (wallet.marginEnabled) {
 *   console.log(`Margin Used: $${wallet.marginUsed.toLocaleString()}`);
 *   console.log(`Margin Available: $${wallet.marginAvailable.toLocaleString()}`);
 * }
 *
 * // Check if user can afford a purchase
 * const purchaseAmount = 5000;
 * const canAfford = wallet.buyingPower >= purchaseAmount;
 * console.log(`Can afford $${purchaseAmount} purchase: ${canAfford}`);
 * ```
 *
 * @example
 * ```typescript
 * // React component for wallet balance display
 * function WalletBalanceCard({ userId }: { userId: number }) {
 *   const [wallet, setWallet] = useState<WalletBalanceResponse | null>(null);
 *   const [loading, setLoading] = useState(true);
 *   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
 *
 *   const loadBalance = useCallback(async () => {
 *     try {
 *       const data = await getWalletBalance(userId);
 *       setWallet(data);
 *       setLastUpdate(new Date());
 *     } catch (error) {
 *       console.error('Failed to load wallet balance:', error);
 *     } finally {
 *       setLoading(false);
 *     }
 *   }, [userId]);
 *
 *   useEffect(() => {
 *     loadBalance();
 *
 *     // Refresh balance every 30 seconds
 *     const interval = setInterval(loadBalance, 30000);
 *     return () => clearInterval(interval);
 *   }, [loadBalance]);
 *
 *   if (loading) return <div className="wallet-card loading">Loading balance...</div>;
 *   if (!wallet) return <div className="wallet-card error">Failed to load balance</div>;
 *
 *   return (
 *     <div className="wallet-balance-card">
 *       <h3>Account Balance</h3>
 *
 *       <div className="balance-info">
 *         <div className="balance-item primary">
 *           <label>Available Cash</label>
 *           <span className="amount">${wallet.cashBalance.toLocaleString()}</span>
 *         </div>
 *
 *         <div className="balance-item">
 *           <label>Buying Power</label>
 *           <span className="amount">${wallet.buyingPower.toLocaleString()}</span>
 *         </div>
 *
 *         {wallet.heldFunds > 0 && (
 *           <div className="balance-item">
 *             <label>Held Funds</label>
 *             <span className="amount">${wallet.heldFunds.toLocaleString()}</span>
 *           </div>
 *         )}
 *
 *         {wallet.marginEnabled && (
 *           <>
 *             <div className="balance-item">
 *               <label>Margin Used</label>
 *               <span className="amount">${wallet.marginUsed.toLocaleString()}</span>
 *             </div>
 *
 *             <div className="balance-item">
 *               <label>Margin Available</label>
 *               <span className="amount">${wallet.marginAvailable.toLocaleString()}</span>
 *             </div>
 *           </>
 *         )}
 *       </div>
 *
 *       <div className="balance-footer">
 *         <button onClick={loadBalance} className="refresh-btn">
 *           Refresh Balance
 *         </button>
 *         {lastUpdate && (
 *           <span className="last-update">
 *             Updated: {lastUpdate.toLocaleTimeString()}
 *           </span>
 *         )}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Trading validation with wallet balance
 * async function validateTradeOrder(userId: number, orderAmount: number) {
 *   try {
 *     const wallet = await getWalletBalance(userId);
 *
 *     // Check available buying power
 *     if (wallet.buyingPower < orderAmount) {
 *       throw new Error(`Insufficient buying power. Available: $${wallet.buyingPower.toLocaleString()}, Required: $${orderAmount.toLocaleString()}`);
 *     }
 *
 *     // Check for minimum balance requirements
 *     const minimumBalance = 1000; // Example minimum
 *     const remainingAfterTrade = wallet.buyingPower - orderAmount;
 *
 *     if (remainingAfterTrade < minimumBalance) {
 *       console.warn(`Trade will leave balance below minimum. Remaining: $${remainingAfterTrade.toLocaleString()}`);
 *     }
 *
 *     // Calculate margin impact if applicable
 *     if (wallet.marginEnabled && orderAmount > wallet.cashBalance) {
 *       const marginNeeded = orderAmount - wallet.cashBalance;
 *       const marginAfterTrade = wallet.marginUsed + marginNeeded;
 *
 *       console.log(`Trade will use $${marginNeeded.toLocaleString()} in margin`);
 *       console.log(`Total margin after trade: $${marginAfterTrade.toLocaleString()}`);
 *
 *       if (marginAfterTrade > wallet.marginLimit) {
 *         throw new Error('Trade would exceed margin limit');
 *       }
 *     }
 *
 *     return {
 *       approved: true,
 *       buyingPower: wallet.buyingPower,
 *       marginImpact: wallet.marginEnabled ? Math.max(0, orderAmount - wallet.cashBalance) : 0
 *     };
 *
 *   } catch (error) {
 *     console.error('Trade validation failed:', error);
 *     throw error;
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Real-time wallet balance monitoring
 * function useWalletBalance(userId: number, refreshInterval = 30000) {
 *   const [wallet, setWallet] = useState<WalletBalanceResponse | null>(null);
 *   const [loading, setLoading] = useState(true);
 *   const [error, setError] = useState<string | null>(null);
 *
 *   const refreshBalance = useCallback(async () => {
 *     try {
 *       setError(null);
 *       const data = await getWalletBalance(userId);
 *       setWallet(data);
 *     } catch (err) {
 *       const message = err instanceof Error ? err.message : 'Failed to load wallet balance';
 *       setError(message);
 *       console.error('Wallet balance error:', err);
 *     } finally {
 *       setLoading(false);
 *     }
 *   }, [userId]);
 *
 *   useEffect(() => {
 *     refreshBalance();
 *
 *     if (refreshInterval > 0) {
 *       const interval = setInterval(refreshBalance, refreshInterval);
 *       return () => clearInterval(interval);
 *     }
 *   }, [refreshBalance, refreshInterval]);
 *
 *   // Listen for trade completion events to refresh balance
 *   useEffect(() => {
 *     const handleTradeComplete = () => {
 *       console.log('Trade completed, refreshing wallet balance');
 *       refreshBalance();
 *     };
 *
 *     window.addEventListener('tradeCompleted', handleTradeComplete);
 *     return () => window.removeEventListener('tradeCompleted', handleTradeComplete);
 *   }, [refreshBalance]);
 *
 *   return {
 *     wallet,
 *     loading,
 *     error,
 *     refresh: refreshBalance,
 *     canAfford: (amount: number) => wallet ? wallet.buyingPower >= amount : false
 *   };
 * }
 * ```
 */
export async function getWalletBalance(
  userId: number
): Promise<WalletBalanceResponse> {
  try {
    return await client.get<WalletBalanceResponse>(
      `/api/wallet/${userId}/balance`
    );
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}
