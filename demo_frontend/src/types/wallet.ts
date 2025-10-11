/**
 * @fileoverview Wallet Management Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * Request for adding cash to user wallet account.
 *
 * Contains information required to process a cash addition transaction
 * including the amount and reason for the transaction.
 *
 * @interface AddCashRequest
 * @property {number} amount - Amount of cash to add (must be positive)
 * @property {string} reason - Reason or description for the cash addition
 *
 * @example
 * ```typescript
 * const initialDeposit: AddCashRequest = {
 *   amount: 10000.00,
 *   reason: "Initial account funding"
 * };
 *
 * const bonusCredit: AddCashRequest = {
 *   amount: 500.00,
 *   reason: "Referral bonus credit"
 * };
 * ```
 */
export interface AddCashRequest {
  amount: number;
  reason: string;
}

/**
 * Wallet balance response containing comprehensive account financial information.
 *
 * Provides complete overview of user's financial position including
 * available cash, market value of holdings, and total portfolio value.
 *
 * @interface WalletBalanceResponse
 * @property {number} cashBalance - Available cash balance for trading
 * @property {number} totalMarketValue - Current market value of all holdings
 * @property {number} totalPortfolioValue - Total portfolio value (cash + holdings)
 *
 * @example
 * ```typescript
 * const userWallet: WalletBalanceResponse = {
 *   cashBalance: 15000.00,
 *   totalMarketValue: 35750.25,
 *   totalPortfolioValue: 50750.25
 * };
 *
 * const beginnerWallet: WalletBalanceResponse = {
 *   cashBalance: 10000.00,
 *   totalMarketValue: 0.00,
 *   totalPortfolioValue: 10000.00
 * };
 * ```
 */
export interface WalletBalanceResponse {
  cashBalance: number;
  totalMarketValue: number;
  totalPortfolioValue: number;
}
