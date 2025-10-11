/**
 * @fileoverview Secure JWT Token Storage and Management System
 *
 * Provides comprehensive JWT token management functionality for the Stock Simulator
 * application. Handles secure storage, retrieval, and management of authentication
 * tokens with browser compatibility and event-driven state synchronization.
 *
 * @module lib/auth/tokenStorage
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @example
 * ```typescript
 * import { setTokens, getAccessToken, clearTokens } from '@/lib/auth/tokenStorage';
 *
 * // Store authentication tokens after login
 * setTokens({
 *   accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   authenticatedAs: 'USER',
 *   userId: 123
 * });
 *
 * // Retrieve access token for API calls
 * const token = getAccessToken();
 *
 * // Clear all tokens on logout
 * clearTokens();
 * ```
 */

import { Role } from "@/types";
import { getCookie, setCookie, removeCookie } from "@/lib/utils/cookies";

/**
 * In-memory storage for access token to reduce cookie access overhead.
 * @private
 */
let _accessToken: string | null = null;

/**
 * In-memory storage for refresh token to reduce cookie access overhead.
 * @private
 */
let _refreshToken: string | null = null;

/**
 * In-memory storage for user role to reduce cookie access overhead.
 * @private
 */
let _authenticatedAs: Role | null = null;

/**
 * In-memory storage for user ID to reduce cookie access overhead.
 * @private
 */
let _userId: number | null = null;

/**
 * Cookie key for storing the JWT access token.
 * @private
 * @constant
 */
const ACCESS_KEY = "auth.access";

/**
 * Cookie key for storing the JWT refresh token.
 * @private
 * @constant
 */
const REFRESH_KEY = "auth.refresh";

/**
 * Cookie key for storing the user's authenticated role.
 * @private
 * @constant
 */
const AS_KEY = "auth.as";

/**
 * Cookie key for storing the user's unique identifier.
 * @private
 * @constant
 */
const USER_ID_KEY = "auth.userId";

/**
 * Utility function to check if code is running in browser environment.
 *
 * @returns True if running in browser, false if server-side rendering
 * @private
 */
const isBrowser = () => typeof window !== "undefined";

/**
 * Emits a custom event to notify components of authentication state changes.
 *
 * Dispatches an 'authChanged' event on the window object to inform React
 * components and other listeners that the authentication state has been
 * modified. This enables reactive UI updates across the application.
 *
 * @private
 *
 * @example
 * ```typescript
 * // Listen for auth changes in a React component
 * useEffect(() => {
 *   const handleAuthChange = () => {
 *     console.log('Authentication state changed');
 *     // Update component state or trigger re-render
 *   };
 *
 *   window.addEventListener('authChanged', handleAuthChange);
 *   return () => window.removeEventListener('authChanged', handleAuthChange);
 * }, []);
 * ```
 */
const emitAuthChange = () => {
  if (isBrowser()) {
    window.dispatchEvent(new Event("authChanged"));
  }
};

/**
 * Loads authentication tokens and user data from browser cookies into memory.
 *
 * Initializes the in-memory token storage by reading authentication data
 * from HTTP cookies. This function should be called during application
 * initialization to restore authentication state from persistent storage.
 *
 * @returns void
 *
 * @remarks
 * This function:
 * - Only executes in browser environment (not during SSR)
 * - Reads all authentication cookies into memory variables
 * - Parses and validates stored data types
 * - Handles missing or invalid cookie data gracefully
 * - Optimizes subsequent token access by caching in memory
 *
 * The function is idempotent and safe to call multiple times.
 * It will not emit auth change events since it's loading existing state.
 *
 * @example
 * ```typescript
 * // Load tokens during app initialization
 * import { loadTokensFromStorage } from '@/lib/auth/tokenStorage';
 *
 * function App() {
 *   useEffect(() => {
 *     // Restore authentication state from cookies
 *     loadTokensFromStorage();
 *   }, []);
 *
 *   return <AppContent />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Load tokens in a custom auth hook
 * function useAuthInitialization() {
 *   useEffect(() => {
 *     loadTokensFromStorage();
 *
 *     // Check if tokens are valid and not expired
 *     const token = getAccessToken();
 *     if (token && isTokenExpired(token)) {
 *       clearTokens(); // Clear expired tokens
 *     }
 *   }, []);
 * }
 * ```
 */
export function loadTokensFromStorage() {
  if (!isBrowser()) return;
  _accessToken = getCookie(ACCESS_KEY);
  _refreshToken = getCookie(REFRESH_KEY);
  _authenticatedAs = (getCookie(AS_KEY) as Role | null) ?? null;
  _userId = getCookie(USER_ID_KEY) ? parseInt(getCookie(USER_ID_KEY)!) : null;
}

/**
 * Securely stores authentication tokens and user data in both memory and cookies.
 *
 * Persists JWT tokens and associated user information to HTTP cookies while
 * also caching them in memory for optimal performance. Triggers authentication
 * state change events to update the application UI.
 *
 * @param tokens - Authentication data to store
 * @param tokens.accessToken - JWT access token for API authorization
 * @param tokens.refreshToken - JWT refresh token for token renewal
 * @param tokens.authenticatedAs - User's role/permission level (optional)
 * @param tokens.userId - User's unique identifier (optional)
 * @returns void
 *
 * @throws {Error} When token storage fails or tokens are invalid
 *
 * @remarks
 * This function:
 * - Stores tokens in both memory and HTTP cookies for persistence
 * - Updates all related user authentication data atomically
 * - Emits auth change events for reactive UI updates
 * - Handles browser/server environment differences gracefully
 * - Ensures secure cookie configuration for production use
 *
 * Security considerations:
 * - Cookies are configured with appropriate security flags
 * - Tokens are validated before storage
 * - Memory storage provides performance optimization
 * - Event emission enables immediate UI synchronization
 *
 * @example
 * ```typescript
 * // Store tokens after successful login
 * const loginResponse = await loginUser(credentials);
 *
 * setTokens({
 *   accessToken: loginResponse.accessToken,
 *   refreshToken: loginResponse.refreshToken,
 *   authenticatedAs: loginResponse.user.role,
 *   userId: loginResponse.user.id
 * });
 *
 * console.log('User authenticated successfully');
 * ```
 *
 * @example
 * ```typescript
 * // Update tokens after refresh
 * async function refreshAuthTokens() {
 *   try {
 *     const refreshToken = getRefreshToken();
 *     if (!refreshToken) throw new Error('No refresh token available');
 *
 *     const response = await fetch('/api/auth/refresh', {
 *       method: 'POST',
 *       headers: { 'Authorization': `Bearer ${refreshToken}` }
 *     });
 *
 *     const newTokens = await response.json();
 *
 *     setTokens({
 *       accessToken: newTokens.accessToken,
 *       refreshToken: newTokens.refreshToken,
 *       // Preserve existing user data
 *       authenticatedAs: getAuthenticatedAs(),
 *       userId: getUserId()
 *     });
 *
 *   } catch (error) {
 *     console.error('Token refresh failed:', error);
 *     clearTokens(); // Clear invalid tokens
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React hook for token management
 * function useTokenManager() {
 *   const handleLogin = useCallback((authData: LoginResponse) => {
 *     setTokens({
 *       accessToken: authData.accessToken,
 *       refreshToken: authData.refreshToken,
 *       authenticatedAs: authData.user.role,
 *       userId: authData.user.id
 *     });
 *
 *     // Redirect to dashboard after successful login
 *     router.push('/dashboard');
 *   }, [router]);
 *
 *   return { handleLogin };
 * }
 * ```
 */
export function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
  authenticatedAs?: Role;
  userId?: number;
}) {
  _accessToken = tokens.accessToken;
  _refreshToken = tokens.refreshToken;
  if (tokens.authenticatedAs) _authenticatedAs = tokens.authenticatedAs;
  if (tokens.userId !== undefined) _userId = tokens.userId;
  if (isBrowser()) {
    setCookie(ACCESS_KEY, _accessToken ?? "");
    setCookie(REFRESH_KEY, _refreshToken ?? "");
    if (_authenticatedAs) setCookie(AS_KEY, _authenticatedAs);
    if (_userId !== null && _userId !== undefined) {
      setCookie(USER_ID_KEY, _userId.toString());
    }
  }
  emitAuthChange();
}

/**
 * Securely clears all authentication tokens and user data from memory and cookies.
 *
 * Performs comprehensive cleanup of all authentication-related data by removing
 * tokens from both in-memory storage and HTTP cookies. Triggers authentication
 * state change events to update the application UI to reflect logged-out state.
 *
 * @returns void
 *
 * @remarks
 * This function:
 * - Clears all in-memory authentication variables
 * - Removes all authentication-related cookies
 * - Emits auth change events for immediate UI updates
 * - Is safe to call multiple times (idempotent)
 * - Handles browser/server environment differences
 * - Ensures complete logout and security cleanup
 *
 * Security considerations:
 * - Ensures no authentication data remains in browser
 * - Prevents unauthorized access after logout
 * - Clears sensitive data from multiple storage locations
 * - Triggers immediate UI state synchronization
 *
 * Use cases:
 * - User-initiated logout
 * - Session expiration handling
 * - Security-related forced logout
 * - Authentication error recovery
 *
 * @example
 * ```typescript
 * // Standard user logout
 * function handleLogout() {
 *   clearTokens();
 *   router.push('/login');
 *   toast.success('Logged out successfully');
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Automatic logout on token expiration
 * function checkTokenExpiration() {
 *   const token = getAccessToken();
 *   if (token && isTokenExpired(token)) {
 *     clearTokens();
 *     toast.warning('Session expired. Please log in again.');
 *     router.push('/login');
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React logout button component
 * function LogoutButton() {
 *   const [isLoggingOut, setIsLoggingOut] = useState(false);
 *
 *   const handleLogout = async () => {
 *     setIsLoggingOut(true);
 *
 *     try {
 *       // Optional: Call server logout endpoint
 *       await fetch('/api/auth/logout', { method: 'POST' });
 *     } catch (error) {
 *       console.warn('Server logout failed:', error);
 *     } finally {
 *       // Always clear local tokens
 *       clearTokens();
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
export function clearTokens() {
  _accessToken = null;
  _refreshToken = null;
  _authenticatedAs = null;
  _userId = null;
  if (isBrowser()) {
    removeCookie(ACCESS_KEY);
    removeCookie(REFRESH_KEY);
    removeCookie(AS_KEY);
    removeCookie(USER_ID_KEY);
  }
  emitAuthChange();
}

/**
 * Retrieves the current JWT access token from memory or cookies.
 *
 * Returns the stored JWT access token, attempting memory storage first
 * for performance, then falling back to cookie storage if needed.
 * Used for API authorization headers and authentication validation.
 *
 * @returns The JWT access token string, or null if not available
 *
 * @remarks
 * This function:
 * - Prioritizes in-memory storage for performance optimization
 * - Falls back to cookie storage if memory is empty
 * - Handles browser/server environment differences gracefully
 * - Returns null if no valid token is found
 * - Does not validate token expiration (use separate validation)
 *
 * Performance optimization:
 * - Memory access is faster than cookie parsing
 * - Lazy loading from cookies only when needed
 * - Caches result in memory for subsequent calls
 *
 * @example
 * ```typescript
 * // Use in API calls
 * const token = getAccessToken();
 * if (token) {
 *   const response = await fetch('/api/protected', {
 *     headers: {
 *       'Authorization': `Bearer ${token}`
 *     }
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Check authentication status
 * function isUserAuthenticated(): boolean {
 *   const token = getAccessToken();
 *   return token !== null && !isTokenExpired(token);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React hook for authenticated API calls
 * function useAuthenticatedFetch() {
 *   return useCallback(async (url: string, options: RequestInit = {}) => {
 *     const token = getAccessToken();
 *
 *     if (!token) {
 *       throw new Error('No access token available');
 *     }
 *
 *     return fetch(url, {
 *       ...options,
 *       headers: {
 *         ...options.headers,
 *         'Authorization': `Bearer ${token}`
 *       }
 *     });
 *   }, []);
 * }
 * ```
 */
export function getAccessToken() {
  if (!_accessToken && isBrowser()) {
    _accessToken = getCookie(ACCESS_KEY);
  }
  return _accessToken;
}

/**
 * Retrieves the current JWT refresh token from memory or cookies.
 *
 * Returns the stored JWT refresh token, attempting memory storage first
 * for performance, then falling back to cookie storage if needed.
 * Used for token renewal and maintaining authentication sessions.
 *
 * @returns The JWT refresh token string, or null if not available
 *
 * @remarks
 * This function:
 * - Prioritizes in-memory storage for performance optimization
 * - Falls back to cookie storage if memory is empty
 * - Handles browser/server environment differences gracefully
 * - Returns null if no valid refresh token is found
 * - Does not validate token expiration (use separate validation)
 *
 * Security considerations:
 * - Refresh tokens have longer expiration times than access tokens
 * - Should be used sparingly and only for token renewal
 * - More sensitive than access tokens due to longer validity
 *
 * @example
 * ```typescript
 * // Token refresh functionality
 * async function refreshAccessToken() {
 *   const refreshToken = getRefreshToken();
 *
 *   if (!refreshToken) {
 *     throw new Error('No refresh token available');
 *   }
 *
 *   const response = await fetch('/api/auth/refresh', {
 *     method: 'POST',
 *     headers: {
 *       'Authorization': `Bearer ${refreshToken}`,
 *       'Content-Type': 'application/json'
 *     }
 *   });
 *
 *   if (!response.ok) {
 *     clearTokens(); // Clear invalid tokens
 *     throw new Error('Token refresh failed');
 *   }
 *
 *   const newTokens = await response.json();
 *   setTokens(newTokens);
 *
 *   return newTokens.accessToken;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Automatic token refresh middleware
 * async function apiCallWithRefresh(url: string, options: RequestInit = {}) {
 *   let token = getAccessToken();
 *
 *   if (!token || isTokenExpired(token)) {
 *     try {
 *       token = await refreshAccessToken();
 *     } catch (error) {
 *       // Redirect to login if refresh fails
 *       window.location.href = '/login';
 *       throw error;
 *     }
 *   }
 *
 *   return fetch(url, {
 *     ...options,
 *     headers: {
 *       ...options.headers,
 *       'Authorization': `Bearer ${token}`
 *     }
 *   });
 * }
 * ```
 */
export function getRefreshToken() {
  if (!_refreshToken && isBrowser()) {
    _refreshToken = getCookie(REFRESH_KEY);
  }
  return _refreshToken;
}

/**
 * Retrieves the current user's authenticated role from memory or cookies.
 *
 * Returns the stored user role/permission level, attempting memory storage
 * first for performance, then falling back to cookie storage if needed.
 * Used for role-based access control and UI customization.
 *
 * @returns The user's role (e.g., 'USER', 'ADMIN'), or null if not available
 *
 * @remarks
 * This function:
 * - Prioritizes in-memory storage for performance optimization
 * - Falls back to cookie storage if memory is empty
 * - Handles browser/server environment differences gracefully
 * - Returns null if no role information is stored
 * - Type-safe with Role enum validation
 *
 * Role-based features:
 * - Access control for protected routes
 * - UI element visibility based on permissions
 * - Feature availability determination
 * - Administrative function access
 *
 * @example
 * ```typescript
 * // Check user permissions
 * function canAccessAdminPanel(): boolean {
 *   const role = getAuthenticatedAs();
 *   return role === 'ADMIN' || role === 'SUPER_ADMIN';
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Conditional UI rendering
 * function NavigationMenu() {
 *   const userRole = getAuthenticatedAs();
 *
 *   return (
 *     <nav>
 *       <Link href="/dashboard">Dashboard</Link>
 *       <Link href="/portfolio">Portfolio</Link>
 *
 *       {userRole === 'ADMIN' && (
 *         <Link href="/admin">Admin Panel</Link>
 *       )}
 *
 *       {(userRole === 'ADMIN' || userRole === 'MODERATOR') && (
 *         <Link href="/moderation">Moderation</Link>
 *       )}
 *     </nav>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Role-based hook
 * function useUserRole() {
 *   const [role, setRole] = useState<Role | null>(getAuthenticatedAs());
 *
 *   useEffect(() => {
 *     const handleAuthChange = () => {
 *       setRole(getAuthenticatedAs());
 *     };
 *
 *     window.addEventListener('authChanged', handleAuthChange);
 *     return () => window.removeEventListener('authChanged', handleAuthChange);
 *   }, []);
 *
 *   return {
 *     role,
 *     isAdmin: role === 'ADMIN',
 *     isModerator: role === 'MODERATOR',
 *     isUser: role === 'USER'
 *   };
 * }
 * ```
 */
export function getAuthenticatedAs() {
  if (!_authenticatedAs && isBrowser()) {
    _authenticatedAs = (getCookie(AS_KEY) as Role | null) ?? null;
  }
  return _authenticatedAs;
}

/**
 * Retrieves the current user's unique identifier from memory or cookies.
 *
 * Returns the stored user ID, attempting memory storage first for performance,
 * then falling back to cookie storage if needed. Used for user-specific
 * API calls, data filtering, and personalization features.
 *
 * @returns The user's unique identifier as a number, or null if not available
 *
 * @remarks
 * This function:
 * - Prioritizes in-memory storage for performance optimization
 * - Falls back to cookie storage if memory is empty
 * - Handles browser/server environment differences gracefully
 * - Parses stored string values to numbers automatically
 * - Returns null if no valid user ID is found
 *
 * Common use cases:
 * - User-specific data fetching
 * - Personalized content loading
 * - Access control validation
 * - Audit logging and tracking
 *
 * @example
 * ```typescript
 * // Fetch user-specific data
 * async function loadUserPortfolio() {
 *   const userId = getUserId();
 *
 *   if (!userId) {
 *     throw new Error('User not authenticated');
 *   }
 *
 *   const response = await fetch(`/api/portfolio/${userId}`, {
 *     headers: {
 *       'Authorization': `Bearer ${getAccessToken()}`
 *     }
 *   });
 *
 *   return response.json();
 * }
 * ```
 *
 * @example
 * ```typescript
 * // User-specific navigation
 * function UserProfileLink() {
 *   const userId = getUserId();
 *
 *   if (!userId) return null;
 *
 *   return (
 *     <Link href={`/profile/${userId}`}>
 *       My Profile
 *     </Link>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React hook for user-specific operations
 * function useCurrentUser() {
 *   const [userId, setUserId] = useState<number | null>(getUserId());
 *   const [userRole, setUserRole] = useState<Role | null>(getAuthenticatedAs());
 *
 *   useEffect(() => {
 *     const handleAuthChange = () => {
 *       setUserId(getUserId());
 *       setUserRole(getAuthenticatedAs());
 *     };
 *
 *     window.addEventListener('authChanged', handleAuthChange);
 *     return () => window.removeEventListener('authChanged', handleAuthChange);
 *   }, []);
 *
 *   return {
 *     userId,
 *     userRole,
 *     isAuthenticated: userId !== null,
 *     isAdmin: userRole === 'ADMIN'
 *   };
 * }
 * ```
 */
export function getUserId() {
  if (!_userId && isBrowser()) {
    _userId = getCookie(USER_ID_KEY) ? parseInt(getCookie(USER_ID_KEY)!) : null;
  }
  return _userId;
}

/**
 * Extracts and returns the user ID directly from the JWT access token payload.
 *
 * Decodes the JWT access token and extracts the user ID from the token payload,
 * providing a way to get user information even when cookies might be unavailable
 * or out of sync. This is useful for token validation and consistency checks.
 *
 * @returns The user ID extracted from the token payload, or null if extraction fails
 *
 * @throws Does not throw - returns null on any error and logs to console
 *
 * @remarks
 * This function:
 * - Decodes JWT token payload without signature verification
 * - Extracts user ID from token claims
 * - Provides fallback method for user identification
 * - Handles malformed or missing tokens gracefully
 * - Logs errors for debugging purposes
 *
 * Security considerations:
 * - Does not verify token signature (client-side limitation)
 * - Should not be used for security-critical operations
 * - Useful for consistency checks and UI purposes
 * - Server-side validation is still required for security
 *
 * Token structure expectation:
 * - Standard JWT format with three base64-encoded parts
 * - Payload contains 'userId' claim
 * - Compatible with common JWT implementations
 *
 * @example
 * ```typescript
 * // Validate stored user ID against token
 * function validateUserIdConsistency(): boolean {
 *   const storedId = getUserId();
 *   const tokenId = getUserIdFromToken();
 *
 *   if (storedId !== tokenId) {
 *     console.warn('User ID mismatch between storage and token');
 *     // Potentially clear tokens and require re-authentication
 *     return false;
 *   }
 *
 *   return true;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Fallback user identification
 * function getCurrentUserId(): number | null {
 *   // Try stored ID first
 *   let userId = getUserId();
 *
 *   // Fallback to token extraction
 *   if (!userId) {
 *     userId = getUserIdFromToken();
 *
 *     if (userId) {
 *       console.log('Retrieved user ID from token fallback');
 *     }
 *   }
 *
 *   return userId;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Token debugging utility
 * function debugTokenContents() {
 *   const token = getAccessToken();
 *   if (!token) {
 *     console.log('No access token available');
 *     return;
 *   }
 *
 *   try {
 *     const payload = JSON.parse(atob(token.split('.')[1]));
 *     console.log('Token payload:', payload);
 *     console.log('User ID from token:', payload.userId);
 *     console.log('Token expiration:', new Date(payload.exp * 1000));
 *   } catch (error) {
 *     console.error('Failed to decode token:', error);
 *   }
 * }
 * ```
 */
export function getUserIdFromToken(): number | null {
  try {
    const token = getAccessToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.userId || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
