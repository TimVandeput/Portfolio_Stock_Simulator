/**
 * @fileoverview Navigation Items Configuration System
 *
 * Provides comprehensive navigation menu configuration for the Stock Simulator
 * application. Defines navigation structure, role-based visibility, icons,
 * and UI behavior for all primary application routes.
 *
 * @module lib/constants/navItems
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @example
 * ```typescript
 * import { navItems } from '@/lib/constants/navItems';
 * import { filterNavItemsByRole } from '@/lib/utils/navigation';
 *
 * // Filter navigation items by user role
 * const userNavItems = filterNavItemsByRole(navItems, 'ROLE_USER');
 * console.log('User navigation items:', userNavItems.length);
 * ```
 */

import type { NavItem } from "@/types";

/**
 * Comprehensive navigation menu configuration for the Stock Simulator application.
 *
 * Defines the complete navigation structure including page routes, display names,
 * icons, role-based access control, and UI behavior settings. This configuration
 * drives the main navigation menu, mobile drawer, and breadcrumb systems.
 *
 * @constant
 *
 * @remarks
 * Navigation structure features:
 * - **Role-based visibility**: Items filtered by user permissions
 * - **Icon integration**: Consistent iconography across the application
 * - **UI behavior control**: Special display rules and conditions
 * - **Hierarchical organization**: Logical grouping of related functionality
 *
 * Configuration properties:
 * - `name`: Display name for the navigation item
 * - `href`: Target route path for navigation
 * - `icon`: Icon identifier for UI rendering
 * - `allowedRoles`: User roles permitted to see this item
 * - `hideOnDashboard`: Whether to hide on specific pages
 *
 * Access control integration:
 * - Seamlessly integrates with role-based access control
 * - Filters navigation based on user permissions
 * - Maintains security through visibility control
 * - Supports dynamic menu generation
 *
 * @example
 * ```typescript
 * // Access navigation configuration
 * console.log('Total navigation items:', navItems.length);
 *
 * // Find specific navigation item
 * const portfolioItem = navItems.find(item => item.href === '/portfolio');
 * console.log('Portfolio navigation:', portfolioItem);
 * ```
 *
 * @example
 * ```typescript
 * // Filter by role for navigation menu
 * function getNavigationForRole(userRole: Role): NavItem[] {
 *   return navItems.filter(item =>
 *     item.allowedRoles.includes(userRole)
 *   );
 * }
 *
 * const adminNav = getNavigationForRole('ROLE_ADMIN');
 * const userNav = getNavigationForRole('ROLE_USER');
 * ```
 *
 * @example
 * ```typescript
 * // React navigation menu component
 * function NavigationMenu({ userRole }: { userRole: Role }) {
 *   const visibleItems = navItems.filter(item =>
 *     item.allowedRoles.includes(userRole)
 *   );
 *
 *   return (
 *     <nav className="navigation-menu">
 *       {visibleItems.map(item => (
 *         <NavLink
 *           key={item.href}
 *           href={item.href}
 *           icon={item.icon}
 *           className={`nav-item ${item.hideOnDashboard ? 'hide-on-dashboard' : ''}`}
 *         >
 *           {item.name}
 *         </NavLink>
 *       ))}
 *     </nav>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Dynamic breadcrumb generation
 * function generateBreadcrumbs(currentPath: string): NavItem[] {
 *   const breadcrumbs: NavItem[] = [];
 *
 *   // Find matching navigation item
 *   const currentItem = navItems.find(item => item.href === currentPath);
 *
 *   if (currentItem) {
 *     // Add home breadcrumb
 *     const homeItem = navItems.find(item => item.href === '/home');
 *     if (homeItem && currentPath !== '/home') {
 *       breadcrumbs.push(homeItem);
 *     }
 *
 *     // Add current page breadcrumb
 *     breadcrumbs.push(currentItem);
 *   }
 *
 *   return breadcrumbs;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Mobile navigation with role filtering
 * function MobileNavigation() {
 *   const userRole = getAuthenticatedAs();
 *   const [isOpen, setIsOpen] = useState(false);
 *
 *   const availableItems = navItems.filter(item =>
 *     userRole && item.allowedRoles.includes(userRole)
 *   );
 *
 *   return (
 *     <div className="mobile-nav">
 *       <button onClick={() => setIsOpen(!isOpen)} className="menu-toggle">
 *         <Icon name="menu" />
 *       </button>
 *
 *       {isOpen && (
 *         <div className="mobile-menu">
 *           {availableItems.map(item => (
 *             <MobileNavItem
 *               key={item.href}
 *               item={item}
 *               onNavigate={() => setIsOpen(false)}
 *             />
 *           ))}
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const navItems: NavItem[] = [
  {
    name: "HOME",
    href: "/home",
    icon: "home",
    hideOnDashboard: true,
    allowedRoles: ["ROLE_USER", "ROLE_ADMIN"],
  },
  {
    name: "MARKETS",
    href: "/market",
    icon: "store",
    allowedRoles: ["ROLE_USER"],
  },
  {
    name: "PORTFOLIO",
    href: "/portfolio",
    icon: "briefcase",
    allowedRoles: ["ROLE_USER"],
  },
  {
    name: "ORDERS",
    href: "/orders",
    icon: "shoppingcart",
    allowedRoles: ["ROLE_USER"],
  },
  {
    name: "ANALYTICS",
    href: "/graphs",
    icon: "trending-up",
    allowedRoles: ["ROLE_USER"],
  },
  {
    name: "SYMBOLS",
    href: "/symbols",
    icon: "receipt",
    allowedRoles: ["ROLE_ADMIN"],
  },
  {
    name: "NOTIFICATIONS",
    href: "/notifications",
    icon: "bell",
    allowedRoles: ["ROLE_USER", "ROLE_ADMIN"],
  },
  {
    name: "ABOUT",
    href: "/about",
    icon: "info",
    allowedRoles: ["ROLE_USER", "ROLE_ADMIN"],
  },
  {
    name: "HELP",
    href: "/help",
    icon: "help",
    allowedRoles: ["ROLE_USER", "ROLE_ADMIN"],
  },
];

/**
 * Default export of navigation items configuration.
 *
 * Provides the complete navigation menu structure as the default export
 * for convenient importing in components and utilities that need access
 * to the navigation configuration.
 *
 * @default navItems
 *
 * @example
 * ```typescript
 * // Import as default export
 * import navigationItems from '@/lib/constants/navItems';
 *
 * // Use in navigation component
 * function MainNavigation() {
 *   return (
 *     <nav>
 *       {navigationItems.map(item => (
 *         <NavItem key={item.href} {...item} />
 *       ))}
 *     </nav>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Import with custom name
 * import appNavigation from '@/lib/constants/navItems';
 *
 * // Navigation utilities
 * const getNavItemByPath = (path: string) =>
 *   appNavigation.find(item => item.href === path);
 * ```
 */
export default navItems;
