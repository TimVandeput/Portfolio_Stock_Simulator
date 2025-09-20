export type Role = "ROLE_USER" | "ROLE_ADMIN";

export interface RegisterRequest {
  username: string;
  password: string;
  passcode: string;
}

export interface RegistrationResponse {
  id: number;
  username: string;
  roles: Role[];
}

export interface LoginRequest {
  username: string;
  password: string;
  chosenRole: Role | "USER" | "ADMIN";
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
