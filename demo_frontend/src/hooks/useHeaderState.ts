"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { filterNavItemsByRole, filterNavItemsForView } from "@/lib/utils";
import navItems from "@/lib/constants/navItems";

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
