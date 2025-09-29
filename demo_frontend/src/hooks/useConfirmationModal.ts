"use client";

import { useState, useCallback } from "react";

interface ConfirmationHandlers {
  onConfirm: () => void;
  onCancel: () => void;
}

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
