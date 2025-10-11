/**
 * @fileoverview React Hooks Type Definitions and State Interfaces
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Role } from "./auth";

/**
 * Authentication state interface for auth-related hooks.
 *
 * Represents the current authentication status and user information
 * managed by authentication hooks like useAuth. Provides a consistent
 * state structure for authentication state management across components.
 *
 * @interface AuthState
 * @property {boolean} isAuthenticated - Whether the user is currently authenticated
 * @property {Role | null} role - Current user's role, null if not authenticated
 * @property {boolean} isLoading - Whether authentication state is being determined
 *
 * @example
 * ```typescript
 * // Auth hook implementation
 * function useAuth(): AuthState {
 *   const [authState, setAuthState] = useState<AuthState>({
 *     isAuthenticated: false,
 *     role: null,
 *     isLoading: true
 *   });
 *
 *   useEffect(() => {
 *     checkAuthStatus();
 *   }, []);
 *
 *   return authState;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Using auth state in components
 * function ProtectedComponent() {
 *   const { isAuthenticated, role, isLoading } = useAuth();
 *
 *   if (isLoading) {
 *     return <LoadingSpinner />;
 *   }
 *
 *   if (!isAuthenticated) {
 *     return <LoginPrompt />;
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Welcome, {role} user!</h1>
 *       {role === 'ROLE_ADMIN' && <AdminPanel />}
 *     </div>
 *   );
 * }
 * ```
 */
export interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  isLoading: boolean;
}

/**
 * Access control configuration for page and component level authorization.
 *
 * Defines authorization requirements for pages or components, including
 * authentication requirements, role restrictions, and redirect behavior.
 * Used by access control hooks and route guards for security enforcement.
 *
 * @interface AccessControlConfig
 * @property {boolean} requireAuth - Whether authentication is required for access
 * @property {Role[]} [allowedRoles] - Specific roles allowed access, undefined means all authenticated users
 * @property {string} [redirectTo] - Path to redirect to when access is denied, defaults to login page
 *
 * @example
 * ```typescript
 * // Public page configuration
 * const publicPageConfig: AccessControlConfig = {
 *   requireAuth: false
 * };
 *
 * // User-only page configuration
 * const userPageConfig: AccessControlConfig = {
 *   requireAuth: true,
 *   allowedRoles: ['ROLE_USER', 'ROLE_ADMIN'],
 *   redirectTo: '/login'
 * };
 *
 * // Admin-only page configuration
 * const adminPageConfig: AccessControlConfig = {
 *   requireAuth: true,
 *   allowedRoles: ['ROLE_ADMIN'],
 *   redirectTo: '/unauthorized'
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Access control hook usage
 * function useAccessControl(config: AccessControlConfig) {
 *   const { isAuthenticated, role } = useAuth();
 *   const router = useRouter();
 *
 *   useEffect(() => {
 *     if (config.requireAuth && !isAuthenticated) {
 *       router.push(config.redirectTo || '/login');
 *       return;
 *     }
 *
 *     if (config.allowedRoles && role && !config.allowedRoles.includes(role)) {
 *       router.push(config.redirectTo || '/unauthorized');
 *       return;
 *     }
 *   }, [isAuthenticated, role, config]);
 *
 *   return {
 *     hasAccess: !config.requireAuth || (isAuthenticated && (!config.allowedRoles || (role && config.allowedRoles.includes(role))))
 *   };
 * }
 * ```
 */
export interface AccessControlConfig {
  requireAuth: boolean;
  allowedRoles?: Role[];
  redirectTo?: string;
}
