/**
 * @fileoverview User Notifications API Module
 *
 * Provides comprehensive functionality for managing user notifications
 * within the Stock Simulator application. Handles notification retrieval,
 * read status management, and real-time notification processing.
 *
 * @module lib/api/notifications
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @example
 * ```typescript
 * import { getUserNotifications, markNotificationAsRead } from '@/lib/api/notifications';
 *
 * // Retrieve and manage user notifications
 * const notifications = await getUserNotifications(123);
 * await markNotificationAsRead(notifications[0].id);
 * ```
 */

import { HttpClient, ApiError } from "@/lib/api/http";
import type { NotificationResponse } from "@/types/notification";

const client = new HttpClient();

/**
 * Retrieves all notifications for a specific user with comprehensive metadata.
 *
 * Fetches the complete list of notifications associated with the specified user,
 * including both read and unread notifications. The response includes detailed
 * notification metadata, content, timestamps, and interaction status.
 *
 * @param userId - The unique identifier of the user whose notifications to retrieve
 * @returns Promise resolving to array of comprehensive notification objects
 *
 * @throws {ApiError} When API request fails or user is unauthorized
 * @throws {Error} When network or parsing errors occur
 *
 * @remarks
 * This function:
 * - Retrieves ALL notifications for the specified user
 * - Includes both read and unread notifications
 * - Provides complete notification metadata and content
 * - Supports various notification types (trade confirmations, price alerts, etc.)
 * - Returns notifications sorted by creation date (newest first)
 * - Automatically handles authentication via HttpClient
 * - Returns empty array if user has no notifications
 *
 * Notification types may include:
 * - Trade execution confirmations
 * - Price alert triggers
 * - Portfolio performance updates
 * - Account status changes
 * - System announcements
 *
 * @example
 * ```typescript
 * // Get all notifications for a user
 * const notifications = await getUserNotifications(123);
 *
 * console.log(`User has ${notifications.length} notifications`);
 * const unreadCount = notifications.filter(n => !n.isRead).length;
 * console.log(`${unreadCount} unread notifications`);
 *
 * // Display recent notifications
 * notifications.slice(0, 5).forEach(notification => {
 *   console.log(`${notification.type}: ${notification.message}`);
 *   console.log(`Created: ${new Date(notification.createdAt).toLocaleString()}`);
 * });
 * ```
 *
 * @example
 * ```typescript
 * // React component with notifications
 * function NotificationsList({ userId }: { userId: number }) {
 *   const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
 *   const [loading, setLoading] = useState(true);
 *
 *   useEffect(() => {
 *     const loadNotifications = async () => {
 *       try {
 *         const data = await getUserNotifications(userId);
 *         setNotifications(data);
 *       } catch (error) {
 *         console.error('Failed to load notifications:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     loadNotifications();
 *   }, [userId]);
 *
 *   const unreadCount = notifications.filter(n => !n.isRead).length;
 *
 *   return (
 *     <div>
 *       <h2>Notifications ({unreadCount} unread)</h2>
 *       {notifications.map(notification => (
 *         <NotificationItem key={notification.id} notification={notification} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Filter and process notifications by type
 * try {
 *   const allNotifications = await getUserNotifications(456);
 *
 *   // Separate by type
 *   const tradeNotifications = allNotifications.filter(n => n.type === 'TRADE_EXECUTION');
 *   const priceAlerts = allNotifications.filter(n => n.type === 'PRICE_ALERT');
 *   const systemNotifications = allNotifications.filter(n => n.type === 'SYSTEM');
 *
 *   console.log('Trade confirmations:', tradeNotifications.length);
 *   console.log('Price alerts:', priceAlerts.length);
 *   console.log('System notifications:', systemNotifications.length);
 *
 *   // Mark all as read after processing
 *   const unreadIds = allNotifications
 *     .filter(n => !n.isRead)
 *     .map(n => n.id);
 *
 *   await Promise.all(
 *     unreadIds.map(id => markNotificationAsRead(id))
 *   );
 * } catch (error) {
 *   console.error('Notification processing failed:', error);
 * }
 * ```
 */
export async function getUserNotifications(
  userId: number
): Promise<NotificationResponse[]> {
  try {
    return await client.get<NotificationResponse[]>(
      `/api/notifications/user/${userId}`
    );
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}

/**
 * Marks a specific notification as read and updates its status.
 *
 * Updates the read status of a single notification, typically called when
 * a user views or interacts with a notification. This helps track which
 * notifications have been seen and reduces unread notification counts.
 *
 * @param notificationId - The unique identifier of the notification to mark as read
 * @returns Promise that resolves when the notification status is updated
 *
 * @throws {ApiError} When API request fails or notification is not found
 * @throws {Error} When network or authorization errors occur
 *
 * @remarks
 * This function:
 * - Updates a single notification's read status to true
 * - Is idempotent - safe to call multiple times on same notification
 * - Automatically handles authentication via HttpClient
 * - Provides immediate feedback for user interface updates
 * - Helps maintain accurate unread notification counts
 * - Supports real-time notification management
 *
 * The operation is permanent - once marked as read, notifications
 * typically remain in read status unless explicitly reset by admin operations.
 *
 * @example
 * ```typescript
 * // Mark a single notification as read
 * await markNotificationAsRead(789);
 * console.log('Notification marked as read');
 * ```
 *
 * @example
 * ```typescript
 * // Mark notification as read when user clicks on it
 * function NotificationItem({ notification }: { notification: NotificationResponse }) {
 *   const [isRead, setIsRead] = useState(notification.isRead);
 *
 *   const handleClick = async () => {
 *     if (!isRead) {
 *       try {
 *         await markNotificationAsRead(notification.id);
 *         setIsRead(true);
 *       } catch (error) {
 *         console.error('Failed to mark notification as read:', error);
 *       }
 *     }
 *   };
 *
 *   return (
 *     <div
 *       onClick={handleClick}
 *       className={`notification ${isRead ? 'read' : 'unread'}`}
 *     >
 *       <h3>{notification.title}</h3>
 *       <p>{notification.message}</p>
 *       {!isRead && <span className="unread-indicator">●</span>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Bulk mark notifications as read
 * async function markAllAsRead(notifications: NotificationResponse[]) {
 *   const unreadNotifications = notifications.filter(n => !n.isRead);
 *
 *   try {
 *     await Promise.all(
 *       unreadNotifications.map(notification =>
 *         markNotificationAsRead(notification.id)
 *       )
 *     );
 *
 *     console.log(`Marked ${unreadNotifications.length} notifications as read`);
 *   } catch (error) {
 *     console.error('Failed to mark some notifications as read:', error);
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Auto-mark as read with error handling
 * function useAutoMarkAsRead(notificationId: number, delay = 3000) {
 *   useEffect(() => {
 *     const timer = setTimeout(async () => {
 *       try {
 *         await markNotificationAsRead(notificationId);
 *         console.log('Auto-marked notification as read');
 *       } catch (error) {
 *         console.warn('Auto-mark failed:', error);
 *       }
 *     }, delay);
 *
 *     return () => clearTimeout(timer);
 *   }, [notificationId, delay]);
 * }
 * ```
 */
export async function markNotificationAsRead(
  notificationId: number
): Promise<void> {
  try {
    return await client.post<void>(`/api/notifications/${notificationId}/read`);
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}
