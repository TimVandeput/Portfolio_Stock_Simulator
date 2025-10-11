/**
 * @fileoverview Authentication API functions for user registration, login, and logout.
 *
 * This module provides comprehensive authentication functionality including user registration,
 * login with token management, and logout with complete session cleanup. All functions
 * integrate with the token storage system and handle authentication state management.
 *
 * The API provides:
 * - User registration with validation and error handling
 * - Login with JWT token extraction and storage
 * - Logout with comprehensive session cleanup
 * - Token management and cross-tab synchronization
 * - Authentication state change notifications
 * - Secure cookie and storage cleanup
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type {
  RegisterRequest,
  RegistrationResponse,
  LoginRequest,
  AuthResponse,
} from "@/types";
import { HttpClient } from "@/lib/api/http";
import {
  setTokens,
  clearTokens,
  getUserIdFromToken,
} from "@/lib/auth/tokenStorage";
import { getCookie, removeCookie } from "../utils/cookies";

const client = new HttpClient();

/**
 * Registers a new user account with the Stock Simulator platform.
 *
 * Creates a new user account with the provided registration information.
 * Validates user input and returns registration confirmation details.
 *
 * @param data Registration request containing user details
 * @param data.username Unique username for the account
 * @param data.email User's email address
 * @param data.password Secure password for the account
 * @returns Promise resolving to registration response with user details
 * @throws ApiError on validation failures or server errors
 *
 * @example
 * ```typescript
 * try {
 *   const response = await register({
 *     username: 'johndoe',
 *     email: 'john@example.com',
 *     password: 'securePassword123'
 *   });
 *   console.log('Registration successful:', response.message);
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error('Registration failed:', error.message);
 *   }
 * }
 * ```
 */
export async function register(
  data: RegisterRequest
): Promise<RegistrationResponse> {
  return client.post<RegistrationResponse>("/api/auth/register", data);
}

/**
 * Authenticates a user and establishes an authenticated session.
 *
 * Performs user authentication using credentials and establishes a secure session
 * with JWT tokens. Extracts user information from tokens and stores authentication
 * state for subsequent API requests.
 *
 * @param data Login request containing user credentials
 * @param data.usernameOrEmail Username or email address
 * @param data.password User's password
 * @returns Promise resolving to authentication response with tokens and user info
 * @throws ApiError on authentication failures or server errors
 *
 * @remarks
 * This function:
 * - Validates user credentials with the server
 * - Extracts user ID from JWT token payload
 * - Stores access and refresh tokens securely
 * - Sets up authentication state for the session
 * - Handles token parsing errors gracefully
 *
 * @example
 * ```typescript
 * try {
 *   const response = await login({
 *     usernameOrEmail: 'john@example.com',
 *     password: 'userPassword123'
 *   });
 *
 *   console.log('Login successful');
 *   console.log('Role:', response.authenticatedAs);
 *
 *   // Tokens are automatically stored and managed
 *   // User can now make authenticated API requests
 * } catch (error) {
 *   if (error instanceof ApiError && error.status === 401) {
 *     console.error('Invalid credentials');
 *   }
 * }
 * ```
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>("/api/auth/login", data);

  let extractedUserId = null;
  try {
    const payload = JSON.parse(atob(res.accessToken.split(".")[1]));
    extractedUserId = payload.userId || null;
  } catch (tokenError) {
    console.error("Failed to extract userId:", tokenError);
  }

  setTokens({
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    authenticatedAs: res.authenticatedAs,
    userId: extractedUserId ?? undefined,
  });

  return res;
}

/**
 * Logs out the current user and performs comprehensive session cleanup.
 *
 * Terminates the user's session by invalidating tokens on the server and
 * performing thorough cleanup of all authentication-related data from
 * browser storage and cookies.
 *
 * @returns Promise that resolves when logout is complete
 *
 * @remarks
 * This function performs comprehensive cleanup:
 * - Calls server logout endpoint to invalidate refresh token
 * - Clears all tokens from secure storage
 * - Removes all authentication-related cookies
 * - Clears any cached authentication state
 * - Handles cleanup gracefully even if server call fails
 * - Ensures no authentication data remains in browser
 *
 * The function is designed to be fail-safe - even if the server logout
 * call fails, local cleanup will still be performed to ensure security.
 *
 * @example
 * ```typescript
 * // Simple logout
 * await logout();
 * console.log('User logged out successfully');
 *
 * // Logout with error handling
 * try {
 *   await logout();
 *   router.push('/login');
 * } catch (error) {
 *   console.warn('Logout completed with warnings:', error);
 *   // Local cleanup still performed even if server call failed
 *   router.push('/login');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Logout in a React component
 * function LogoutButton() {
 *   const [isLoggingOut, setIsLoggingOut] = useState(false);
 *
 *   const handleLogout = async () => {
 *     setIsLoggingOut(true);
 *     try {
 *       await logout();
 *       // User will be redirected automatically
 *     } catch (error) {
 *       console.error('Logout error:', error);
 *     } finally {
 *       setIsLoggingOut(false);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={handleLogout} disabled={isLoggingOut}>
 *       {isLoggingOut ? 'Logging out...' : 'Logout'}
 *     </button>
 *   );
 * }
 * ```
 */
export async function logout(): Promise<void> {
  const refreshToken = getCookie("auth.refresh");
  if (refreshToken) {
    try {
      await client.post<void>("/api/auth/logout", { refreshToken });
    } catch (error) {
      console.warn(
        "Logout API call failed, but continuing with token cleanup:",
        error
      );
    }
  }

  clearTokens();

  [
    "token",
    "refreshToken",
    "accessToken",
    "auth.token",
    "authToken",
    "jwt",
    "bearerToken",
    "auth.refresh",
    "auth.access",
    "auth.as",
  ].forEach((key) => removeCookie(key));

  clearTokens();

  const keysToRemove = [
    "token",
    "refreshToken",
    "accessToken",
    "auth.token",
    "authToken",
    "jwt",
    "bearerToken",
    "auth.refresh",
    "auth.access",
    "auth.as",
  ];

  keysToRemove.forEach((key) => {
    removeCookie(key);
  });
}
