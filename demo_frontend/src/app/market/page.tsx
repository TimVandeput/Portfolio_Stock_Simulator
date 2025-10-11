/**
 * @packageDocumentation
 * Market data and trading interface page route.
 *
 * This module defines the markets page that provides comprehensive market data
 * viewing, symbol searching, and trading functionality. It serves as the primary
 * interface for users to browse available stocks and initiate buy transactions.
 *
 * @remarks
 * This Next.js App Router page implements a sophisticated market data interface
 * with real-time price updates, advanced filtering capabilities, and responsive
 * design patterns. The page integrates with live price feeds and provides
 * seamless navigation to individual symbol trading interfaces.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Metadata } from "next";
import MarketClient from "./Client";

/**
 * SEO metadata configuration for the markets page.
 *
 * Defines the page title and description for the market data interface,
 * optimized for search engines and providing clear context about the
 * trading and market browsing functionality available on this page.
 *
 * @example
 * ```tsx
 * // This metadata is automatically applied by Next.js
 * export const metadata: Metadata = {
 *   title: "Markets",
 *   description: "Market data and trading interface"
 * };
 * ```
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Next.js Metadata API}
 */
export const metadata: Metadata = {
  title: "Markets",
  description: "Market data and trading interface",
};

/**
 * Markets page server component.
 *
 * Renders the comprehensive market data and trading interface that allows users
 * to browse available stocks, view real-time prices, search and filter symbols,
 * and navigate to individual trading pages. This server component provides the
 * page structure while delegating interactive features to the MarketClient.
 *
 * @remarks
 * This server component follows the Next.js App Router pattern, handling
 * static rendering while delegating all interactive functionality to the
 * client component. The markets page provides:
 *
 * **Core Features**:
 * - **Real-time Market Data**: Live price updates with visual indicators
 * - **Advanced Search**: Symbol name and company search functionality
 * - **Multi-criteria Sorting**: Price, change, volume, and alphabetical sorting
 * - **Responsive Design**: Desktop table and mobile list views
 * - **Pagination**: Efficient browsing of large symbol datasets
 *
 * **Trading Integration**:
 * - **Buy Navigation**: Direct links to purchase interfaces
 * - **Symbol Details**: Access to detailed stock information
 * - **Price Alerts**: Visual indicators for price movements
 *
 * The page is accessible to authenticated users and provides the primary
 * gateway for market research and trading initiation within the application.
 *
 * @example
 * ```tsx
 * // This component is automatically rendered by Next.js for "/market" route
 * export default function MarketPage() {
 *   return <MarketClient />; // Delegate to interactive market interface
 * }
 * ```
 *
 * @returns The markets page React element containing the interactive market
 * data interface with search, sorting, and trading capabilities.
 *
 * @see {@link MarketClient} - The client component handling market interactivity
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Pages Documentation}
 *
 * @public
 */
export default function MarketPage() {
  return <MarketClient />;
}
