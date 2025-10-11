/**
 * @fileoverview Main library module exports for the Stock Simulator application
 *
 * Central export point for all library modules including API clients, authentication,
 * configuration, constants, and utility functions. Provides organized access to core
 * application functionality for components and pages.
 *
 * @module lib
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @remarks
 * This module consolidates:
 * - API client modules (auth, trading, portfolio, market data)
 * - Authentication utilities (JWT token management)
 * - Configuration modules (access control, page permissions)
 * - Application constants (navigation, roles, settings)
 * - Utility functions (cookies, error handling, navigation)
 *
 * Usage patterns:
 * ```typescript
 * // Import specific modules
 * import { ApiClient, getCookie, getErrorMessage } from '@/lib';
 *
 * // Import from specific sub-modules (recommended for tree-shaking)
 * import { loginUser } from '@/lib/api/auth';
 * import { filterNavItemsByRole } from '@/lib/utils';
 * ```
 *
 * @example
 * ```typescript
 * // Complete application initialization
 * import {
 *   ApiClient,
 *   getCookie,
 *   setCookie,
 *   getErrorMessage,
 *   navigationItems,
 *   pageAccessControl
 * } from '@/lib';
 *
 * function initializeApp() {
 *   const authToken = getCookie('auth.access');
 *
 *   if (authToken) {
 *     ApiClient.setAuthToken(authToken);
 *   }
 *
 *   return {
 *     isAuthenticated: !!authToken,
 *     navigation: navigationItems,
 *     accessControl: pageAccessControl
 *   };
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Error handling with library utilities
 * import { getErrorMessage, ApiClient } from '@/lib';
 *
 * async function handleApiCall() {
 *   try {
 *     const data = await ApiClient.get('/api/portfolio');
 *     return data;
 *   } catch (error) {
 *     const userMessage = getErrorMessage(error);
 *     console.error('API call failed:', userMessage);
 *     throw new Error(userMessage);
 *   }
 * }
 * ```
 */

// API client modules
export * from "./api";

// Authentication utilities
export * from "./auth";

// Configuration modules
export * from "./config";

// Application constants
export * from "./constants";

// Utility functions
export * from "./utils";

// Explicit re-exports for TypeDoc visibility
export { getCookie, setCookie, removeCookie } from "./utils/cookies";

export { getErrorMessage } from "./utils/errorHandling";

export {
  filterNavItemsByRole,
  filterNavItemsForView,
} from "./utils/navigationUtils";

export {
  loadTokensFromStorage,
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getAuthenticatedAs,
  getUserId,
  getUserIdFromToken,
} from "./auth/tokenStorage";

export { PAGE_ACCESS_CONFIG } from "./config/pageAccessControl";

export { navItems } from "./constants/navItems";
