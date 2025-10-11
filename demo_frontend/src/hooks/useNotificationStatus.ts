/**
 * @fileoverview Notification status tracking hook for user notifications management.
 *
 * This hook provides real-time notification status tracking including unread counts,
 * loading states, and automatic updates for user notification systems.
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import { useState, useEffect } from "react";
import { getUserNotifications } from "@/lib/api/notifications";
import { getUserId } from "@/lib/auth/tokenStorage";
import { NotificationResponse } from "@/types/notification";

export interface NotificationStatus {
  total: number;
  unread: number;
  isLoading: boolean;
  error: string | null;
  statusText: string;
}

export function useNotificationStatus(): NotificationStatus {
  const [notifications, setNotifications] = useState<NotificationResponse[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userId = getUserId();
        if (!userId) {
          setError("No user ID found");
          return;
        }

        const userNotifications = await getUserNotifications(userId);
        setNotifications(userNotifications || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Failed to load notifications");
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const total = notifications.length;
  const unread = notifications.filter((n) => !n.read).length;

  const statusText = (() => {
    if (isLoading) return "Loading notifications...";
    if (error) return "Notifications unavailable";
    if (unread === 0) return "No new notifications";
    if (unread === 1) return "1 new notification";
    return `${unread} new notifications`;
  })();

  return {
    total,
    unread,
    isLoading,
    error,
    statusText,
  };
}
