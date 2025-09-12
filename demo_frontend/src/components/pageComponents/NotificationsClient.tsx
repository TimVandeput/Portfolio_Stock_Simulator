"use client";

export default function NotificationsClient() {
  return (
    <div className="notifications-container page-container w-full flex items-center justify-center font-sans px-6 py-6">
      <div className="notifications-card page-card p-8 rounded-2xl max-w-xl">
        <h1 className="notifications-title page-title text-3xl font-bold text-center mb-6">
          NOTIFICATIONS
        </h1>
        <p className="notifications-text page-text leading-relaxed mb-4 text-justify">
          Your notifications and alerts will be displayed here.
        </p>
      </div>
    </div>
  );
}
