"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { NoAccessModalProps } from "@/types";

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

  const defaultCloseText =
    accessType === "login"
      ? "Go to Login"
      : accessType === "role"
      ? "Go to Home"
      : "OK";

  const buttonText = closeText || defaultCloseText;

  const handleButtonClick = () => {
    if (accessType === "login") {
      router.push("/");
    } else if (accessType === "role") {
      router.push("/home");
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const modalElement = document.querySelector('[role="dialog"]');
      if (modalElement) {
        (modalElement as HTMLElement).focus();
      }

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
    <div
      className="w-full h-full flex flex-col items-center justify-center py-16 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      tabIndex={-1}
    >
      <div className="modal-base rounded-2xl p-8 max-w-sm w-full mx-auto shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle size={24} className="icon-danger" aria-hidden="true" />
          <h2 id="modal-title" className="modal-title text-xl font-bold">
            {modalTitle}
          </h2>
        </div>

        <p id="modal-description" className="modal-text mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleButtonClick}
            className="neu-button neumorphic-button px-8 py-3 rounded-xl font-medium transition-all duration-150 active:translate-y-0.5 active:duration-75"
            autoFocus
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
