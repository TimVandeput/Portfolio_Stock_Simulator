/**
 * @packageDocumentation
 * Notifications and alerts management page route.
 *
 * This module defines the notifications page that provides comprehensive
 * notification management functionality, including viewing system alerts,
 * trading notifications, portfolio updates, and other important communications
 * within the Stock Simulator platform.
 *
 * @remarks
 * This Next.js App Router page implements a sophisticated notification center
 * with real-time updates, categorized alerts, and interactive management
 * capabilities. It serves as the central hub for all user communications
 * and system notifications within the trading simulation environment.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Metadata } from "next";
import NotificationsClient from "./Client";

/**
 * SEO metadata configuration for the notifications page.
 *
 * Defines the page title and description for the notifications management
 * interface, emphasizing the alerts and communication functionality
 * available to users for staying informed about their trading activity.
 *
 * @example
 * ```tsx
 * // This metadata is automatically applied by Next.js
 * export const metadata: Metadata = {
 *   title: "Notifications",
 *   description: "Your notifications and alerts"
 * };
 * ```
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Next.js Metadata API}
 */
export const metadata: Metadata = {
  title: "Notifications",
  description: "Your notifications and alerts",
};

/**
 * Notifications page server component.
 *
 * Renders the comprehensive notifications management interface that allows
 * users to view, manage, and interact with system notifications, trading
 * alerts, portfolio updates, and other important communications. This
 * server component provides the foundation for real-time notification handling.
 *
 * @remarks
 * This server component follows the Next.js App Router pattern while
 * enabling sophisticated notification management features. The notifications
 * interface provides:
 *
 * **Notification Categories**:
 * - **Trading Alerts**: Order confirmations, execution notifications
 * - **Portfolio Updates**: Performance changes, milestone achievements
 * - **System Messages**: Platform updates, maintenance notifications
 * - **Market Alerts**: Price movements, significant market events
 *
 * **Management Features**:
 * - **Read/Unread Status**: Visual indicators and state management
 * - **Interactive Actions**: Mark as read, delete, archive operations
 * - **Expandable Content**: Detailed view for complex notifications
 * - **Chronological Ordering**: Time-based notification organization
 *
 * **User Experience**:
 * - **Real-time Updates**: Live notification delivery and status changes
 * - **Responsive Design**: Optimized for all device types
 * - **Loading States**: Smooth transitions during data operations
 * - **Empty States**: Helpful messaging when no notifications exist
 *
 * The page serves as a crucial communication hub, keeping users informed
 * about their trading activity and platform events.
 *
 * @example
 * ```tsx
 * // This component is automatically rendered by Next.js for "/notifications" route
 * export default function NotificationsPage() {
 *   return <NotificationsClient />; // Delegate to notifications management interface
 * }
 * ```
 *
 * @returns The notifications page React element containing the interactive
 * notification management interface with alerts, actions, and real-time updates.
 *
 * @see {@link NotificationsClient} - The client component handling notification interactivity
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Pages Documentation}
 *
 * @public
 */
export default function NotificationsPage() {
  return <NotificationsClient />;
}
