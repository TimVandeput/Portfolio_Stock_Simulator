/**
 * @fileoverview User Notification System Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * Notification response structure from the notification API.
 *
 * Represents a complete notification object as returned by the server,
 * including metadata, content, and read status. Used for displaying
 * notifications in the UI and managing notification state.
 *
 * @interface NotificationResponse
 * @property {number} id - Unique identifier for the notification
 * @property {string} [senderName] - Display name of the notification sender
 * @property {number} receiverUserId - ID of the user receiving the notification
 * @property {string} subject - Notification subject/title
 * @property {string} body - Full notification content/message
 * @property {string} preview - Shortened preview of the notification content
 * @property {string} createdAt - ISO timestamp when notification was created
 * @property {boolean} read - Whether the notification has been read by the user
 *
 * @example
 * ```typescript
 * // Display notification in UI
 * function NotificationCard({ notification }: { notification: NotificationResponse }) {
 *   return (
 *     <div className={`notification ${notification.read ? 'read' : 'unread'}`}>
 *       <div className="notification-header">
 *         <h3>{notification.subject}</h3>
 *         <span className="timestamp">{formatDate(notification.createdAt)}</span>
 *       </div>
 *       {notification.senderName && (
 *         <p className="sender">From: {notification.senderName}</p>
 *       )}
 *       <p className="preview">{notification.preview}</p>
 *       {!notification.read && (
 *         <button onClick={() => markAsRead(notification.id)}>
 *           Mark as Read
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export interface NotificationResponse {
  id: number;
  senderName?: string;
  receiverUserId: number;
  subject: string;
  body: string;
  preview: string;
  createdAt: string;
  read: boolean;
}

/**
 * Request structure for sending individual notifications.
 *
 * Used to send notifications to specific users, containing the sender
 * information and notification content. Supports both system notifications
 * (senderUserId: null) and user-to-user notifications.
 *
 * @interface SendNotificationRequest
 * @property {number | null} senderUserId - ID of sending user, null for system notifications
 * @property {string} subject - Notification subject/title
 * @property {string} body - Complete notification message content
 *
 * @example
 * ```typescript
 * // Send system notification
 * const systemNotification: SendNotificationRequest = {
 *   senderUserId: null,
 *   subject: "System Maintenance",
 *   body: "The system will be under maintenance from 2:00 AM to 4:00 AM UTC."
 * };
 *
 * // Send user notification
 * const userNotification: SendNotificationRequest = {
 *   senderUserId: 123,
 *   subject: "Trade Executed",
 *   body: "Your buy order for 100 shares of AAPL has been executed at $150.25 per share."
 * };
 * ```
 */
export interface SendNotificationRequest {
  senderUserId: number | null;
  subject: string;
  body: string;
}

/**
 * Request structure for sending role-based broadcast notifications.
 *
 * Used to send notifications to all users with a specific role,
 * enabling targeted communication to user groups (e.g., all admins
 * or all regular users). Supports bulk notification delivery.
 *
 * @interface SendRoleNotificationRequest
 * @property {number | null} senderUserId - ID of sending user, null for system notifications
 * @property {string} role - Target role for notification recipients (e.g., "ROLE_ADMIN")
 * @property {string} subject - Notification subject/title
 * @property {string} body - Complete notification message content
 *
 * @example
 * ```typescript
 * // Notify all administrators
 * const adminNotification: SendRoleNotificationRequest = {
 *   senderUserId: null,
 *   role: "ROLE_ADMIN",
 *   subject: "Security Alert",
 *   body: "Multiple failed login attempts detected. Please review security logs."
 * };
 *
 * // Notify all users
 * const userNotification: SendRoleNotificationRequest = {
 *   senderUserId: null,
 *   role: "ROLE_USER",
 *   subject: "New Feature Available",
 *   body: "We've added advanced charting tools to your portfolio dashboard!"
 * };
 * ```
 */
export interface SendRoleNotificationRequest {
  senderUserId: number | null;
  role: string;
  subject: string;
  body: string;
}
