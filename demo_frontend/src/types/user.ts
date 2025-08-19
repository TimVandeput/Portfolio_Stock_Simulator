import type { Role } from "./auth";

export interface CreateUserDTO {
  id?: number;
  username: string;
  password: string;
  passcode: string;
  roles?: Role[];
}

export interface UpdateUserDTO {
  username?: string;
  password?: string;
}

export interface UserDTO {
  id: number;
  username: string;
  roles: Role[];
}
