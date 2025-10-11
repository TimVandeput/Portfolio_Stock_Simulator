/**
 * @fileoverview Dynamic stock selling page for individual portfolio holdings.
 *
 * This module provides a dedicated stock selling interface that enables users
 * to sell shares from their existing portfolio holdings through a comprehensive
 * trading interface. It serves as the server-side entry point for individual
 * stock selling operations within the Stock Simulator platform's portfolio functionality.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Metadata } from "next";
import SellSymbolClient from "./Client";

/**
 * Props interface for the SellSymbolPage component.
 * @interface Props
 */
interface Props {
  /** Dynamic route parameters containing the stock symbol to sell */
  params: Promise<{ symbol: string }>;
}

/**
 * Metadata configuration for the stock selling page.
 * Provides SEO optimization and browser tab information for individual
 * stock selling operations from portfolio holdings.
 */
export const metadata: Metadata = {
  title: "Sell Stock",
  description: "Sell shares from your portfolio",
};

/**
 * Dynamic stock selling page server component for individual portfolio holdings.
 *
 * This server component handles the routing and parameter extraction for
 * individual stock selling operations within the Stock Simulator platform.
 * It processes dynamic URL parameters to identify the specific stock symbol
 * being sold from portfolio holdings and renders the appropriate client-side
 * trading interface with portfolio context.
 *
 * @remarks
 * The component provides essential stock selling functionality through:
 *
 * **Dynamic Routing Integration**:
 * - **URL Parameter Processing**: Extracts stock symbol from dynamic route
 * - **Symbol Normalization**: Converts symbols to uppercase for consistency
 * - **Route Validation**: Ensures valid symbol parameters for selling operations
 * - **Server-side Rendering**: Optimized initial page load performance
 *
 * **Portfolio Context Foundation**:
 * - **Holdings Integration**: Prepares access to user's portfolio holdings
 * - **Sell-specific Interface**: Renders selling-optimized trading interface
 * - **Position Management**: Sets up position reduction and closure capabilities
 * - **Profit/Loss Calculations**: Enables cost basis and gain/loss analysis
 *
 * **Trading Interface Foundation**:
 * - **Client Component Delegation**: Renders interactive selling interface
 * - **Symbol Context Passing**: Provides normalized symbol to client component
 * - **Authentication Preparation**: Sets up secure trading environment
 * - **Real-time Data Foundation**: Enables live price and portfolio data integration
 *
 * **SEO and Navigation**:
 * - **Dynamic Metadata**: Contextual page titles and descriptions
 * - **Search Engine Optimization**: Proper meta tags for portfolio pages
 * - **Browser Integration**: Optimized browser back/forward navigation
 * - **Accessibility Foundation**: Server-side rendering for screen readers
 *
 * **Performance Optimizations**:
 * - **Server-side Processing**: Parameter extraction before client hydration
 * - **Minimal Client Bundle**: Separates server logic from client interactions
 * - **Route Pre-processing**: Optimized URL parameter handling
 * - **Static Generation Ready**: Compatible with Next.js build optimizations
 *
 * The component serves as the foundation for comprehensive stock selling
 * operations, providing users with a dedicated interface for executing
 * sell orders with real-time market data integration, portfolio position
 * management, and secure transaction processing within the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Accessed via URL: /portfolio/AAPL
 * // Server component processes the route parameter
 * async function SellSymbolPage({ params }: Props) {
 *   const { symbol } = await params; // "aapl"
 *   const symbolUpper = symbol.toUpperCase(); // "AAPL"
 *
 *   return <SellSymbolClient symbol={symbolUpper} />;
 * }
 *
 * // Renders interactive selling interface:
 * // - Real-time AAPL price display
 * // - Current holdings information
 * // - Quantity input with holdings validation
 * // - Profit/loss calculations
 * // - Order confirmation and execution
 * ```
 *
 * @param params - Dynamic route parameters containing the stock symbol
 * @returns Server-rendered stock selling page with client-side trading interface
 * and portfolio context integration
 *
 * @see {@link SellSymbolClient} - Interactive client-side selling component
 * @see {@link metadata} - SEO and browser optimization configuration
 *
 * @public
 */
export default async function SellSymbolPage({ params }: Props) {
  const { symbol } = await params;
  const symbolUpper = symbol.toUpperCase();

  return <SellSymbolClient symbol={symbolUpper} />;
}
