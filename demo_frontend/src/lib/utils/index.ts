/**
 * @fileoverview Utility functions module exports
 *
 * Central export point for all utility functions used throughout the Stock Simulator application.
 * Provides convenient access to cookie management, error handling, and navigation utilities
 * without requiring individual module imports.
 *
 * @module lib/utils
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @remarks
 * This module consolidates:
 * - Cookie management utilities (getCookie, setCookie, removeCookie)
 * - Error handling functions (getErrorMessage)
 * - Navigation utilities (various routing and navigation helpers)
 *
 * Usage patterns:
 * ```typescript
 * // Import specific utilities
 * import { getCookie, getErrorMessage } from '@/lib/utils';
 *
 * // Import all utilities (not recommended for tree-shaking)
 * import * as utils from '@/lib/utils';
 * ```
 *
 * @example
 * ```typescript
 * // Recommended: Import only what you need
 * import { getCookie, setCookie, getErrorMessage } from '@/lib/utils';
 *
 * function handleAuth() {
 *   try {
 *     const token = getCookie('auth.access');
 *     if (!token) {
 *       throw new Error('No authentication token found');
 *     }
 *     return token;
 *   } catch (error) {
 *     const message = getErrorMessage(error);
 *     console.error('Auth handling failed:', message);
 *     return null;
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Component usage with multiple utilities
 * import { getCookie, setCookie, getErrorMessage, navigateToPage } from '@/lib/utils';
 *
 * function UserPreferences() {
 *   const [theme, setTheme] = useState(() => getCookie('user.theme') || 'light');
 *
 *   const updateTheme = (newTheme: string) => {
 *     try {
 *       setCookie('user.theme', newTheme, { days: 365 });
 *       setTheme(newTheme);
 *
 *       // Navigate to refresh theme
 *       navigateToPage('/dashboard');
 *     } catch (error) {
 *       const message = getErrorMessage(error);
 *       showErrorToast(message);
 *     }
 *   };
 *
 *   return (
 *     <ThemeSelector
 *       currentTheme={theme}
 *       onThemeChange={updateTheme}
 *     />
 *   );
 * }
 * ```
 */

// Cookie management utilities
export * from "./cookies";

// Error handling utilities
export * from "./errorHandling";

// Navigation and routing utilities
export * from "./navigationUtils";
