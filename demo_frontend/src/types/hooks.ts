import type { Role } from "./auth";

export interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  isLoading: boolean;
}

export interface AccessControlConfig {
  requireAuth: boolean;
  allowedRoles?: Role[];
  redirectTo?: string;
}
