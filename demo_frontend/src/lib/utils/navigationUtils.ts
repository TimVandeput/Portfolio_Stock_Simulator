/**
 * @fileoverview Navigation Filtering Utilities for Role-Based Access Control
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { NavItem, Role } from "@/types";

/**
 * Filters navigation items based on user role permissions.
 *
 * Implements role-based access control for navigation menus by filtering
 * navigation items according to the user's current role. Handles public items,
 * role-restricted items, and fallback scenarios for unauthenticated users.
 *
 * @param items - Array of navigation items to filter
 * @param userRole - Current user's role, null if unauthenticated
 * @returns Filtered array of navigation items accessible to the user
 *
 * @remarks
 * Filtering logic:
 * - Items without allowedRoles are public (visible to all users)
 * - Items with empty allowedRoles array are public
 * - Null/undefined userRole shows all items (graceful degradation)
 * - Role-restricted items only show if user role is in allowedRoles
 *
 * Role-based filtering patterns:
 * - Public items: { name: "Home", allowedRoles: [] } or no allowedRoles
 * - User-only: { name: "Portfolio", allowedRoles: ["user"] }
 * - Admin-only: { name: "Admin Panel", allowedRoles: ["admin"] }
 * - Multi-role: { name: "Trading", allowedRoles: ["user", "premium"] }
 *
 * Security considerations:
 * - Client-side filtering for UI only (not security enforcement)
 * - Server-side authorization still required for actual access control
 * - Graceful degradation for unauthenticated users
 * - Role validation should occur on route access
 *
 * @example
 * ```typescript
 * // Filter navigation for regular user
 * const userNav = filterNavItemsByRole(allNavItems, "user");
 * // Returns: Home, Portfolio, Market, Orders (excludes Admin Panel)
 * ```
 *
 * @example
 * ```typescript
 * // Filter navigation for admin user
 * const adminNav = filterNavItemsByRole(allNavItems, "admin");
 * // Returns: All items including Admin Panel, User Management
 * ```
 *
 * @example
 * ```typescript
 * // Navigation component with role filtering
 * function Navigation() {
 *   const { user } = useAuth();
 *   const userRole = user?.role || null;
 *
 *   const visibleNavItems = filterNavItemsByRole(
 *     navigationItems,
 *     userRole
 *   );
 *
 *   return (
 *     <nav>
 *       {visibleNavItems.map(item => (
 *         <NavLink
 *           key={item.id}
 *           href={item.href}
 *           icon={item.icon}
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
 * // Dynamic navigation with role changes
 * function DynamicNavigation() {
 *   const { user, isLoading } = useAuth();
 *   const [navItems, setNavItems] = useState<NavItem[]>([]);
 *
 *   useEffect(() => {
 *     if (!isLoading) {
 *       const filteredItems = filterNavItemsByRole(
 *         allNavigationItems,
 *         user?.role || null
 *       );
 *       setNavItems(filteredItems);
 *     }
 *   }, [user?.role, isLoading]);
 *
 *   if (isLoading) {
 *     return <NavigationSkeleton />;
 *   }
 *
 *   return <NavigationMenu items={navItems} />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Navigation with role upgrade handling
 * function handleRoleUpgrade(newRole: Role) {
 *   // Update user context
 *   updateUserRole(newRole);
 *
 *   // Refresh navigation items
 *   const updatedNavItems = filterNavItemsByRole(
 *     allNavigationItems,
 *     newRole
 *   );
 *
 *   // Show new features notification
 *   if (newRole === 'premium') {
 *     showNotification({
 *       title: 'Premium Features Unlocked!',
 *       message: 'You now have access to advanced trading tools.',
 *       type: 'success'
 *     });
 *   }
 *
 *   setNavigationItems(updatedNavItems);
 * }
 * ```
 */
export function filterNavItemsByRole(
  items: NavItem[],
  userRole: Role | null
): NavItem[] {
  return items.filter((item) => {
    if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
    if (!userRole) return true;
    return item.allowedRoles.includes(userRole);
  });
}

/**
 * Filters navigation items based on the current view context.
 *
 * Provides context-aware navigation filtering to show/hide navigation items
 * based on the current page or view state. Primarily handles dashboard-specific
 * navigation logic where certain items should be hidden on dashboard pages.
 *
 * @param items - Array of navigation items to filter
 * @param isDashboard - Whether the current view is a dashboard page
 * @returns Filtered array of navigation items appropriate for the current view
 *
 * @remarks
 * View-based filtering logic:
 * - hideOnDashboard property controls dashboard visibility
 * - Items without hideOnDashboard are shown everywhere
 * - Dashboard pages hide items marked with hideOnDashboard: true
 * - Non-dashboard pages show all items regardless of hideOnDashboard
 *
 * Common use cases:
 * - Hide redundant navigation on dashboard (e.g., "Dashboard" link)
 * - Show condensed navigation for focused views
 * - Context-specific menu organization
 * - Progressive disclosure of navigation options
 *
 * Navigation item configuration:
 * ```typescript
 * const navItem: NavItem = {
 *   name: "Dashboard",
 *   href: "/dashboard",
 *   hideOnDashboard: true  // Hidden when isDashboard = true
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Dashboard navigation (hideOnDashboard items are filtered out)
 * const dashboardNav = filterNavItemsForView(navItems, true);
 * // Result: Portfolio, Market, Orders (excludes Dashboard link)
 * ```
 *
 * @example
 * ```typescript
 * // Regular page navigation (all items shown)
 * const regularNav = filterNavItemsForView(navItems, false);
 * // Result: All items including Dashboard link
 * ```
 *
 * @example
 * ```typescript
 * // Smart navigation component
 * function SmartNavigation() {
 *   const pathname = usePathname();
 *   const isDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard/');
 *
 *   const { user } = useAuth();
 *
 *   // Apply both role and view filtering
 *   const filteredByRole = filterNavItemsByRole(
 *     navigationItems,
 *     user?.role || null
 *   );
 *
 *   const filteredByView = filterNavItemsForView(
 *     filteredByRole,
 *     isDashboard
 *   );
 *
 *   return (
 *     <NavigationMenu
 *       items={filteredByView}
 *       compact={isDashboard}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Navigation with multiple view contexts
 * function ContextualNavigation() {
 *   const pathname = usePathname();
 *   const [viewContext, setViewContext] = useState({
 *     isDashboard: false,
 *     isModal: false,
 *     isMobile: false
 *   });
 *
 *   useEffect(() => {
 *     setViewContext({
 *       isDashboard: pathname.includes('/dashboard'),
 *       isModal: document.body.classList.contains('modal-open'),
 *       isMobile: window.innerWidth < 768
 *     });
 *   }, [pathname]);
 *
 *   let filteredItems = navigationItems;
 *
 *   // Apply view-based filtering
 *   filteredItems = filterNavItemsForView(
 *     filteredItems,
 *     viewContext.isDashboard
 *   );
 *
 *   // Apply additional mobile filtering
 *   if (viewContext.isMobile) {
 *     filteredItems = filteredItems.filter(item => !item.hideOnMobile);
 *   }
 *
 *   return (
 *     <NavigationMenu
 *       items={filteredItems}
 *       layout={viewContext.isMobile ? 'mobile' : 'desktop'}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Breadcrumb navigation with view awareness
 * function BreadcrumbNavigation() {
 *   const pathname = usePathname();
 *   const isDashboard = pathname.startsWith('/dashboard');
 *
 *   // Get navigation items for current view
 *   const contextualNavItems = filterNavItemsForView(
 *     navigationItems,
 *     isDashboard
 *   );
 *
 *   // Build breadcrumb from current path
 *   const breadcrumbs = buildBreadcrumbs(pathname, contextualNavItems);
 *
 *   return (
 *     <nav aria-label="Breadcrumb">
 *       <ol className="breadcrumb">
 *         {breadcrumbs.map((crumb, index) => (
 *           <li key={crumb.href} className={index === breadcrumbs.length - 1 ? 'active' : ''}>
 *             {index < breadcrumbs.length - 1 ? (
 *               <Link href={crumb.href}>{crumb.name}</Link>
 *             ) : (
 *               <span>{crumb.name}</span>
 *             )}
 *           </li>
 *         ))}
 *       </ol>
 *     </nav>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Navigation state management with view filtering
 * function useNavigationState() {
 *   const pathname = usePathname();
 *   const { user } = useAuth();
 *
 *   return useMemo(() => {
 *     const isDashboard = pathname === '/dashboard';
 *     const userRole = user?.role || null;
 *
 *     // Apply role filtering first
 *     let items = filterNavItemsByRole(navigationItems, userRole);
 *
 *     // Then apply view filtering
 *     items = filterNavItemsForView(items, isDashboard);
 *
 *     return {
 *       items,
 *       isDashboard,
 *       userRole,
 *       activeItem: items.find(item => item.href === pathname)
 *     };
 *   }, [pathname, user?.role]);
 * }
 * ```
 */
export function filterNavItemsForView(
  items: NavItem[],
  isDashboard: boolean
): NavItem[] {
  return items.filter((item) => !(isDashboard && item.hideOnDashboard));
}
