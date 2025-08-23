"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface NoAccessModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  closeText?: string;
  onClose: () => void;
  accessType?: "login" | "role" | "general";
}

export default function NoAccessModal({
  isOpen,
  title,
  message,
  closeText,
  onClose,
  accessType = "general",
}: NoAccessModalProps) {
  const router = useRouter();

  const defaultTitle =
    accessType === "login"
      ? "Login Required"
      : accessType === "role"
      ? "Insufficient Permissions"
      : "Access Denied";

  const modalTitle = title || defaultTitle;

  const defaultCloseText = accessType === "login" ? "Go to Login" : "OK";

  const buttonText = closeText || defaultCloseText;

  const handleButtonClick = () => {
    if (accessType === "login") {
      router.push("/");
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        const event = new CustomEvent("themeChanged");
        window.dispatchEvent(event);
      }, 10);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-16 px-4">
      <div className="modal-base rounded-2xl p-8 max-w-sm w-full mx-auto shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle size={24} style={{ color: "var(--logout-icon)" }} />
          <h2 className="modal-title text-xl font-bold">{modalTitle}</h2>
        </div>

        <p className="modal-text mb-6 leading-relaxed">{message}</p>

        <div className="flex justify-center">
          <button
            onClick={handleButtonClick}
            className="neu-button neumorphic-button px-8 py-3 rounded-xl font-medium transition-all duration-150 active:translate-y-0.5 active:duration-75"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
