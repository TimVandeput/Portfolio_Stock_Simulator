"use client";

import { useEffect } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonClass?: string;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmButtonClass = "bg-red-500 hover:bg-red-600 text-white",
  confirmDisabled = false,
  cancelDisabled = false,
}: ConfirmationModalProps) {
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
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center py-16">
      <div className="modal-base rounded-2xl p-8 max-w-md w-full mx-4 shadow-lg">
        <h2 className="modal-title text-xl font-bold mb-4">{title}</h2>
        <p className="modal-text mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={cancelDisabled ? undefined : onCancel}
            disabled={cancelDisabled}
            className={`neu-button px-8 py-3 rounded-xl font-medium ${
              cancelDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={confirmDisabled ? undefined : onConfirm}
            disabled={confirmDisabled}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-150 bg-red-500 hover:bg-red-600 text-white ${
              confirmDisabled
                ? "opacity-50 cursor-not-allowed"
                : "active:translate-y-0.5 active:duration-75"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
