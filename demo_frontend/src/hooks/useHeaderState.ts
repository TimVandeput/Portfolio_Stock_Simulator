/**
 * @fileoverview Header state management hook for navigation and UI controls.
 *
 * This hook manages header component state including navigation visibility,
 * role-based filtering, and contextual UI elements based on current route.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { filterNavItemsByRole, filterNavItemsForView } from "@/lib/utils";
import navItems from "@/lib/constants/navItems";

/**
 * Hook for managing header component state and navigation visibility.
 *
 * @param pathname - Current page pathname for contextual header state
 * @returns Header configuration object with navigation items and visibility settings
 */
export function useHeaderState(pathname: string) {
  const { role } = useAuth();

  const hideLogout = pathname === "/";
  const hideNav = pathname === "/home" || hideLogout;
  const hideHamburger = pathname === "/home" || hideLogout;
  const isDashboard = pathname === "/home";
  const isHomePage = pathname === "/" || pathname === "/home";

  const filteredNavItems = useMemo(
    () => filterNavItemsByRole(navItems, role),
    [role]
  );

  const filteredForView = useMemo(
    () => filterNavItemsForView(filteredNavItems, isDashboard),
    [filteredNavItems, isDashboard]
  );

  return {
    hideLogout,
    hideNav,
    hideHamburger,
    isDashboard,
    isHomePage,
    filteredNavItems,
    filteredForView,
  };
}
