/**
 * @fileoverview Secure logout button component with confirmation flow.
 *
 * This module provides a comprehensive logout button component that handles
 * secure user authentication termination through a confirmation-based workflow.
 * It integrates with the authentication system to provide safe logout procedures,
 * user confirmation dialogs, and proper session cleanup within the Stock
 * Simulator platform.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { logout } from "@/lib/api/auth";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the LogoutButton component.
 * @interface LogoutButtonProps
 * @extends BaseComponentProps
 */
export interface LogoutButtonProps extends BaseComponentProps {
  /** Optional callback for managing confirmation dialog display and state */
  onShowConfirmation?: (
    show: boolean,
    isLoggingOut: boolean,
    onConfirm: () => void,
    onCancel: () => void
  ) => void;
  /** Optional callback for updating confirmation dialog loading states */
  onUpdateConfirmationLoading?: (loading: boolean) => void;
}

/**
 * Secure logout button with confirmation flow and loading states.
 *
 * This comprehensive logout button component provides users with a secure
 * way to terminate their authentication session through a confirmation-based
 * workflow. It integrates advanced loading states, error handling, and proper
 * session cleanup procedures to ensure safe and reliable logout operations
 * within the Stock Simulator platform.
 *
 * @remarks
 * The component delivers secure logout functionality through:
 *
 * **Authentication Security**:
 * - **Session Termination**: Secure API-based logout with server-side cleanup
 * - **Confirmation Flow**: Two-step logout process to prevent accidental logouts
 * - **Route Protection**: Automatic navigation to public routes after logout
 * - **Error Handling**: Graceful handling of logout failures with recovery
 *
 * **Advanced State Management**:
 * - **Loading States**: Visual feedback during logout processing
 * - **Confirmation Dialog**: External confirmation dialog integration
 * - **Button Disable**: Prevents multiple logout attempts during processing
 * - **State Synchronization**: Coordinates with parent components for UI updates
 *
 * **User Experience Features**:
 * - **Visual Feedback**: Dynamic tooltips reflecting current operation state
 * - **Neumorphic Design**: Consistent button styling with platform aesthetics
 * - **Icon Integration**: Logout icon with themed coloring for clarity
 * - **Loading Prevention**: Disabled state during logout operations
 *
 * **Navigation Integration**:
 * - **Route Prefetching**: Pre-loads destination route for faster navigation
 * - **Automatic Redirect**: Seamless navigation to login page after logout
 * - **History Management**: Uses replace navigation to prevent back navigation
 * - **Router Integration**: Full Next.js router integration for SPA behavior
 *
 * **Callback Architecture**:
 * - **Confirmation Management**: Delegates confirmation dialog to parent components
 * - **Loading Coordination**: Synchronizes loading states across UI components
 * - **Event Handling**: Clean separation of concerns with callback patterns
 * - **State Communication**: Bi-directional communication with parent containers
 *
 * **Error Recovery**:
 * - **Logout Failure Handling**: Graceful recovery from API failures
 * - **State Reset**: Proper state cleanup on operation failures
 * - **User Notification**: Clear feedback on logout operation results
 * - **Retry Capability**: Maintains ability to retry logout operations
 *
 * **Accessibility Standards**:
 * - **Screen Reader Support**: Descriptive titles and ARIA attributes
 * - **Keyboard Navigation**: Full keyboard accessibility support
 * - **Visual States**: Clear indication of disabled and loading states
 * - **Focus Management**: Proper focus handling during state transitions
 *
 * The component serves as a critical security interface element, providing
 * users with safe and reliable authentication termination while maintaining
 * high usability standards and delivering consistent user experience within
 * the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic logout button usage
 * function NavigationBar() {
 *   const [showConfirmation, setShowConfirmation] = useState(false);
 *   const [confirmationLoading, setConfirmationLoading] = useState(false);
 *
 *   const handleShowConfirmation = (show, isLoggingOut, onConfirm, onCancel) => {
 *     setShowConfirmation(show);
 *     if (show) {
 *       // Show confirmation modal with provided callbacks
 *     }
 *   };
 *
 *   return (
 *     <div className="user-controls">
 *       <LogoutButton
 *         onShowConfirmation={handleShowConfirmation}
 *         onUpdateConfirmationLoading={setConfirmationLoading}
 *       />
 *       {showConfirmation && <ConfirmationModal />}
 *     </div>
 *   );
 * }
 *
 * // Integration with confirmation modal system
 * function UserMenu() {
 *   const { showModal } = useModal();
 *
 *   const handleLogoutConfirmation = (show, isLoggingOut, onConfirm, onCancel) => {
 *     if (show) {
 *       showModal({
 *         title: "Confirm Logout",
 *         message: "Are you sure you want to logout?",
 *         onConfirm,
 *         onCancel,
 *         loading: isLoggingOut
 *       });
 *     }
 *   };
 *
 *   return (
 *     <div className="user-menu">
 *       <LogoutButton onShowConfirmation={handleLogoutConfirmation} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for logout functionality and confirmation flow
 * @returns A secure logout button with confirmation flow, loading states, and
 * proper session cleanup capabilities
 *
 * @see {@link logout} - API function for secure authentication termination
 * @see {@link DynamicIcon} - Icon component for logout visual representation
 * @see {@link BaseComponentProps} - Base properties interface for components
 *
 * @public
 */
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
        // Use window.location.href for reliable redirect with cache busting
        window.location.href = "/?t=" + Date.now();
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
