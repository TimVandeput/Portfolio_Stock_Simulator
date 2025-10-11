/**
 * @fileoverview Confirmation modal management hook for user action validation.
 *
 * This hook provides comprehensive modal management for confirmation dialogs,
 * particularly useful for destructive actions, important decisions, and operations
 * that require explicit user consent before proceeding.
 *
 * The hook provides:
 * - Modal visibility and state management
 * - Custom handler registration for confirm/cancel actions
 * - Loading state management during operations
 * - Clean API for showing/hiding modals with callbacks
 * - Automatic cleanup and state reset
 * - Integration with confirmation modal components
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import { useState, useCallback } from "react";

/**
 * Handler functions for confirmation modal actions.
 *
 * @interface ConfirmationHandlers
 */
interface ConfirmationHandlers {
  /** Function to execute when user confirms the action */
  onConfirm: () => void;
  /** Function to execute when user cancels the action */
  onCancel: () => void;
}

/**
 * Hook for managing confirmation modal state and user interactions.
 *
 * Provides a complete solution for implementing confirmation dialogs with
 * custom handlers, loading states, and clean state management.
 *
 * @returns Confirmation modal control object with state and functions
 *
 * @remarks
 * This hook manages the complete lifecycle of confirmation modals:
 * - Shows/hides modal with custom confirmation and cancellation handlers
 * - Manages loading states during async operations
 * - Provides clean state reset when modal is closed
 * - Supports dynamic handler registration per modal instance
 * - Handles edge cases and cleanup automatically
 *
 * The returned object includes:
 * - `showConfirmation`: Boolean indicating if modal should be visible
 * - `isLoading`: Boolean indicating if an operation is in progress
 * - `handlers`: Current confirmation and cancellation handlers
 * - `showModal`: Function to display modal with custom handlers
 * - `hideModal`: Function to close modal and reset state
 * - `updateLoading`: Function to update loading state during operations
 *
 * @example
 * ```tsx
 * function DeleteButton({ itemId, onDeleted }) {
 *   const {
 *     showConfirmation,
 *     isLoading,
 *     handlers,
 *     showModal,
 *     hideModal,
 *     updateLoading
 *   } = useConfirmationModal();
 *
 *   const handleDelete = () => {
 *     const onConfirm = async () => {
 *       updateLoading(true);
 *       try {
 *         await deleteItem(itemId);
 *         onDeleted();
 *         hideModal();
 *       } catch (error) {
 *         console.error('Delete failed:', error);
 *         updateLoading(false);
 *       }
 *     };
 *
 *     const onCancel = () => {
 *       hideModal();
 *     };
 *
 *     showModal(onConfirm, onCancel);
 *   };
 *
 *   return (
 *     <>
 *       <button onClick={handleDelete}>Delete Item</button>
 *       {showConfirmation && (
 *         <ConfirmationModal
 *           title="Delete Item"
 *           message="Are you sure you want to delete this item?"
 *           onConfirm={handlers?.onConfirm}
 *           onCancel={handlers?.onCancel}
 *           isLoading={isLoading}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Multiple confirmation types in one component
 * function AccountSettings() {
 *   const modal = useConfirmationModal();
 *
 *   const handleLogout = () => {
 *     modal.showModal(
 *       () => {
 *         logout();
 *         modal.hideModal();
 *       },
 *       () => modal.hideModal()
 *     );
 *   };
 *
 *   const handleDeleteAccount = () => {
 *     modal.showModal(
 *       async () => {
 *         modal.updateLoading(true);
 *         await deleteAccount();
 *         modal.hideModal();
 *         router.push('/');
 *       },
 *       () => modal.hideModal()
 *     );
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleLogout}>Logout</button>
 *       <button onClick={handleDeleteAccount}>Delete Account</button>
 *
 *       <ConfirmationModal
 *         show={modal.showConfirmation}
 *         isLoading={modal.isLoading}
 *         onConfirm={modal.handlers?.onConfirm}
 *         onCancel={modal.handlers?.onCancel}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useConfirmationModal() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [handlers, setHandlers] = useState<ConfirmationHandlers | null>(null);

  const showModal = useCallback(
    (onConfirm: () => void, onCancel: () => void, loading: boolean = false) => {
      setShowConfirmation(true);
      setIsLoading(loading);
      setHandlers({ onConfirm, onCancel });
    },
    []
  );

  const hideModal = useCallback(() => {
    setShowConfirmation(false);
    setIsLoading(false);
    setHandlers(null);
  }, []);

  const updateLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return {
    showConfirmation,
    isLoading,
    handlers,
    showModal,
    hideModal,
    updateLoading,
  };
}
