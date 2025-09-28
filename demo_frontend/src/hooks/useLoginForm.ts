"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import type { LoginRequest } from "@/types";

export function useLoginForm() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setUsernameOrEmail("");
    setPassword("");
    clearMessages();
  };

  const handleSubmit = async () => {
    clearMessages();

    if (!usernameOrEmail || !password) {
      setError("Please enter your email/username and password.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const loginData: LoginRequest = {
        usernameOrEmail,
        password,
      };
      const response = await login(loginData);

      setSuccess(`Login successful! Welcome, ${response.username}!`);
      setUsernameOrEmail("");
      setPassword("");

      setTimeout(() => {
        setShowLoader(true);
        sessionStorage.setItem("fromLogin", "true");
        router.replace("/home");
      }, 2000);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      setError(
        errorMessage ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return {
    usernameOrEmail,
    setUsernameOrEmail,
    password,
    setPassword,
    error,
    success,
    isLoggingIn,
    showLoader,
    handleSubmit,
    clearMessages,
    resetForm,
  };
}
