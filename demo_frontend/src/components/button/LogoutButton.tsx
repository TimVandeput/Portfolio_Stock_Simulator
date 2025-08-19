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
        className={`logout-button p-3 rounded-xl font-bold transition-all duration-150 
          active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]
          active:brightness-95
          active:translate-y-0.5
          active:duration-75
          disabled:opacity-50 disabled:cursor-not-allowed
          bg-[#e0e5ec] shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa] hover:bg-red-50`}
        title={isLoggingOut ? "Logging out..." : "Logout"}
      >
        <LogOut size={20} className="logout-icon text-red-400" />
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
