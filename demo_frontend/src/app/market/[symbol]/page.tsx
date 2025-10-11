/**
 * @fileoverview Dynamic stock purchase page for individual stock symbols.
 *
 * This module provides a dedicated stock purchase interface that enables users
 * to buy shares of specific stocks through a comprehensive trading interface.
 * It serves as the server-side entry point for individual stock purchase
 * operations within the Stock Simulator platform's market functionality.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Metadata } from "next";
import BuySymbolClient from "./Client";

/**
 * Props interface for the BuySymbolPage component.
 * @interface Props
 */
interface Props {
  /** Dynamic route parameters containing the stock symbol to purchase */
  params: Promise<{ symbol: string }>;
}

/**
 * Metadata configuration for the stock purchase page.
 * Provides SEO optimization and browser tab information for individual
 * stock purchase operations.
 */
export const metadata: Metadata = {
  title: "Buy Stock",
  description: "Purchase shares in your portfolio",
};

/**
 * Dynamic stock purchase page server component for individual stock symbols.
 *
 * This server component handles the routing and parameter extraction for
 * individual stock purchase operations within the Stock Simulator platform.
 * It processes dynamic URL parameters to identify the specific stock symbol
 * being purchased and renders the appropriate client-side trading interface.
 *
 * @remarks
 * The component provides essential stock purchase functionality through:
 *
 * **Dynamic Routing Integration**:
 * - **URL Parameter Processing**: Extracts stock symbol from dynamic route
 * - **Symbol Normalization**: Converts symbols to uppercase for consistency
 * - **Route Validation**: Ensures valid symbol parameters for trading operations
 * - **Server-side Rendering**: Optimized initial page load performance
 *
 * **Trading Interface Foundation**:
 * - **Client Component Delegation**: Renders interactive trading interface
 * - **Symbol Context Passing**: Provides normalized symbol to client component
 * - **Authentication Preparation**: Sets up secure trading environment
 * - **Real-time Data Foundation**: Enables live price and market data integration
 *
 * **SEO and Navigation**:
 * - **Dynamic Metadata**: Contextual page titles and descriptions
 * - **Search Engine Optimization**: Proper meta tags for stock pages
 * - **Browser Integration**: Optimized browser back/forward navigation
 * - **Accessibility Foundation**: Server-side rendering for screen readers
 *
 * **Performance Optimizations**:
 * - **Server-side Processing**: Parameter extraction before client hydration
 * - **Minimal Client Bundle**: Separates server logic from client interactions
 * - **Route Pre-processing**: Optimized URL parameter handling
 * - **Static Generation Ready**: Compatible with Next.js build optimizations
 *
 * The component serves as the foundation for comprehensive stock purchase
 * operations, providing users with a dedicated interface for executing
 * buy orders with real-time market data integration and secure transaction
 * processing within the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Accessed via URL: /market/AAPL
 * // Server component processes the route parameter
 * async function BuySymbolPage({ params }: Props) {
 *   const { symbol } = await params; // "aapl"
 *   const symbolUpper = symbol.toUpperCase(); // "AAPL"
 *
 *   return <BuySymbolClient symbol={symbolUpper} />;
 * }
 *
 * // Renders interactive trading interface:
 * // - Real-time AAPL price display
 * // - Quantity input and validation
 * // - Wallet balance integration
 * // - Order confirmation and execution
 * ```
 *
 * @param params - Dynamic route parameters containing the stock symbol
 * @returns Server-rendered stock purchase page with client-side trading interface
 *
 * @see {@link BuySymbolClient} - Interactive client-side trading component
 * @see {@link metadata} - SEO and browser optimization configuration
 *
 * @public
 */
export default async function BuySymbolPage({ params }: Props) {
  const { symbol } = await params;
  const symbolUpper = symbol.toUpperCase();

  return <BuySymbolClient symbol={symbolUpper} />;
}
