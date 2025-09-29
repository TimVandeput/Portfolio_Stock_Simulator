"use client";

import { useEffect } from "react";
import type { BaseComponentProps } from "@/types/components";

export interface ConfirmationModalProps extends BaseComponentProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  buttonType?: "danger" | "primary";
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmDisabled = false,
  cancelDisabled = false,
  buttonType = "danger",
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
    <div className="w-full h-full flex flex-col items-center justify-center py-16 px-4">
      <div className="modal-base rounded-2xl p-8 max-w-sm w-full mx-auto shadow-lg">
        <h2 className="modal-title text-xl font-bold mb-4">{title}</h2>
        <p className="modal-text mb-6 leading-relaxed whitespace-pre-line">
          {message}
        </p>
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
            className={`neu-button neumorphic-button ${
              buttonType === "danger" ? "btn-danger" : "btn-primary"
            } px-8 py-3 rounded-xl font-medium transition-all duration-150 ${
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
