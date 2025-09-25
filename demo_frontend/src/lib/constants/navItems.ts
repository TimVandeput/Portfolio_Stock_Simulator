import type { NavItem } from "@/types";

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
    name: "WALLET",
    href: "/wallet",
    icon: "wallet",
    allowedRoles: ["ROLE_USER"],
  },
  {
    name: "GRAPHS",
    href: "/graphs",
    icon: "trending-up",
    allowedRoles: ["ROLE_USER"],
  },
  {
    name: "USERS",
    href: "/users",
    icon: "users",
    allowedRoles: ["ROLE_ADMIN"],
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

export default navItems;
