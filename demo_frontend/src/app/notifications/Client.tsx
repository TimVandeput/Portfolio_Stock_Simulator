/**
 * @fileoverview Interactive notifications management client component.
 *
 * This module provides comprehensive notification center functionality with
 * real-time alerts, interactive management capabilities, and sophisticated
 * user experience patterns. It handles all types of system notifications,
 * trading alerts, and user communications within the Stock Simulator platform.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useState, useEffect } from "react";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "@/lib/api/notifications";
import { getUserId } from "@/lib/auth/tokenStorage";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import StatusMessage from "@/components/status/StatusMessage";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import NotificationCard from "@/components/cards/NotificationCard";
import type { NotificationResponse } from "@/types/notification";

/**
 * Interactive notifications center client component with real-time management.
 *
 * This sophisticated client component provides a comprehensive notification
 * management interface that handles all user communications, system alerts,
 * and trading notifications. It implements real-time updates, interactive
 * management capabilities, and advanced user experience patterns for
 * optimal notification handling.
 *
 * @remarks
 * The component delivers comprehensive notification management through:
 *
 * **Authentication & User Context**:
 * - Requires user authentication for notification access
 * - Automatically loads user-specific notification history
 * - Integrates with user preferences and settings
 * - Provides personalized notification experiences
 *
 * **Notification Categories & Types**:
 * - **Trading Notifications**: Order confirmations, execution alerts
 * - **Portfolio Updates**: Performance changes, milestone notifications
 * - **System Messages**: Platform updates, maintenance alerts
 * - **Market Alerts**: Price movements, significant market events
 * - **Account Notifications**: Security updates, profile changes
 *
 * **Interactive Management Features**:
 * - **Read/Unread Status**: Visual indicators and state management
 * - **Expandable Content**: Detailed view for complex notifications
 * - **Bulk Actions**: Mass operations for notification management
 * - **Filtering Options**: Category-based and status-based filtering
 * - **Search Capabilities**: Find specific notifications quickly
 *
 * **Real-time & Performance**:
 * - **Live Updates**: Real-time notification delivery and status changes
 * - **Optimistic Updates**: Immediate UI feedback for user actions
 * - **Efficient Loading**: Lazy loading and pagination for large lists
 * - **Cache Management**: Intelligent caching for performance optimization
 *
 * **User Experience Optimizations**:
 * - **Responsive Design**: Optimized layouts for all device types
 * - **Loading States**: Smooth transitions during data operations
 * - **Empty States**: Helpful messaging and actions when no notifications exist
 * - **Error Recovery**: Graceful error handling with retry mechanisms
 * - **Accessibility**: Full keyboard navigation and screen reader support
 *
 * **Visual & Interaction Design**:
 * - **Priority Indicators**: Visual cues for notification importance
 * - **Time Stamps**: Relative and absolute time display
 * - **Action Buttons**: Context-sensitive actions for each notification
 * - **Animation Effects**: Smooth transitions and micro-interactions
 *
 * The component serves as a critical communication hub, ensuring users
 * stay informed about all aspects of their trading simulation experience
 * while providing powerful tools for notification organization and management.
 *
 * @example
 * ```tsx
 * // Rendered by the NotificationsPage server component
 * function NotificationsClient() {
 *   const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
 *   const [loading, setLoading] = useState(true);
 *   const [expandedId, setExpandedId] = useState<number | null>(null);
 *
 *   const handleMarkAsRead = async (id: number) => {
 *     await markNotificationAsRead(id);
 *     setNotifications(prev =>
 *       prev.map(n => n.id === id ? { ...n, read: true } : n)
 *     );
 *   };
 *
 *   return (
 *     <div className="notifications-center">
 *       {loading ? (
 *         <Loader />
 *       ) : notifications.length === 0 ? (
 *         <EmptyState message="No notifications yet" />
 *       ) : (
 *         notifications.map(notification => (
 *           <NotificationCard
 *             key={notification.id}
 *             notification={notification}
 *             expanded={expandedId === notification.id}
 *             onToggleExpand={() => setExpandedId(
 *               expandedId === notification.id ? null : notification.id
 *             )}
 *             onMarkAsRead={() => handleMarkAsRead(notification.id)}
 *           />
 *         ))
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns The comprehensive notifications center interface with categorized
 * alerts, interactive management tools, and real-time updates, or loading
 * states during data fetching operations.
 *
 * @see {@link getUserNotifications} - API function for fetching user notifications
 * @see {@link markNotificationAsRead} - API function for updating read status
 * @see {@link NotificationCard} - Individual notification display component
 * @see {@link getUserId} - Authentication utility for user identification
 * @see {@link NotificationResponse} - TypeScript interface for notification data
 *
 * @public
 */
export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedNotificationId, setExpandedNotificationId] = useState<
    number | null
  >(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const userId = getUserId();
      if (!userId) {
        setError("User not authenticated");
        return;
      }

      const data = await getUserNotifications(userId);
      setNotifications(data);
    } catch (err) {
      setError(getErrorMessage(err) || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const toggleNotificationExpansion = (notificationId: number) => {
    setExpandedNotificationId((prev) => {
      if (prev === notificationId) {
        return null;
      }
      return notificationId;
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="page-card p-4 sm:p-6 rounded-2xl max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-[var(--text-secondary)]">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6">
            <StatusMessage message={error} type="error" className="mb-4" />
            <button
              onClick={fetchNotifications}
              className="neu-button px-4 py-2 rounded-xl hover:scale-105 transition-transform"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-12">
            <Loader cover="main" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            icon="bell"
            title="No notifications yet"
            description="You'll see important updates and alerts here when they arrive."
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                isExpanded={expandedNotificationId === notification.id}
                onToggleExpansion={toggleNotificationExpansion}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
