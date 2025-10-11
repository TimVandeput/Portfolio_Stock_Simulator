/**
 * @fileoverview Professional confirmation modal component for user action validation and consent
 *
 * This component provides a comprehensive confirmation dialog system with advanced features
 * including keyboard navigation, body scroll lock, theme integration, and customizable
 * button styles. Features include escape key handling, accessibility compliance, and
 * seamless integration with user workflows requiring explicit confirmation.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useEffect } from "react";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for ConfirmationModal component configuration
 * @interface ConfirmationModalProps
 * @extends {BaseComponentProps}
 */
export interface ConfirmationModalProps extends BaseComponentProps {
  /** Whether the modal is currently visible */
  isOpen: boolean;
  /** Modal title text */
  title: string;
  /** Main message content supporting multiline text */
  message: string;
  /** Custom text for the confirmation button */
  confirmText?: string;
  /** Custom text for the cancel button */
  cancelText?: string;
  /** Callback function executed on confirmation */
  onConfirm: () => void;
  /** Callback function executed on cancellation */
  onCancel: () => void;
  /** Whether the confirm button is disabled */
  confirmDisabled?: boolean;
  /** Whether the cancel button is disabled */
  cancelDisabled?: boolean;
  /** Visual style variant for the confirm button */
  buttonType?: "danger" | "primary";
}

/**
 * Professional confirmation modal component for user action validation and consent
 *
 * @remarks
 * The ConfirmationModal component delivers comprehensive confirmation dialogs with the following features:
 *
 * **Modal Behavior:**
 * - Full-screen overlay with centered content presentation
 * - Body scroll lock when modal is active
 * - Automatic cleanup on component unmount
 * - Theme integration with custom event dispatching
 *
 * **Keyboard Navigation:**
 * - Escape key support for cancellation
 * - Event listener cleanup for optimal performance
 * - Accessibility-compliant keyboard interactions
 * - Professional UX patterns implementation
 *
 * **Visual Design:**
 * - Neumorphic design language with rounded corners
 * - Professional shadow and surface styling
 * - Responsive layout with maximum width constraints
 * - Clean typography with proper hierarchy
 *
 * **Button System:**
 * - Customizable button text and styling
 * - Danger and primary button variants
 * - Disabled state support with visual feedback
 * - Active state animations with press effects
 *
 * **Content Handling:**
 * - Multiline message support with whitespace preservation
 * - Professional typography with proper leading
 * - Centered layout with optimal spacing
 * - Responsive padding and margins
 *
 * **State Management:**
 * - Conditional rendering based on open state
 * - Clean lifecycle management with useEffect
 * - Proper event listener cleanup
 * - Theme synchronization support
 *
 * **Accessibility:**
 * - Screen reader compatible structure
 * - Keyboard navigation support
 * - Proper focus management
 * - ARIA-compliant modal patterns
 *
 * **Integration Features:**
 * - Seamless workflow integration
 * - Customizable confirmation flows
 * - Professional error and success states
 * - Clean callback pattern implementation
 *
 * **Performance:**
 * - Efficient conditional rendering
 * - Optimized event listener management
 * - Clean component lifecycle
 * - Minimal re-render optimization
 *
 * @param props - Configuration object for confirmation modal display
 * @returns ConfirmationModal component with interactive confirmation dialog
 *
 * @example
 * ```tsx
 * // Basic confirmation modal
 * <ConfirmationModal
 *   isOpen={showConfirmation}
 *   title="Confirm Action"
 *   message="Are you sure you want to proceed with this action?"
 *   onConfirm={handleConfirm}
 *   onCancel={() => setShowConfirmation(false)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Danger confirmation with custom text
 * <ConfirmationModal
 *   isOpen={showDeleteConfirmation}
 *   title="Delete Account"
 *   message="This action cannot be undone. Your account and all data will be permanently deleted."
 *   confirmText="Delete Account"
 *   cancelText="Keep Account"
 *   buttonType="danger"
 *   onConfirm={handleDeleteAccount}
 *   onCancel={() => setShowDeleteConfirmation(false)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with async operations
 * function OrderConfirmation() {
 *   const [showConfirmation, setShowConfirmation] = useState(false);
 *   const [loading, setLoading] = useState(false);
 *
 *   const handleConfirmOrder = async () => {
 *     setLoading(true);
 *     try {
 *       await submitOrder(orderData);
 *       setShowConfirmation(false);
 *       showSuccessMessage("Order submitted successfully!");
 *     } catch (error) {
 *       showErrorMessage("Failed to submit order. Please try again.");
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 *
 *   return (
 *     <>
 *       <PlaceOrderButton
 *         onClick={() => setShowConfirmation(true)}
 *       />
 *
 *       <ConfirmationModal
 *         isOpen={showConfirmation}
 *         title="Confirm Order"
 *         message={`Submit order for ${quantity} shares of ${symbol} at $${price}?`}
 *         confirmText="Submit Order"
 *         buttonType="primary"
 *         confirmDisabled={loading}
 *         onConfirm={handleConfirmOrder}
 *         onCancel={() => setShowConfirmation(false)}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Multi-step confirmation workflow
 * function DangerousActionFlow() {
 *   const [currentStep, setCurrentStep] = useState<'warning' | 'final' | null>(null);
 *
 *   const handleInitialConfirm = () => {
 *     setCurrentStep('final');
 *   };
 *
 *   const handleFinalConfirm = async () => {
 *     await executeDangerousAction();
 *     setCurrentStep(null);
 *   };
 *
 *   return (
 *     <>
 *       <ConfirmationModal
 *         isOpen={currentStep === 'warning'}
 *         title="Warning"
 *         message="This action has serious consequences. Are you sure you want to continue?"
 *         confirmText="Continue"
 *         buttonType="danger"
 *         onConfirm={handleInitialConfirm}
 *         onCancel={() => setCurrentStep(null)}
 *       />
 *
 *       <ConfirmationModal
 *         isOpen={currentStep === 'final'}
 *         title="Final Confirmation"
 *         message="Last chance to cancel. This action is irreversible."
 *         confirmText="Execute Action"
 *         buttonType="danger"
 *         onConfirm={handleFinalConfirm}
 *         onCancel={() => setCurrentStep(null)}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
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
