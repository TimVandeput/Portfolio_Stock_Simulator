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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />

      <div className="confirmation-modal relative rounded-2xl p-8 max-w-md mx-4">
        <h2 className="confirmation-modal-title text-xl font-bold mb-4">
          {title}
        </h2>

        <p className="confirmation-modal-message mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={cancelDisabled ? undefined : onCancel}
            disabled={cancelDisabled}
            className={`confirmation-modal-cancel px-8 py-3 rounded-xl font-medium transition-all duration-150
              ${cancelDisabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-[4px_4px_8px_#c2c8d0,-3px_-3px_8px_#e6f0fa] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] active:brightness-95 active:translate-y-0.5 active:duration-75'
              }`}
          >
            {cancelText}
          </button>

          <button
            onClick={confirmDisabled ? undefined : onConfirm}
            disabled={confirmDisabled}
            className={`confirmation-modal-confirm px-8 py-3 rounded-xl font-medium transition-all duration-150
              ${confirmDisabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-[4px_4px_8px_#c2c8d0,-3px_-3px_8px_#e6f0fa] active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(255,255,255,0.7)] active:brightness-95 active:translate-y-0.5 active:duration-75'
              }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
