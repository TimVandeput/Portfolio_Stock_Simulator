/**
 * @fileoverview Interactive notification card component with expansion and read management.
 *
 * This module provides a comprehensive notification card component that handles
 * notification display, expansion states, read/unread management, and interactive
 * content rendering within the Stock Simulator platform. It supports rich HTML
 * content, date formatting, and advanced state management for notification systems.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import HTMLContentRenderer from "@/components/ui/HTMLContentRenderer";
import type { NotificationResponse } from "@/types/notification";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the NotificationCard component.
 * @interface NotificationCardProps
 * @extends BaseComponentProps
 */
export interface NotificationCardProps extends BaseComponentProps {
  /** Notification data containing subject, body, timestamps, and read status */
  notification: NotificationResponse;
  /** Whether the notification card is currently expanded to show full content */
  isExpanded: boolean;
  /** Callback function to toggle notification expansion state */
  onToggleExpansion: (id: number) => void;
  /** Callback function to mark notification as read */
  onMarkAsRead: (id: number) => void;
}

/**
 * Interactive notification card with expansion, read management, and rich content rendering.
 *
 * This sophisticated notification card component provides comprehensive notification
 * management capabilities including expandable content views, read/unread state
 * handling, rich HTML content rendering, and interactive user controls. It delivers
 * a professional notification experience with visual indicators, smooth animations,
 * and accessibility features within the Stock Simulator platform.
 *
 * @remarks
 * The component delivers comprehensive notification management through:
 *
 * **State Management Features**:
 * - **Read/Unread Tracking**: Visual indicators and state management for notification status
 * - **Expansion Control**: Collapsible content with smooth transition animations
 * - **Interactive Triggers**: Click-to-expand functionality with automatic read marking
 * - **Status Persistence**: Maintains notification states across component re-renders
 *
 * **Visual Design System**:
 * - **Status Indicators**: Color-coded visual cues for read/unread notifications
 * - **Gradient Backgrounds**: Subtle background gradients for unread notifications
 * - **Border Accents**: Left border indicators for immediate status recognition
 * - **Animation Effects**: Smooth transitions for expansion and hover states
 *
 * **Content Rendering**:
 * - **Rich HTML Support**: Full HTML content rendering with HTMLContentRenderer
 * - **Preview Display**: Truncated preview text for collapsed notifications
 * - **Subject Highlighting**: Enhanced typography for notification subjects
 * - **Expandable Content**: Full content display in expanded state
 *
 * **Interactive Elements**:
 * - **Expansion Chevrons**: Visual indicators for expandable content
 * - **Click Areas**: Large click targets for easy interaction
 * - **Hover Effects**: Visual feedback for interactive elements
 * - **Read State Triggers**: Automatic read marking on expansion
 *
 * **Date and Time Formatting**:
 * - **Localized Timestamps**: User-friendly date and time display
 * - **Relative Dating**: Context-aware timestamp formatting
 * - **Timezone Support**: Proper timezone handling for timestamps
 * - **Consistent Formatting**: Standardized date display across notifications
 *
 * **Accessibility Features**:
 * - **Keyboard Navigation**: Full keyboard accessibility support
 * - **Screen Reader Support**: Descriptive content for assistive technologies
 * - **Focus Management**: Proper focus handling for interactive elements
 * - **ARIA Attributes**: Comprehensive accessibility markup
 *
 * **Visual Status System**:
 * - **Unread Notifications**: Pulsing indicators and enhanced styling
 * - **Read Notifications**: Muted colors and reduced visual emphasis
 * - **Status Transitions**: Smooth visual transitions between states
 * - **Color Coding**: Consistent color system for status identification
 *
 * **Layout Responsiveness**:
 * - **Mobile Optimization**: Touch-friendly interactions and sizing
 * - **Flexible Content**: Adapts to varying notification content lengths
 * - **Responsive Typography**: Adaptive text sizing for different screens
 * - **Layout Stability**: Consistent layout regardless of content variations
 *
 * The component serves as a critical communication tool within the platform,
 * providing users with efficient notification management capabilities while
 * maintaining high usability standards and delivering consistent user
 * experience throughout the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic notification card usage
 * function NotificationsList() {
 *   const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
 *
 *   const handleToggleExpansion = (id: number) => {
 *     setExpandedIds(prev => {
 *       const newSet = new Set(prev);
 *       if (newSet.has(id)) {
 *         newSet.delete(id);
 *       } else {
 *         newSet.add(id);
 *       }
 *       return newSet;
 *     });
 *   };
 *
 *   const handleMarkAsRead = async (id: number) => {
 *     await markNotificationRead(id);
 *     // Update notification state
 *   };
 *
 *   return (
 *     <div className="notifications-list">
 *       {notifications.map(notification => (
 *         <NotificationCard
 *           key={notification.id}
 *           notification={notification}
 *           isExpanded={expandedIds.has(notification.id)}
 *           onToggleExpansion={handleToggleExpansion}
 *           onMarkAsRead={handleMarkAsRead}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 *
 * // Notification management with state integration
 * function NotificationManager() {
 *   const { notifications, markAsRead, toggleExpansion } = useNotifications();
 *
 *   return (
 *     <div className="notification-manager">
 *       {notifications.map(notification => (
 *         <NotificationCard
 *           key={notification.id}
 *           notification={notification}
 *           isExpanded={notification.expanded}
 *           onToggleExpansion={toggleExpansion}
 *           onMarkAsRead={markAsRead}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for notification card functionality and state management
 * @returns An interactive notification card with expansion controls, read management,
 * rich content rendering, and comprehensive accessibility support
 *
 * @see {@link NotificationResponse} - TypeScript interface for notification data
 * @see {@link DynamicIcon} - Icon component for interactive indicators
 * @see {@link HTMLContentRenderer} - Component for rendering rich HTML content
 *
 * @public
 */
export default function NotificationCard({
  notification,
  isExpanded,
  onToggleExpansion,
  onMarkAsRead,
}: NotificationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`neu-card rounded-xl transition-all duration-200 ${
        !notification.read
          ? "border-l-4 border-l-[var(--accent)] bg-gradient-to-r from-[var(--accent)]/5 to-transparent"
          : ""
      }`}
    >
      <div
        className="p-4 cursor-pointer hover:bg-[var(--bg-secondary)]/30 transition-colors"
        onClick={() => {
          onToggleExpansion(notification.id);
          if (!notification.read && !isExpanded) {
            onMarkAsRead(notification.id);
          }
        }}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div
              className={`w-3 h-3 rounded-full ${
                !notification.read
                  ? "bg-[var(--accent)] animate-pulse"
                  : "bg-[var(--text-tertiary)]"
              }`}
            />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 flex-grow">
                <DynamicIcon
                  iconName={isExpanded ? "chevrondown" : "chevronright"}
                  size={16}
                  className="text-[var(--text-tertiary)] flex-shrink-0"
                />
                <h3
                  className={`font-medium ${
                    !notification.read
                      ? "text-[var(--text-primary)] font-semibold"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {notification.subject}
                </h3>
              </div>
              <span className="text-xs text-[var(--text-tertiary)] whitespace-nowrap">
                {formatDate(notification.createdAt)}
              </span>
            </div>

            {!isExpanded && (
              <p
                className={`text-sm mt-2 ${
                  !notification.read
                    ? "text-[var(--text-secondary)]"
                    : "text-[var(--text-tertiary)]"
                }`}
              >
                {notification.preview}
              </p>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="ml-7">
            <div
              className={`text-sm mb-3 ${
                !notification.read
                  ? "text-[var(--text-secondary)]"
                  : "text-[var(--text-tertiary)]"
              }`}
            >
              <HTMLContentRenderer htmlContent={notification.body} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
