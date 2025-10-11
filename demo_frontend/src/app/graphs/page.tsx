/**
 * @packageDocumentation
 * Market analytics and charting page route for portfolio visualization.
 *
 * This module defines the analytics page that provides comprehensive market
 * charting and visual analytics for user portfolio holdings. It offers
 * interactive charts, multiple time ranges, and real-time data visualization
 * for informed trading decisions within the Stock Simulator.
 *
 * @remarks
 * This Next.js App Router page implements sophisticated charting capabilities
 * using modern data visualization libraries. It provides portfolio-specific
 * analytics that help users understand their investment performance through
 * interactive charts and time-series analysis.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Metadata } from "next";
import GraphClient from "./Client";

/**
 * SEO metadata configuration for the analytics page.
 *
 * Defines the page title and description for the market analytics and
 * charting interface, emphasizing the live data and visual analytics
 * capabilities available to users for portfolio analysis.
 *
 * @example
 * ```tsx
 * // This metadata is automatically applied by Next.js
 * export const metadata: Metadata = {
 *   title: "Analytics",
 *   description: "Live market analytics and charts"
 * };
 * ```
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Next.js Metadata API}
 */
export const metadata: Metadata = {
  title: "Analytics",
  description: "Live market analytics and charts",
};

/**
 * Analytics page server component.
 *
 * Renders the comprehensive market analytics and charting interface that
 * provides users with visual insights into their portfolio performance.
 * This server component enables interactive chart exploration, multiple
 * time range analysis, and real-time data visualization capabilities.
 *
 * @remarks
 * This server component follows the Next.js App Router pattern while
 * providing access to sophisticated analytics features. The analytics
 * interface includes:
 *
 * **Charting Capabilities**:
 * - **Interactive Charts**: Dynamic price and volume visualization
 * - **Multiple Time Ranges**: 1D, 1W, 1M, 3M, 6M, 1Y, 5Y analysis
 * - **Portfolio Focus**: Charts limited to user's current holdings
 * - **Real-time Updates**: Live data integration with price feeds
 *
 * **Visual Analytics**:
 * - **Performance Tracking**: Historical price movements and trends
 * - **Volume Analysis**: Trading volume patterns and insights
 * - **Technical Indicators**: Moving averages and trend analysis
 * - **Responsive Design**: Optimized charts for all screen sizes
 *
 * **User Experience**:
 * - **Authentication Required**: Charts available only for logged-in users
 * - **Portfolio Integration**: Shows only stocks currently owned
 * - **Loading States**: Smooth transitions during data fetching
 * - **Error Handling**: Graceful fallbacks for data issues
 *
 * The page serves as a crucial tool for investment analysis and decision-making
 * within the trading simulation environment.
 *
 * @example
 * ```tsx
 * // This component is automatically rendered by Next.js for "/graphs" route
 * export default function GraphPage() {
 *   return <GraphClient />; // Delegate to interactive analytics interface
 * }
 * ```
 *
 * @returns The analytics page React element containing the interactive
 * charting interface with portfolio-focused market analytics.
 *
 * @see {@link GraphClient} - The client component handling chart interactivity
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Pages Documentation}
 *
 * @public
 */
export default function GraphPage() {
  return <GraphClient />;
}
