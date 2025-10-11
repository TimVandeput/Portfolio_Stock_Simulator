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
