/**
 * @packageDocumentation
 * Symbols management page route for administrative symbol control.
 *
 * This module defines the symbols management page that provides comprehensive
 * administrative functionality for managing the tradable symbol universe,
 * including symbol importing, enabling/disabling, and universe management
 * within the Stock Simulator platform.
 *
 * @remarks
 * This Next.js App Router page implements an administrative interface
 * restricted to users with ADMIN role permissions. It provides sophisticated
 * symbol management capabilities including bulk imports from different
 * market universes and individual symbol control.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Metadata } from "next";
import SymbolsClient from "./Client";

/**
 * SEO metadata configuration for the symbols management page.
 *
 * Defines the page title and description for the administrative symbols
 * management interface, clearly indicating its administrative nature and
 * symbol management functionality.
 *
 * @example
 * ```tsx
 * // This metadata is automatically applied by Next.js
 * export const metadata: Metadata = {
 *   title: "Symbols",
 *   description: "Admin: manage tradable symbols"
 * };
 * ```
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Next.js Metadata API}
 */
export const metadata: Metadata = {
  title: "Symbols",
  description: "Admin: manage tradable symbols",
};

/**
 * Symbols management page server component.
 *
 * Renders the comprehensive symbols management interface that allows
 * administrators to manage the tradable symbol universe, import new symbols
 * from various market indices, and control symbol availability within the
 * trading platform. This server component enforces admin-only access.
 *
 * @remarks
 * This server component follows the Next.js App Router pattern while
 * enforcing strict role-based access control. The symbols management
 * interface provides:
 *
 * **Administrative Controls**:
 * - **Universe Management**: Import symbols from NASDAQ, S&P 500, etc.
 * - **Symbol Control**: Enable/disable individual symbols for trading
 * - **Bulk Operations**: Mass import and management capabilities
 * - **Status Monitoring**: Real-time import progress and status updates
 *
 * **Access Control**:
 * - Restricted to users with ADMIN role
 * - Automatic access denial for non-admin users
 * - Secure symbol management operations
 *
 * The page is critical for platform administration and should only be
 * accessible to trusted administrative users with proper permissions.
 *
 * @example
 * ```tsx
 * // This component is automatically rendered by Next.js for "/symbols" route
 * export default function SymbolsPage() {
 *   return <SymbolsClient />; // Delegate to admin symbols interface
 * }
 * ```
 *
 * @returns The symbols management page React element containing the
 * administrative interface for symbol universe management and control.
 *
 * @see {@link SymbolsClient} - The client component handling symbols management
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Pages Documentation}
 *
 * @public
 */
export default function SymbolsPage() {
  return <SymbolsClient />;
}
