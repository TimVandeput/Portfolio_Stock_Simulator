export type Role = "ROLE_USER" | "ROLE_ADMIN";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegistrationResponse {
  id: number;
  username: string;
  roles: Role[];
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  userId: number;
  username: string;
  roles: Role[];
  authenticatedAs: Role;
}
