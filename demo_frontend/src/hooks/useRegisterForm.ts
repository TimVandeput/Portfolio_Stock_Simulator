"use client";

import { useState } from "react";
import { register } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import type { RegisterRequest } from "@/types";

export function useRegisterForm() {
  const [rUser, setRUser] = useState("");
  const [rPass, setRPass] = useState("");
  const [rPass2, setRPass2] = useState("");
  const [rCode, setRCode] = useState("");
  const [rStatus, setRStatus] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const clearStatus = () => {
    setRStatus(null);
  };

  const resetForm = () => {
    setRUser("");
    setRPass("");
    setRPass2("");
    setRCode("");
    clearStatus();
  };

  const validateForm = () => {
    if (!rUser || !rPass || !rPass2 || !rCode) {
      setRStatus({ message: "Please fill in all fields.", type: "error" });
      return false;
    }
    if (rPass !== rPass2) {
      setRStatus({ message: "Passwords do not match.", type: "error" });
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
        password: rPass,
        passcode: rCode,
      };
      await register(registerData);

      setRStatus({
        message: `Registration successful! Please log in.`,
        type: "success",
      });
      resetForm();

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
    rPass,
    setRPass,
    rPass2,
    setRPass2,
    rCode,
    setRCode,
    rStatus,
    isRegistering,
    handleSubmit,
    clearStatus,
    resetForm,
  };
}
