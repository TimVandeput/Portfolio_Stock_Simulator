/**
 * @packageDocumentation
 * Trading orders management page route.
 *
 * This module defines the orders page that provides comprehensive trading history
 * and order management functionality, including transaction records, order status
 * tracking, and detailed trading analytics for users.
 *
 * @remarks
 * This Next.js App Router page implements a sophisticated order management
 * interface with advanced filtering, sorting, and search capabilities. It serves
 * as the central hub for users to review their trading history and monitor
 * order status within the Stock Simulator.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Metadata } from "next";
import OrdersClient from "./Client";

/**
 * SEO metadata configuration for the orders page.
 *
 * Defines the page title and description for the trading orders interface,
 * optimized for search engines and providing clear context about the order
 * management and trading history functionality available on this page.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Next.js Metadata API}
 */
export const metadata: Metadata = {
  title: "Orders",
  description: "Your trading orders",
};

/**
 * Orders page server component.
 *
 * Renders the comprehensive trading orders interface that allows users to view
 * their complete trading history, filter and search orders, analyze trading
 * patterns, and track order status. This server component provides the page
 * structure while delegating interactive features to the OrdersClient.
 *
 * @remarks
 * The orders page provides essential trading management features including
 * comprehensive order history, advanced filtering and search capabilities,
 * trading analytics, and detailed transaction records. It supports multiple
 * view modes and export functionality for trading analysis.
 *
 * @example
 * ```tsx
 * // This component is automatically rendered by Next.js for "/orders" route
 * export default function OrdersPage() {
 *   return <OrdersClient />; // Delegate to orders management interface
 * }
 * ```
 *
 * @returns The orders page React element containing the interactive trading
 * orders interface with history, filtering, and analytics features.
 *
 * @see {@link OrdersClient} - The client component handling orders interactivity
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Pages Documentation}
 *
 * @public
 */
export default function OrdersPage() {
  return <OrdersClient />;
}
