export interface CreateUserDTO {
  id?: number;
  username: string;
  password: string;
  passcode: string;
  roles?: ("ROLE_USER" | "ROLE_ADMIN")[];
}

export interface UpdateUserDTO {
  username?: string;
  password?: string;
}

export interface UserDTO {
  id: number;
  username: string;
  roles: ("ROLE_USER" | "ROLE_ADMIN")[];
}
