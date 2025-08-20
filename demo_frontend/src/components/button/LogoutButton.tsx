"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/api/auth";
import ConfirmationModal from "../ui/ConfirmationModal";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();

  const handleLogoutClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      router.push("/login");
    }
  };

  const handleCancelLogout = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <button
        onClick={handleLogoutClick}
        disabled={isLoggingOut}
        className="neu-button p-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50"
        title={isLoggingOut ? "Logging out..." : "Logout"}
      >
        <LogOut size={20} style={{ color: "var(--logout-icon)" }} />
      </button>

      <ConfirmationModal
        isOpen={showConfirmation}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your account."
        confirmText={isLoggingOut ? "Logging out..." : "Yes, Logout"}
        cancelText="Cancel"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
        confirmDisabled={isLoggingOut}
        cancelDisabled={isLoggingOut}
      />
    </>
  );
}
