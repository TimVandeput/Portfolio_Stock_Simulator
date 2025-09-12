import type { Role } from "@/types";

export interface PageAccessConfig {
  requireAuth: boolean;
  allowedRoles?: Role[];
  excludeFromAccessControl?: boolean;
}

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
  "/live": {
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
  "/users": {
    requireAuth: true,
    allowedRoles: ["ROLE_ADMIN"],
  },
};

export function getPageAccessConfig(pathname: string): PageAccessConfig | null {
  const config = PAGE_ACCESS_CONFIG[pathname];

  // If no config found, exclude from access control to allow 404 handling
  if (!config) {
    return {
      requireAuth: false,
      excludeFromAccessControl: true,
    };
  }

  return config;
}
