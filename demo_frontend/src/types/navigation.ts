/**
 * @fileoverview Navigation Menu Type Definitions and Item Structures
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Role } from "./auth";

/**
 * Navigation menu item structure with role-based access control.
 *
 * Defines the structure for navigation menu items including display properties,
 * routing information, and access control settings. Supports role-based filtering
 * and context-aware visibility for different application views.
 *
 * @typedef {Object} NavItem
 * @property {string} name - Display name for the navigation item
 * @property {string} href - URL path or route for navigation
 * @property {string | null} [icon] - Icon identifier for visual representation
 * @property {boolean} [hideOnDashboard] - Whether to hide this item on dashboard pages
 * @property {Role[]} [allowedRoles] - Roles permitted to see this navigation item
 *
 * @example
 * ```typescript
 * // Public navigation item
 * const homeNav: NavItem = {
 *   name: "Home",
 *   href: "/",
 *   icon: "home"
 * };
 *
 * // Role-restricted navigation
 * const adminNav: NavItem = {
 *   name: "Admin Panel",
 *   href: "/admin",
 *   icon: "settings",
 *   allowedRoles: ["ROLE_ADMIN"]
 * };
 *
 * // Context-aware navigation
 * const dashboardNav: NavItem = {
 *   name: "Dashboard",
 *   href: "/dashboard",
 *   icon: "dashboard",
 *   hideOnDashboard: true // Hidden when user is already on dashboard
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Navigation menu configuration
 * const navigationItems: NavItem[] = [
 *   {
 *     name: "Home",
 *     href: "/",
 *     icon: "home"
 *   },
 *   {
 *     name: "Portfolio",
 *     href: "/portfolio",
 *     icon: "briefcase",
 *     allowedRoles: ["ROLE_USER", "ROLE_ADMIN"]
 *   },
 *   {
 *     name: "Market",
 *     href: "/market",
 *     icon: "trending-up",
 *     allowedRoles: ["ROLE_USER", "ROLE_ADMIN"]
 *   },
 *   {
 *     name: "Admin",
 *     href: "/admin",
 *     icon: "shield",
 *     allowedRoles: ["ROLE_ADMIN"]
 *   }
 * ];
 * ```
 *
 * @example
 * ```typescript
 * // Dynamic navigation rendering
 * function NavigationMenu({ userRole, currentPath }: { userRole: Role | null; currentPath: string }) {
 *   const isDashboard = currentPath.startsWith('/dashboard');
 *
 *   const visibleItems = navigationItems
 *     .filter(item => !item.allowedRoles || (userRole && item.allowedRoles.includes(userRole)))
 *     .filter(item => !isDashboard || !item.hideOnDashboard);
 *
 *   return (
 *     <nav>
 *       {visibleItems.map(item => (
 *         <NavLink
 *           key={item.href}
 *           href={item.href}
 *           className={currentPath === item.href ? 'active' : ''}
 *         >
 *           {item.icon && <Icon name={item.icon} />}
 *           {item.name}
 *         </NavLink>
 *       ))}
 *     </nav>
 *   );
 * }
 * ```
 */
export type NavItem = {
  name: string;
  href: string;
  icon?: string | null;
  hideOnDashboard?: boolean;
  allowedRoles?: Role[];
};
