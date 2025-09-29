"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { logout } from "@/lib/api/auth";
import type { BaseComponentProps } from "@/types/components";

interface LogoutButtonProps extends BaseComponentProps {
  onShowConfirmation?: (
    show: boolean,
    isLoggingOut: boolean,
    onConfirm: () => void,
    onCancel: () => void
  ) => void;
  onUpdateConfirmationLoading?: (loading: boolean) => void;
}

export default function LogoutButton({
  onShowConfirmation,
  onUpdateConfirmationLoading,
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    router.prefetch("/");

    const handleConfirm = async () => {
      setIsLoggingOut(true);
      onUpdateConfirmationLoading?.(true);

      try {
        await logout();
        onShowConfirmation?.(false, true, handleConfirm, handleCancel);
        router.replace("/");
      } catch {
        setIsLoggingOut(false);
        onUpdateConfirmationLoading?.(false);
        onShowConfirmation?.(false, false, handleConfirm, handleCancel);
      }
    };

    const handleCancel = () => {
      onShowConfirmation?.(false, false, handleConfirm, handleCancel);
    };

    onShowConfirmation?.(true, false, handleConfirm, handleCancel);
  };

  return (
    <button
      onClick={handleLogoutClick}
      disabled={isLoggingOut}
      className="neu-button p-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 transition-none"
      title={isLoggingOut ? "Logging out..." : "Logout"}
    >
      <DynamicIcon
        iconName="logout"
        size={20}
        style={{ color: "var(--logout-icon)" }}
      />
    </button>
  );
}
