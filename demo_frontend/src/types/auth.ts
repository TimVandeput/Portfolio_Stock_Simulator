/**
 * @fileoverview Authentication and Authorization Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * User role types for role-based access control (RBAC).
 *
 * Defines the available user roles in the Stock Simulator application,
 * used for authorization, navigation filtering, and feature access control.
 * Each role has different permissions and access levels.
 *
 * @typedef {("ROLE_USER" | "ROLE_ADMIN")} Role
 *
 * @example
 * ```typescript
 * // Check user role for feature access
 * function canAccessAdminPanel(userRole: Role): boolean {
 *   return userRole === "ROLE_ADMIN";
 * }
 *
 * // Filter navigation based on role
 * const userNavItems = navItems.filter(item =>
 *   !item.allowedRoles || item.allowedRoles.includes(userRole)
 * );
 * ```
 */
export type Role = "ROLE_USER" | "ROLE_ADMIN";

/**
 * User registration request payload structure.
 *
 * Contains the required fields for creating a new user account,
 * including username, email for account recovery, and secure password.
 * Used when submitting registration forms to the authentication API.
 *
 * @interface RegisterRequest
 * @property {string} username - Unique username for the account (3-50 characters)
 * @property {string} email - Valid email address for account verification and recovery
 * @property {string} password - Secure password meeting complexity requirements
 *
 * @example
 * ```typescript
 * const registrationData: RegisterRequest = {
 *   username: "trader123",
 *   email: "trader@example.com",
 *   password: "SecurePassword123!"
 * };
 *
 * const response = await authApi.register(registrationData);
 * ```
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * Successful user registration response structure.
 *
 * Contains the newly created user information returned after successful
 * account registration, including assigned user ID and default roles.
 * Used to provide feedback and initialize user state after registration.
 *
 * @interface RegistrationResponse
 * @property {number} id - Unique user identifier assigned by the system
 * @property {string} username - Confirmed username for the new account
 * @property {Role[]} roles - Array of roles assigned to the user (typically ["ROLE_USER"])
 *
 * @example
 * ```typescript
 * // Handle successful registration
 * function handleRegistrationSuccess(response: RegistrationResponse) {
 *   console.log(`User ${response.username} registered with ID ${response.id}`);
 *   console.log(`Assigned roles: ${response.roles.join(', ')}`);
 *
 *   // Redirect to login or auto-login
 *   redirectToLogin();
 * }
 * ```
 */
export interface RegistrationResponse {
  id: number;
  username: string;
  roles: Role[];
}

/**
 * User login request payload structure.
 *
 * Flexible login structure supporting both username and email authentication,
 * allowing users to log in with either their username or email address.
 * Used when submitting login forms to the authentication API.
 *
 * @interface LoginRequest
 * @property {string} usernameOrEmail - Username or email address for authentication
 * @property {string} password - User's password for verification
 *
 * @example
 * ```typescript
 * // Login with username
 * const loginWithUsername: LoginRequest = {
 *   usernameOrEmail: "trader123",
 *   password: "userPassword"
 * };
 *
 * // Login with email
 * const loginWithEmail: LoginRequest = {
 *   usernameOrEmail: "trader@example.com",
 *   password: "userPassword"
 * };
 * ```
 */
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

/**
 * Token refresh request payload structure.
 *
 * Contains the refresh token needed to obtain new access tokens,
 * used for maintaining user sessions without requiring re-authentication.
 * Part of the JWT token refresh flow for secure session management.
 *
 * @interface RefreshRequest
 * @property {string} refreshToken - Valid refresh token for obtaining new access token
 *
 * @example
 * ```typescript
 * // Refresh expired access token
 * async function refreshAccessToken(): Promise<AuthResponse> {
 *   const refreshToken = getStoredRefreshToken();
 *
 *   const refreshRequest: RefreshRequest = {
 *     refreshToken
 *   };
 *
 *   return await authApi.refreshToken(refreshRequest);
 * }
 * ```
 */
export interface RefreshRequest {
  refreshToken: string;
}

/**
 * Complete authentication response structure for login and token refresh.
 *
 * Contains all authentication tokens and user information returned after
 * successful login or token refresh operations. Includes both access and
 * refresh tokens, user details, and role information for session management.
 *
 * @interface AuthResponse
 * @property {string} accessToken - JWT access token for API authentication (short-lived)
 * @property {string} refreshToken - JWT refresh token for obtaining new access tokens (long-lived)
 * @property {"Bearer"} tokenType - Token type for Authorization header (always "Bearer")
 * @property {number} userId - Unique identifier for the authenticated user
 * @property {string} username - Username of the authenticated user
 * @property {Role[]} roles - Array of all roles assigned to the user
 * @property {Role} authenticatedAs - Current active role for this session
 *
 * @example
 * ```typescript
 * // Handle successful authentication
 * function handleAuthSuccess(authResponse: AuthResponse) {
 *   // Store tokens securely
 *   setTokens({
 *     accessToken: authResponse.accessToken,
 *     refreshToken: authResponse.refreshToken
 *   });
 *
 *   // Update user context
 *   setUser({
 *     id: authResponse.userId,
 *     username: authResponse.username,
 *     roles: authResponse.roles,
 *     currentRole: authResponse.authenticatedAs
 *   });
 *
 *   // Set up authorization header
 *   httpClient.setAuthHeader(`${authResponse.tokenType} ${authResponse.accessToken}`);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Token refresh handling
 * async function handleTokenRefresh(response: AuthResponse) {
 *   // Update stored tokens
 *   updateStoredTokens({
 *     accessToken: response.accessToken,
 *     refreshToken: response.refreshToken
 *   });
 *
 *   // Update HTTP client authorization
 *   apiClient.updateAuthToken(response.accessToken);
 *
 *   console.log(`Refreshed tokens for user: ${response.username}`);
 * }
 * ```
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  userId: number;
  username: string;
  roles: Role[];
  authenticatedAs: Role;
}
