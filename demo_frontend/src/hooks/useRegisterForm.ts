/**
 * @fileoverview Registration form management hook with validation and API integration.
 *
 * This hook provides comprehensive registration form functionality including form state
 * management, validation, API integration, error handling, and user feedback systems.
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import { useState, useEffect } from "react";
import { register } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import type { RegisterRequest } from "@/types";

/**
 * Hook for managing registration form state and user registration workflow.
 *
 * @returns Registration form control object with state, handlers, and validation
 */
export function useRegisterForm() {
  const [rUser, setRUser] = useState("");
  const [rEmail, setREmail] = useState("");
  const [rPass, setRPass] = useState("");
  const [rPass2, setRPass2] = useState("");
  const [rStatus, setRStatus] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    console.log("RegisterForm rStatus changed:", rStatus);
  }, [rStatus]);

  const clearStatus = () => {
    setRStatus(null);
  };

  const resetForm = () => {
    setRUser("");
    setREmail("");
    setRPass("");
    setRPass2("");
    clearStatus();
  };

  const validateForm = () => {
    if (!rUser || !rEmail || !rPass || !rPass2) {
      setRStatus({ message: "Please fill in all fields.", type: "error" });
      return false;
    }
    if (rPass !== rPass2) {
      setRStatus({ message: "Passwords do not match.", type: "error" });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(rEmail)) {
      setRStatus({
        message: "Please enter a valid email address.",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (onSuccess?: () => void) => {
    clearStatus();

    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);
    try {
      const registerData: RegisterRequest = {
        username: rUser,
        email: rEmail,
        password: rPass,
      };
      await register(registerData);

      setRStatus({
        message: `Registration successful! Please log in.`,
        type: "success",
      });

      setRUser("");
      setREmail("");
      setRPass("");
      setRPass2("");

      setTimeout(() => {
        onSuccess?.();
        clearStatus();
      }, 2000);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setRStatus({
        message: errorMessage || "Registration failed. Please try again.",
        type: "error",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    rUser,
    setRUser,
    rEmail,
    setREmail,
    rPass,
    setRPass,
    rPass2,
    setRPass2,
    rStatus,
    isRegistering,
    handleSubmit,
    clearStatus,
    resetForm,
  };
}
