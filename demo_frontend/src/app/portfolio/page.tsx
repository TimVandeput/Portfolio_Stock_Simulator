/**
 * @packageDocumentation
 * Portfolio management page route for investment tracking.
 *
 * This module defines the portfolio page that provides comprehensive investment
 * portfolio management, including holdings overview, performance analytics,
 * transaction history, and portfolio statistics for users.
 *
 * @remarks
 * This Next.js App Router page implements a sophisticated portfolio management
 * interface with real-time value updates, performance tracking, and detailed
 * analytics. It serves as the central hub for users to monitor their investments
 * and trading performance within the Stock Simulator.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Metadata } from "next";
import PortfolioClient from "./Client";

/**
 * SEO metadata configuration for the portfolio page.
 *
 * Defines the page title and description for the investment portfolio interface,
 * optimized for search engines and providing clear context about the portfolio
 * management and tracking functionality available on this page.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Next.js Metadata API}
 */
export const metadata: Metadata = {
  title: "Portfolio",
  description: "Your investment portfolio",
};

/**
 * Portfolio page server component.
 *
 * Renders the comprehensive portfolio management interface that allows users to
 * view their investment holdings, track performance, analyze gains/losses, and
 * manage their trading positions. This server component provides the page
 * structure while delegating interactive features to the PortfolioClient.
 *
 * @remarks
 * The portfolio page provides essential investment management features including
 * real-time portfolio value updates, detailed holdings analysis, performance
 * metrics, and transaction history. It integrates with live price feeds to
 * provide accurate, up-to-date portfolio valuations and performance tracking.
 *
 * @example
 * ```tsx
 * // This component is automatically rendered by Next.js for "/portfolio" route
 * export default function PortfolioPage() {
 *   return <PortfolioClient />; // Delegate to portfolio management interface
 * }
 * ```
 *
 * @returns The portfolio page React element containing the interactive portfolio
 * management interface with holdings, analytics, and trading features.
 *
 * @see {@link PortfolioClient} - The client component handling portfolio interactivity
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Pages Documentation}
 *
 * @public
 */
export default function PortfolioPage() {
  return <PortfolioClient />;
}
