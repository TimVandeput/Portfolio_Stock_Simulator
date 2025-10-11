/**
 * @fileoverview Login form management hook with authentication flow.
 *
 * This hook provides comprehensive login form functionality including form state
 * management, validation, authentication API integration, error handling, and
 * post-login navigation with animation triggers.
 *
 * The hook provides:
 * - Complete form state management (inputs, validation, errors)
 * - Authentication API integration with error handling
 * - Loading states and user feedback during login process
 * - Automatic navigation after successful authentication
 * - Form reset and cleanup functionality
 * - Animation trigger support for post-login sequences
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import type { LoginRequest } from "@/types";

/**
 * Hook for managing login form state and authentication workflow.
 *
 * Provides complete login functionality including form validation, API integration,
 * error handling, and post-authentication navigation with animation support.
 *
 * @returns Login form control object with state, handlers, and utilities
 *
 * @remarks
 * This hook manages the entire login workflow:
 * - Form input state management (username/email, password)
 * - Form validation and error display
 * - Loading states during authentication attempts
 * - Success/error message handling
 * - Automatic navigation after successful login
 * - Animation trigger for post-login sequences
 * - Form cleanup and reset functionality
 *
 * The hook integrates with the authentication API and provides user feedback
 * throughout the login process. It supports both username and email login.
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const {
 *     usernameOrEmail,
 *     password,
 *     error,
 *     success,
 *     isLoggingIn,
 *     setUsernameOrEmail,
 *     setPassword,
 *     handleSubmit,
 *     resetForm
 *   } = useLoginForm();
 *
 *   return (
 *     <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
 *       <input
 *         type="text"
 *         placeholder="Username or Email"
 *         value={usernameOrEmail}
 *         onChange={(e) => setUsernameOrEmail(e.target.value)}
 *         disabled={isLoggingIn}
 *       />
 *       <input
 *         type="password"
 *         placeholder="Password"
 *         value={password}
 *         onChange={(e) => setPassword(e.target.value)}
 *         disabled={isLoggingIn}
 *       />
 *
 *       {error && <div className="error">{error}</div>}
 *       {success && <div className="success">{success}</div>}
 *
 *       <button type="submit" disabled={isLoggingIn}>
 *         {isLoggingIn ? 'Logging in...' : 'Login'}
 *       </button>
 *
 *       <button type="button" onClick={resetForm}>
 *         Reset
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Login with validation and feedback
 * function LoginPage() {
 *   const loginForm = useLoginForm();
 *
 *   const isFormValid = loginForm.usernameOrEmail && loginForm.password;
 *
 *   return (
 *     <div className="login-page">
 *       <div className="login-card">
 *         <h1>Welcome Back</h1>
 *
 *         <div className="form-group">
 *           <label>Username or Email</label>
 *           <input
 *             value={loginForm.usernameOrEmail}
 *             onChange={(e) => loginForm.setUsernameOrEmail(e.target.value)}
 *             className={loginForm.error ? 'error' : ''}
 *           />
 *         </div>
 *
 *         <div className="form-group">
 *           <label>Password</label>
 *           <input
 *             type="password"
 *             value={loginForm.password}
 *             onChange={(e) => loginForm.setPassword(e.target.value)}
 *             className={loginForm.error ? 'error' : ''}
 *           />
 *         </div>
 *
 *         <button
 *           onClick={loginForm.handleSubmit}
 *           disabled={!isFormValid || loginForm.isLoggingIn}
 *           className="login-button"
 *         >
 *           {loginForm.isLoggingIn ? 'Signing In...' : 'Sign In'}
 *         </button>
 *
 *         {loginForm.error && (
 *           <div className="alert alert-error">{loginForm.error}</div>
 *         )}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
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
