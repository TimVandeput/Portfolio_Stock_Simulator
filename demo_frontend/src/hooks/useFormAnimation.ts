/**
 * @fileoverview Form animation hook for login/register form transitions.
 *
 * This hook manages animated transitions between login and registration forms
 * with smooth flip animations and timing controls for enhanced user experience.
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import { useState } from "react";

/**
 * Hook for managing form flip animations between login and register modes.
 *
 * @returns Animation control object with state and transition functions
 */
export function useFormAnimation() {
  const [isFlipped, setIsFlipped] = useState(true);

  const flipToRegister = (onComplete?: () => void) => {
    setIsFlipped(true);
    if (onComplete) {
      setTimeout(onComplete, 500);
    }
  };

  const flipToLogin = (onComplete?: () => void) => {
    setIsFlipped(false);
    if (onComplete) {
      setTimeout(onComplete, 500);
    }
  };

  return {
    isFlipped,
    flipToRegister,
    flipToLogin,
  };
}
