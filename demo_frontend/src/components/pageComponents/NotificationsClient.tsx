"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "@/lib/api/notifications";
import { getUserId } from "@/lib/auth/tokenStorage";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import StatusMessage from "@/components/status/StatusMessage";
import DynamicIcon from "@/components/ui/DynamicIcon";
import type { NotificationResponse } from "@/types/notification";

export default function NotificationsClient() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedNotifications, setExpandedNotifications] = useState<
    Set<number>
  >(new Set());

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
      // Update local state to mark as read
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
    setExpandedNotifications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderHTMLContent = (htmlContent: string) => {
    const processedContent = htmlContent
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<strong>(.*?)<\/strong>/gi, (match, text) => {
        return `STRONG_PLACEHOLDER_${text}_ENDSTRONG`;
      })
      .replace(
        /<a\s+href=['"]([^'"]*?)['"][^>]*>(.*?)<\/a>/gi,
        (match, href, text) => {
          return `LINK_PLACEHOLDER_${href}_TEXT_${text}_ENDLINK`;
        }
      );

    const lines = processedContent.split("\n");

    return lines.map((line, lineIndex) => {
      const linkPattern = /LINK_PLACEHOLDER_([^_]+)_TEXT_([^_]+)_ENDLINK/g;
      const strongPattern = /STRONG_PLACEHOLDER_([^_]+)_ENDSTRONG/g;

      const hasLinks = linkPattern.test(line);
      const hasStrong = strongPattern.test(line);
      linkPattern.lastIndex = 0;
      strongPattern.lastIndex = 0;

      if (hasLinks || hasStrong) {
        const parts = [];
        let currentLine = line;
        let offset = 0;

        const placeholders: Array<{
          type: "link" | "strong";
          start: number;
          end: number;
          href?: string;
          text: string;
          fullMatch: string;
        }> = [];

        let linkMatch;
        while ((linkMatch = linkPattern.exec(line)) !== null) {
          placeholders.push({
            type: "link",
            start: linkMatch.index,
            end: linkMatch.index + linkMatch[0].length,
            href: linkMatch[1],
            text: linkMatch[2],
            fullMatch: linkMatch[0],
          });
        }

        let strongMatch;
        while ((strongMatch = strongPattern.exec(line)) !== null) {
          placeholders.push({
            type: "strong",
            start: strongMatch.index,
            end: strongMatch.index + strongMatch[0].length,
            text: strongMatch[1],
            fullMatch: strongMatch[0],
          });
        }

        placeholders.sort((a, b) => a.start - b.start);

        let lastIndex = 0;
        placeholders.forEach((placeholder, index) => {
          if (placeholder.start > lastIndex) {
            parts.push(line.substring(lastIndex, placeholder.start));
          }

          if (placeholder.type === "link" && placeholder.href) {
            parts.push(
              <button
                key={`${lineIndex}-link-${index}`}
                onClick={() => router.push(placeholder.href!)}
                className="inline-block text-blue-600 hover:text-blue-800 underline font-bold cursor-pointer transition-all duration-200 bg-blue-100 hover:bg-blue-200 px-2 py-1 mx-1 rounded-md border border-blue-300 hover:border-blue-400"
              >
                {placeholder.text}
              </button>
            );
          } else if (placeholder.type === "strong") {
            parts.push(
              <strong
                key={`${lineIndex}-strong-${index}`}
                className="font-bold text-[var(--text-primary)]"
              >
                {placeholder.text}
              </strong>
            );
          }

          lastIndex = placeholder.end;
        });

        if (lastIndex < line.length) {
          parts.push(line.substring(lastIndex));
        }

        return (
          <div key={lineIndex} className="mb-1">
            {parts}
          </div>
        );
      } else {
        return line.trim() ? (
          <div key={lineIndex} className="mb-1">
            {line}
          </div>
        ) : (
          <div key={lineIndex} className="mb-2" /> // Empty line spacing
        );
      }
    });
  };

  return (
    <div className="notifications-container p-6 max-w-6xl mx-auto">
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
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <div className="animate-spin">
              <DynamicIcon iconName="loader" size={20} />
            </div>
            Loading notifications...
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <div className="neu-card p-8 rounded-2xl max-w-md mx-auto">
            <DynamicIcon
              iconName="bell"
              size={48}
              className="mx-auto mb-4 text-[var(--text-secondary)]"
            />
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              No notifications yet
            </h3>
            <p className="text-[var(--text-secondary)]">
              You'll see important updates and alerts here when they arrive.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const isExpanded = expandedNotifications.has(notification.id);
            return (
              <div
                key={notification.id}
                className={`neu-card rounded-xl transition-all duration-200 ${
                  !notification.read
                    ? "border-l-4 border-l-[var(--accent)] bg-gradient-to-r from-[var(--accent)]/5 to-transparent"
                    : ""
                }`}
              >
                <div
                  className="p-4 cursor-pointer hover:bg-[var(--bg-secondary)]/30 transition-colors"
                  onClick={() => {
                    toggleNotificationExpansion(notification.id);
                    if (!notification.read && !isExpanded) {
                      handleMarkAsRead(notification.id);
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
                            iconName={
                              isExpanded ? "chevrondown" : "chevronright"
                            }
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
                      {" "}
                      <div
                        className={`text-sm mb-3 ${
                          !notification.read
                            ? "text-[var(--text-secondary)]"
                            : "text-[var(--text-tertiary)]"
                        }`}
                      >
                        {renderHTMLContent(notification.body)}
                      </div>
                      {!notification.read && (
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="flex items-center gap-1 text-xs text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                          >
                            <DynamicIcon iconName="check" size={12} />
                            Mark as read
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
