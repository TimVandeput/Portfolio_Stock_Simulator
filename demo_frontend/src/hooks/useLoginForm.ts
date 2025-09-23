"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import type { LoginRequest, Role } from "@/types";

export function useLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("ROLE_USER");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    clearMessages();
  };

  const handleSubmit = async () => {
    clearMessages();

    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const loginData: LoginRequest = {
        username,
        password,
        chosenRole: selectedRole,
      };
      const response = await login(loginData);

      setSuccess(`Login successful! Welcome, ${response.username}!`);
      setUsername("");
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
    username,
    setUsername,
    password,
    setPassword,
    error,
    success,
    selectedRole,
    setSelectedRole,
    isLoggingIn,
    showLoader,
    handleSubmit,
    clearMessages,
    resetForm,
  };
}
