import type { NavItem, Role } from "@/types";

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

export function filterNavItemsForView(
  items: NavItem[],
  isDashboard: boolean
): NavItem[] {
  return items.filter((item) => !(isDashboard && item.hideOnDashboard));
}
