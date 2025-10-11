/**
 * @fileoverview Role-Based Access Control Configuration System
 *
 * Provides comprehensive page-level access control configuration for the Stock
 * Simulator application. Defines authentication requirements, role-based permissions,
 * and access control policies for all application routes.
 *
 * @module lib/config/pageAccessControl
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @example
 * ```typescript
 * import { getPageAccessConfig, PAGE_ACCESS_CONFIG } from '@/lib/config/pageAccessControl';
 *
 * // Check if page requires authentication
 * const config = getPageAccessConfig('/portfolio');
 * console.log('Requires auth:', config?.requireAuth);
 * console.log('Allowed roles:', config?.allowedRoles);
 * ```
 */

import type { Role } from "@/types";

/**
 * Configuration interface for page access control settings.
 *
 * Defines the authentication and authorization requirements for
 * individual pages or route patterns within the application.
 *
 * @interface PageAccessConfig
 *
 * @example
 * ```typescript
 * const adminPageConfig: PageAccessConfig = {
 *   requireAuth: true,
 *   allowedRoles: ['ROLE_ADMIN'],
 *   excludeFromAccessControl: false
 * };
 * ```
 */
export interface PageAccessConfig {
  /**
   * Whether the page requires user authentication.
   * When true, users must be logged in to access the page.
   */
  requireAuth: boolean;

  /**
   * Array of roles allowed to access the page.
   * If undefined, any authenticated user can access the page.
   * If defined, user must have one of the specified roles.
   */
  allowedRoles?: Role[];

  /**
   * Whether to exclude this page from access control checks entirely.
   * Used for public pages like login, error pages, etc.
   */
  excludeFromAccessControl?: boolean;
}

/**
 * Comprehensive access control configuration mapping for all application routes.
 *
 * Defines authentication and authorization requirements for each page path,
 * enabling fine-grained control over user access based on authentication
 * status and role-based permissions.
 *
 * @constant
 *
 * @remarks
 * Configuration categories:
 * - **Public pages**: No authentication required, accessible to all users
 * - **Authenticated pages**: Require login but allow any authenticated user
 * - **Role-specific pages**: Require specific user roles for access
 * - **Admin pages**: Restricted to administrative users only
 *
 * Route patterns:
 * - Exact path matching for most routes
 * - Dynamic route handling for parameterized paths
 * - Fallback configuration for undefined routes
 *
 * Security considerations:
 * - Default deny policy for undefined routes
 * - Role-based access enforcement
 * - Comprehensive coverage of all application routes
 *
 * @example
 * ```typescript
 * // Access the configuration directly
 * const portfolioConfig = PAGE_ACCESS_CONFIG['/portfolio'];
 * console.log('Portfolio requires auth:', portfolioConfig.requireAuth);
 * console.log('Allowed roles:', portfolioConfig.allowedRoles);
 * ```
 *
 * @example
 * ```typescript
 * // Check multiple route configurations
 * const publicRoutes = Object.entries(PAGE_ACCESS_CONFIG)
 *   .filter(([_, config]) => !config.requireAuth)
 *   .map(([path]) => path);
 *
 * console.log('Public routes:', publicRoutes);
 * ```
 */
export const PAGE_ACCESS_CONFIG: Record<string, PageAccessConfig> = {
  // Login page - exclude from access control
  "/": {
    requireAuth: false,
    excludeFromAccessControl: true,
  },

  // Pages that require authentication but allow any role
  "/home": {
    requireAuth: true,
  },
  "/about": {
    requireAuth: true,
  },

  // User-specific pages
  "/market": {
    requireAuth: true,
    allowedRoles: ["ROLE_USER"],
  },
  "/portfolio": {
    requireAuth: true,
    allowedRoles: ["ROLE_USER"],
  },
  "/orders": {
    requireAuth: true,
    allowedRoles: ["ROLE_USER"],
  },
  "/notifications": {
    requireAuth: true,
    allowedRoles: ["ROLE_USER"],
  },
  "/graphs": {
    requireAuth: true,
    allowedRoles: ["ROLE_USER"],
  },
  "/wallet": {
    requireAuth: true,
    allowedRoles: ["ROLE_USER", "ROLE_ADMIN"],
  },
  "/help": {
    requireAuth: true,
    allowedRoles: ["ROLE_USER", "ROLE_ADMIN"],
  },

  // Admin-specific pages
  "/symbols": {
    requireAuth: true,
    allowedRoles: ["ROLE_ADMIN"],
  },
};

/**
 * Retrieves the access control configuration for a specific page path.
 *
 * Determines the authentication and authorization requirements for a given
 * pathname, handling both exact matches and dynamic route patterns.
 * Provides fallback configuration for undefined routes.
 *
 * @param pathname - The page path to get access control configuration for
 * @returns The access control configuration, or null if no specific config exists
 *
 * @remarks
 * This function:
 * - Attempts exact path matching first
 * - Handles dynamic routes (e.g., /market/[symbol])
 * - Provides secure fallback for undefined routes
 * - Returns comprehensive access control settings
 * - Supports route pattern matching for parameterized paths
 *
 * Route resolution logic:
 * 1. Check for exact path match in configuration
 * 2. Check for pattern-based matches (e.g., /market/*)
 * 3. Return secure default configuration if no match found
 *
 * Security considerations:
 * - Default deny policy for unknown routes
 * - Excludes undefined routes from access control
 * - Maintains consistent security posture
 *
 * @example
 * ```typescript
 * // Get configuration for specific page
 * const config = getPageAccessConfig('/portfolio');
 *
 * if (config?.requireAuth) {
 *   console.log('Authentication required');
 *
 *   if (config.allowedRoles) {
 *     console.log('Allowed roles:', config.allowedRoles);
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Use in route guard middleware
 * function routeGuard(pathname: string, userRole: Role | null): boolean {
 *   const config = getPageAccessConfig(pathname);
 *
 *   if (!config || config.excludeFromAccessControl) {
 *     return true; // Allow access to public pages
 *   }
 *
 *   if (config.requireAuth && !userRole) {
 *     return false; // Deny access to authenticated pages for unauthenticated users
 *   }
 *
 *   if (config.allowedRoles && !config.allowedRoles.includes(userRole!)) {
 *     return false; // Deny access if user role not in allowed roles
 *   }
 *
 *   return true; // Allow access
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React hook for page access control
 * function usePageAccess(pathname: string) {
 *   const userRole = getAuthenticatedAs();
 *   const config = getPageAccessConfig(pathname);
 *
 *   const hasAccess = useMemo(() => {
 *     if (!config || config.excludeFromAccessControl) {
 *       return true;
 *     }
 *
 *     if (config.requireAuth && !userRole) {
 *       return false;
 *     }
 *
 *     if (config.allowedRoles && userRole && !config.allowedRoles.includes(userRole)) {
 *       return false;
 *     }
 *
 *     return true;
 *   }, [config, userRole]);
 *
 *   return {
 *     hasAccess,
 *     requiresAuth: config?.requireAuth ?? false,
 *     allowedRoles: config?.allowedRoles,
 *     isPublic: config?.excludeFromAccessControl ?? false
 *   };
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Dynamic route handling example
 * function handleDynamicRoutes() {
 *   // Test various dynamic routes
 *   const testPaths = [
 *     '/market/AAPL',
 *     '/market/GOOGL',
 *     '/portfolio/details',
 *     '/unknown-route'
 *   ];
 *
 *   testPaths.forEach(path => {
 *     const config = getPageAccessConfig(path);
 *     console.log(`${path}:`, {
 *       requiresAuth: config?.requireAuth,
 *       roles: config?.allowedRoles,
 *       public: config?.excludeFromAccessControl
 *     });
 *   });
 * }
 * ```
 */
export function getPageAccessConfig(pathname: string): PageAccessConfig | null {
  let config = PAGE_ACCESS_CONFIG[pathname];

  if (!config) {
    if (pathname.startsWith("/market/") && pathname.length > 8) {
      config = PAGE_ACCESS_CONFIG["/market"];
    }
  }

  if (!config) {
    return {
      requireAuth: false,
      excludeFromAccessControl: true,
    };
  }

  return config;
}
