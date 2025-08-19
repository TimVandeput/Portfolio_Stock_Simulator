import type {
  RegisterRequest,
  RegistrationResponse,
  LoginRequest,
  AuthResponse,
} from "@/types/auth";
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
  // Server requires the refresh token in body
  const refreshToken = localStorage.getItem("auth.refresh");
  if (refreshToken) {
    await client.post<void>("/api/auth/logout", { refreshToken });
  }
  clearTokens();
}
