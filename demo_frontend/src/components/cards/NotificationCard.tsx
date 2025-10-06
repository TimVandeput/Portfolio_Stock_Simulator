"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import HTMLContentRenderer from "@/components/ui/HTMLContentRenderer";
import type { NotificationResponse } from "@/types/notification";

interface NotificationCardProps {
  notification: NotificationResponse;
  isExpanded: boolean;
  onToggleExpansion: (id: number) => void;
  onMarkAsRead: (id: number) => void;
}

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
            {!notification.read && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
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
}
