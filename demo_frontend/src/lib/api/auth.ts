import type {
  RegisterRequest,
  RegistrationResponse,
  LoginRequest,
  AuthResponse,
} from "@/types";
import { HttpClient } from "@/lib/api/http";
import { setTokens, clearTokens } from "@/lib/auth/tokenStorage";

const client = new HttpClient();

export async function register(
  data: RegisterRequest
): Promise<RegistrationResponse> {
  return client.post<RegistrationResponse>("/api/auth/register", data);
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>("/api/auth/login", data);
  setTokens({
    accessToken: res.accessToken,
    refreshToken: res.refreshToken,
    authenticatedAs: res.authenticatedAs,
  });
  return res;
}

export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem("auth.refresh");
  if (refreshToken) {
    try {
      await client.post<void>("/api/auth/logout", { refreshToken });
    } catch (error) {
      console.warn(
        "Logout API call failed, but continuing with token cleanup:",
        error
      );
    }
  }

  clearTokens();

  const keysToRemove = [
    "token",
    "refreshToken",
    "accessToken",
    "auth.token",
    "authToken",
    "jwt",
    "bearerToken",
  ];

  keysToRemove.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  });
}
