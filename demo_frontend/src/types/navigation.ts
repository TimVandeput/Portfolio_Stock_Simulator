import type { Role } from "./auth";

export type NavItem = {
  name: string;
  href: string;
  icon?: string | null;
  hideOnDashboard?: boolean;
  allowedRoles?: Role[];
};
