import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAccessToken, getAuthenticatedAs } from "@/lib/auth/tokenStorage";
import type { Role } from "@/types";

export interface AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();
      const role = getAuthenticatedAs();

      setAuthState({
        isAuthenticated: !!token,
        role: role,
        isLoading: false,
      });
    };

    checkAuth();

    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  return authState;
}

export interface AccessControlConfig {
  requireAuth: boolean;
  allowedRoles?: Role[];
  redirectTo?: string;
}

export function useAccessControl(config: AccessControlConfig) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const hasAccess = () => {
    if (!config.requireAuth) {
      return { allowed: true };
    }

    if (!auth.isAuthenticated) {
      return {
        allowed: false,
        reason: "login",
        message: "You need to log in to access this page.",
      };
    }

    if (config.allowedRoles && config.allowedRoles.length > 0) {
      if (!auth.role || !config.allowedRoles.includes(auth.role)) {
        return {
          allowed: false,
          reason: "role",
          message: `You don't have permission to access this page. ${
            config.allowedRoles.includes("ROLE_ADMIN") ? "Admin" : "User"
          } access required.`,
        };
      }
    }

    return { allowed: true };
  };

  const accessResult = hasAccess();

  useEffect(() => {
    if (!auth.isLoading && !accessResult.allowed && config.redirectTo) {
      router.push(config.redirectTo);
    }
  }, [auth.isLoading, accessResult.allowed, config.redirectTo, router]);

  return {
    ...auth,
    hasAccess: accessResult.allowed,
    accessError: accessResult.allowed
      ? null
      : {
          reason: accessResult.reason as "login" | "role",
          message: accessResult.message || "Access denied",
        },
  };
}
