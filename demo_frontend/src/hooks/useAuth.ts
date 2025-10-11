/**
 * @fileoverview Authentication and access control hooks for the Stock Simulator application.
 *
 * This module provides comprehensive authentication state management and access control functionality.
 * It includes hooks for tracking user authentication status, role-based access control, and automatic
 * redirection based on authentication requirements.
 *
 * The hooks provide:
 * - Real-time authentication state tracking
 * - Role-based access control with granular permissions
 * - Automatic redirection for unauthorized access
 * - Session expiration handling
 * - Cross-tab authentication synchronization
 * - Comprehensive error handling and user feedback
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken, getAuthenticatedAs } from "@/lib/auth/tokenStorage";
import type { Role } from "@/types";
import type { AuthState, AccessControlConfig } from "@/types/hooks";

/**
 * Hook for managing authentication state and real-time auth status tracking.
 *
 * Provides comprehensive authentication state management with automatic updates when
 * authentication status changes across tabs or when tokens expire.
 *
 * @returns Authentication state object containing user status and role information
 *
 * @remarks
 * This hook automatically:
 * - Checks authentication status on mount
 * - Listens for storage changes (cross-tab authentication)
 * - Responds to custom authentication events
 * - Updates state when tokens change or expire
 * - Provides loading states during authentication checks
 *
 * The returned AuthState includes:
 * - `isAuthenticated`: Boolean indicating if user is logged in
 * - `role`: Current user role (ROLE_USER, ROLE_ADMIN, etc.) or null
 * - `isLoading`: Boolean indicating if authentication check is in progress
 *
 * @example
 * ```tsx
 * function Dashboard() {
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
 *       <h1>Welcome to Dashboard</h1>
 *       {role === 'ROLE_ADMIN' && <AdminPanel />}
 *       <UserContent />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Conditional rendering based on authentication
 * function Navigation() {
 *   const { isAuthenticated, role } = useAuth();
 *
 *   return (
 *     <nav>
 *       <Link href="/">Home</Link>
 *       {isAuthenticated ? (
 *         <>
 *           <Link href="/portfolio">Portfolio</Link>
 *           <Link href="/market">Market</Link>
 *           {role === 'ROLE_ADMIN' && (
 *             <Link href="/admin">Admin</Link>
 *           )}
 *           <LogoutButton />
 *         </>
 *       ) : (
 *         <Link href="/login">Login</Link>
 *       )}
 *     </nav>
 *   );
 * }
 * ```
 */
export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();
      const role = getAuthenticatedAs();

      setAuthState({
        isAuthenticated: !!token,
        role: role,
        isLoading: false,
      });
    };

    checkAuth();

    const handleStorageChange = () => {
      checkAuth();
    };

    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, []);

  return authState;
}

/**
 * Hook for implementing role-based access control with automatic redirection.
 *
 * Provides comprehensive access control functionality with automatic redirection for
 * unauthorized users and detailed error messaging for access denial reasons.
 *
 * @param config - Access control configuration object
 * @param config.requireAuth - Whether authentication is required for access
 * @param config.allowedRoles - Array of roles allowed to access the resource
 * @param config.redirectTo - URL to redirect to when access is denied
 *
 * @returns Extended authentication state with access control information
 *
 * @remarks
 * This hook extends the basic authentication state with access control logic:
 * - Automatically redirects unauthorized users when redirectTo is provided
 * - Provides detailed error messages for access denial
 * - Handles both authentication and role-based authorization
 * - Supports granular role-based permissions
 * - Logs access control decisions for debugging
 *
 * The returned object includes all AuthState properties plus:
 * - `hasAccess`: Boolean indicating if user has access to the resource
 * - `accessError`: Object containing error details when access is denied
 *
 * @example
 * ```tsx
 * // Protect admin-only page with automatic redirect
 * function AdminDashboard() {
 *   const { hasAccess, accessError, isLoading } = useAccessControl({
 *     requireAuth: true,
 *     allowedRoles: ['ROLE_ADMIN'],
 *     redirectTo: '/login'
 *   });
 *
 *   if (isLoading) return <LoadingSpinner />;
 *
 *   if (!hasAccess) {
 *     return <AccessDenied error={accessError} />;
 *   }
 *
 *   return <AdminContent />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Protect user area with custom handling
 * function UserProfile() {
 *   const auth = useAccessControl({
 *     requireAuth: true,
 *     allowedRoles: ['ROLE_USER', 'ROLE_ADMIN']
 *   });
 *
 *   if (auth.isLoading) return <div>Checking access...</div>;
 *
 *   if (!auth.hasAccess) {
 *     return (
 *       <div>
 *         <h2>Access Denied</h2>
 *         <p>{auth.accessError?.message}</p>
 *         {auth.accessError?.reason === 'login' && (
 *           <button onClick={() => router.push('/login')}>
 *             Go to Login
 *           </button>
 *         )}
 *       </div>
 *     );
 *   }
 *
 *   return <ProfileContent user={auth} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Public page with optional authentication
 * function PublicPage() {
 *   const { isAuthenticated, role } = useAccessControl({
 *     requireAuth: false
 *   });
 *
 *   return (
 *     <div>
 *       <h1>Public Content</h1>
 *       {isAuthenticated ? (
 *         <p>Welcome back, {role}!</p>
 *       ) : (
 *         <p>Please log in for personalized content</p>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAccessControl(config: AccessControlConfig) {
  const auth = useAuth();
  const router = useRouter();

  const hasAccess = () => {
    if (!config.requireAuth) {
      return { allowed: true };
    }

    if (!auth.isAuthenticated) {
      return {
        allowed: false,
        reason: "login",
        message:
          "Please log in to access this page. Your session may have expired.",
      };
    }

    if (config.allowedRoles && config.allowedRoles.length > 0) {
      if (!auth.role || !config.allowedRoles.includes(auth.role)) {
        return {
          allowed: false,
          reason: "role",
          message: `You don't have permission to access this page. ${
            config.allowedRoles.includes("ROLE_ADMIN") ? "Admin" : "User"
          } access required.`,
        };
      }
    }

    return { allowed: true };
  };

  const accessResult = hasAccess();

  useEffect(() => {
    console.log("🔒 useAccessControl effect:", {
      "auth.isLoading": auth.isLoading,
      "accessResult.allowed": accessResult.allowed,
      "config.redirectTo": config.redirectTo,
      "will redirect":
        !auth.isLoading && !accessResult.allowed && config.redirectTo,
    });

    if (!auth.isLoading && !accessResult.allowed && config.redirectTo) {
      console.log("🔄 Auto-redirecting to:", config.redirectTo);
      router.push(config.redirectTo);
    }
  }, [auth.isLoading, accessResult.allowed, config.redirectTo, router]);

  return {
    ...auth,
    hasAccess: accessResult.allowed,
    accessError: accessResult.allowed
      ? null
      : {
          reason: accessResult.reason as "login" | "role",
          message: accessResult.message || "Access denied",
        },
  };
}
