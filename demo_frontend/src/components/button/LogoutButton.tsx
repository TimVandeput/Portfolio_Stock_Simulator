"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton({
  onLogoutClick,
  isLoggingOut,
}: {
  onLogoutClick: () => void;
  isLoggingOut: boolean;
}) {
  return (
    <button
      onClick={onLogoutClick}
      disabled={isLoggingOut}
      className="neu-button p-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 transition-none"
      title={isLoggingOut ? "Logging out..." : "Logout"}
    >
      <LogOut size={20} style={{ color: "var(--logout-icon)" }} />
    </button>
  );
}
