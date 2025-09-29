"use client";

import { useState } from "react";

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
