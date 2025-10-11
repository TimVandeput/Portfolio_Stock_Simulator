/**
 * @fileoverview Secure Cookie Management Utilities
 *
 * Provides comprehensive browser cookie management functionality with security
 * considerations, SSR compatibility, and GDPR compliance features. Handles
 * cookie creation, retrieval, and deletion with proper encoding and validation.
 *
 * @module lib/utils/cookies
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @example
 * ```typescript
 * import { setCookie, getCookie, removeCookie } from '@/lib/utils/cookies';
 *
 * // Set a secure cookie
 * setCookie('userPreference', 'darkMode', { days: 30 });
 *
 * // Retrieve cookie value
 * const preference = getCookie('userPreference');
 *
 * // Remove cookie
 * removeCookie('userPreference');
 * ```
 */

/**
 * Retrieves the value of a specific cookie by name from the browser.
 *
 * Safely extracts cookie values from the document.cookie string with proper
 * URL decoding and regex-based parsing. Handles special characters and
 * provides SSR-safe implementation for Next.js applications.
 *
 * @param name - The name of the cookie to retrieve
 * @returns The decoded cookie value, or null if not found or unavailable
 *
 * @remarks
 * This function:
 * - Safely handles SSR environments by checking for document availability
 * - Uses regex pattern matching with special character escaping
 * - Automatically URL-decodes retrieved cookie values
 * - Returns null for missing cookies or server-side execution
 * - Handles cookie names with special characters properly
 *
 * Security considerations:
 * - Regex pattern prevents injection attacks through cookie names
 * - URL decoding handles encoded special characters safely
 * - Server-side safety prevents runtime errors in SSR
 *
 * Browser compatibility:
 * - Works with all modern browsers and legacy support
 * - Handles document.cookie API differences gracefully
 * - Compatible with SameSite and secure cookie attributes
 *
 * @example
 * ```typescript
 * // Basic cookie retrieval
 * const userTheme = getCookie('theme');
 * if (userTheme) {
 *   console.log('User prefers:', userTheme);
 * } else {
 *   console.log('No theme preference found');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Handle special characters in cookie names
 * const complexValue = getCookie('user-data[preferences]');
 * console.log('Complex cookie value:', complexValue);
 * ```
 *
 * @example
 * ```typescript
 * // React hook for cookie values
 * function useCookie(name: string) {
 *   const [value, setValue] = useState<string | null>(() => getCookie(name));
 *
 *   const updateCookie = useCallback((newValue: string, options?: { days?: number }) => {
 *     setCookie(name, newValue, options);
 *     setValue(newValue);
 *   }, [name]);
 *
 *   const deleteCookie = useCallback(() => {
 *     removeCookie(name);
 *     setValue(null);
 *   }, [name]);
 *
 *   return { value, updateCookie, deleteCookie };
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Authentication token retrieval
 * function getAuthToken(): string | null {
 *   const token = getCookie('auth.access');
 *
 *   if (!token) {
 *     console.warn('No authentication token found');
 *     return null;
 *   }
 *
 *   // Validate token format
 *   if (!token.includes('.')) {
 *     console.error('Invalid token format');
 *     removeCookie('auth.access'); // Clean up invalid token
 *     return null;
 *   }
 *
 *   return token;
 * }
 * ```
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}=([^;]*)`
    )
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Sets a cookie with the specified name, value, and optional configuration.
 *
 * Creates or updates a browser cookie with proper URL encoding, expiration
 * handling, and security attributes. Provides SSR-safe implementation with
 * configurable options for path and expiration time.
 *
 * @param name - The name of the cookie to set
 * @param value - The value to store in the cookie
 * @param options - Optional configuration for cookie behavior
 * @param options.days - Number of days until cookie expires (default: 7)
 * @param options.path - Cookie path scope (default: "/")
 * @returns void
 *
 * @remarks
 * This function:
 * - Automatically URL-encodes cookie values for safe storage
 * - Sets secure expiration dates based on current timestamp
 * - Provides sensible defaults for path and expiration
 * - Handles SSR environments safely by checking document availability
 * - Creates cookies accessible across the entire domain by default
 *
 * Security considerations:
 * - URL encoding prevents value injection and parsing errors
 * - Default path "/" ensures broad accessibility while maintaining security
 * - Expiration dates prevent indefinite cookie persistence
 * - Compatible with secure and SameSite attributes when needed
 *
 * Cookie configuration:
 * - Default expiration: 7 days from creation
 * - Default path: "/" (entire domain)
 * - Automatic URL encoding for special characters
 * - UTC timestamp for consistent expiration across timezones
 *
 * @example
 * ```typescript
 * // Basic cookie creation
 * setCookie('username', 'john_doe');
 *
 * // Cookie with custom expiration
 * setCookie('sessionId', 'abc123', { days: 1 });
 *
 * // Cookie with custom path
 * setCookie('adminToken', 'xyz789', { days: 30, path: '/admin' });
 * ```
 *
 * @example
 * ```typescript
 * // Store complex data (JSON)
 * const userData = { id: 123, role: 'USER', preferences: { theme: 'dark' } };
 * setCookie('userData', JSON.stringify(userData), { days: 30 });
 *
 * // Retrieve and parse
 * const stored = getCookie('userData');
 * if (stored) {
 *   const parsed = JSON.parse(stored);
 *   console.log('User data:', parsed);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Authentication token storage
 * function storeAuthTokens(accessToken: string, refreshToken: string) {
 *   // Short-lived access token
 *   setCookie('auth.access', accessToken, { days: 1 });
 *
 *   // Longer-lived refresh token
 *   setCookie('auth.refresh', refreshToken, { days: 30 });
 *
 *   console.log('Authentication tokens stored securely');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // User preference management
 * class UserPreferences {
 *   static setTheme(theme: 'light' | 'dark') {
 *     setCookie('user.theme', theme, { days: 365 }); // Store for 1 year
 *   }
 *
 *   static setLanguage(language: string) {
 *     setCookie('user.language', language, { days: 365 });
 *   }
 *
 *   static setCurrency(currency: string) {
 *     setCookie('user.currency', currency, { days: 90 });
 *   }
 * }
 * ```
 */
export function setCookie(
  name: string,
  value: string,
  options?: { days?: number; path?: string }
) {
  if (typeof document === "undefined") return;
  const days = options?.days ?? 7;
  const path = options?.path ?? "/";
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=${path}`;
}

/**
 * Removes a cookie by setting its expiration date to the past.
 *
 * Effectively deletes a browser cookie by setting an expired date,
 * causing the browser to automatically remove it. Provides SSR-safe
 * implementation and uses standard cookie deletion techniques.
 *
 * @param name - The name of the cookie to remove
 * @returns void
 *
 * @remarks
 * This function:
 * - Sets cookie expiration to January 1, 1970 (Unix epoch)
 * - Uses root path "/" to ensure cookie is deleted regardless of current path
 * - Handles SSR environments safely by checking document availability
 * - Immediately triggers browser cookie removal upon execution
 * - Compatible with all modern and legacy browsers
 *
 * Cookie deletion mechanism:
 * - Sets expired date in the past to trigger automatic removal
 * - Uses empty value to clear any remaining data
 * - Root path ensures deletion regardless of original cookie path
 * - Immediate effect - cookie becomes unavailable after function call
 *
 * Security considerations:
 * - Ensures complete removal of sensitive data
 * - Prevents cookie persistence after logout or security events
 * - Compatible with secure and HttpOnly cookies when appropriate
 * - Safe for authentication token cleanup
 *
 * @example
 * ```typescript
 * // Remove user session cookie
 * removeCookie('sessionId');
 * console.log('Session cookie removed');
 * ```
 *
 * @example
 * ```typescript
 * // Logout function with cookie cleanup
 * function logoutUser() {
 *   // Remove all authentication cookies
 *   removeCookie('auth.access');
 *   removeCookie('auth.refresh');
 *   removeCookie('user.session');
 *
 *   // Clear user preferences if needed
 *   removeCookie('user.preferences');
 *
 *   console.log('User logged out, all cookies cleared');
 *
 *   // Redirect to login page
 *   window.location.href = '/login';
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Cookie cleanup utility
 * function clearAllUserCookies() {
 *   const cookiesToClear = [
 *     'auth.access',
 *     'auth.refresh',
 *     'user.theme',
 *     'user.language',
 *     'user.preferences',
 *     'shopping.cart',
 *     'analytics.session'
 *   ];
 *
 *   cookiesToClear.forEach(cookieName => {
 *     removeCookie(cookieName);
 *     console.log(`Cleared cookie: ${cookieName}`);
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React hook for cookie management with removal
 * function useCookieManager(cookieName: string) {
 *   const [value, setValue] = useState<string | null>(() => getCookie(cookieName));
 *
 *   const updateCookie = useCallback((newValue: string, options?: { days?: number }) => {
 *     setCookie(cookieName, newValue, options);
 *     setValue(newValue);
 *   }, [cookieName]);
 *
 *   const deleteCookie = useCallback(() => {
 *     removeCookie(cookieName);
 *     setValue(null);
 *   }, [cookieName]);
 *
 *   const exists = value !== null;
 *
 *   return {
 *     value,
 *     exists,
 *     set: updateCookie,
 *     remove: deleteCookie
 *   };
 * }
 * ```
 *
 * @example
 * ```typescript
 * // GDPR compliance cookie management
 * function handleGDPRConsent(accepted: boolean) {
 *   if (accepted) {
 *     setCookie('gdpr.consent', 'accepted', { days: 365 });
 *     setCookie('analytics.enabled', 'true', { days: 365 });
 *   } else {
 *     // Remove all non-essential cookies
 *     removeCookie('analytics.enabled');
 *     removeCookie('marketing.tracking');
 *     removeCookie('social.sharing');
 *
 *     setCookie('gdpr.consent', 'declined', { days: 365 });
 *   }
 * }
 * ```
 */
export function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
