/**
 * @fileoverview User Management Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Role } from "./auth";

/**
 * User creation data transfer object for new user registration.
 *
 * Contains all required and optional fields for creating a new user
 * account, including authentication credentials and role assignments.
 *
 * @interface CreateUserDTO
 * @property {number} [id] - Optional user ID for specific assignment
 * @property {string} username - Unique username for the account
 * @property {string} password - User's password (will be hashed)
 * @property {string} passcode - Additional security passcode
 * @property {Role[]} [roles] - Array of roles (defaults to ROLE_USER)
 *
 * @example
 * ```typescript
 * const newUser: CreateUserDTO = {
 *   username: "trader123",
 *   password: "SecurePassword123!",
 *   passcode: "PIN1234",
 *   roles: ["ROLE_USER"]
 * };
 * ```
 */
export interface CreateUserDTO {
  id?: number;
  username: string;
  password: string;
  passcode: string;
  roles?: Role[];
}

/**
 * User update data transfer object for profile modifications.
 *
 * Contains optional fields for updating existing user accounts.
 * All fields are optional to support partial updates.
 *
 * @interface UpdateUserDTO
 * @property {string} [username] - New username (must be unique)
 * @property {string} [password] - New password (will be hashed)
 *
 * @example
 * ```typescript
 * const usernameUpdate: UpdateUserDTO = {
 *   username: "newUsername123"
 * };
 *
 * const passwordUpdate: UpdateUserDTO = {
 *   password: "NewSecurePassword456!"
 * };
 * ```
 */
export interface UpdateUserDTO {
  username?: string;
  password?: string;
}

/**
 * User data transfer object for user information display.
 *
 * Represents complete user information without sensitive data.
 * Used for user profiles and admin user management.
 *
 * @interface UserDTO
 * @property {number} id - Unique user identifier
 * @property {string} username - User's display username
 * @property {Role[]} roles - Array of roles assigned to the user
 *
 * @example
 * ```typescript
 * const regularUser: UserDTO = {
 *   id: 123,
 *   username: "trader123",
 *   roles: ["ROLE_USER"]
 * };
 *
 * const adminUser: UserDTO = {
 *   id: 1,
 *   username: "admin",
 *   roles: ["ROLE_ADMIN", "ROLE_USER"]
 * };
 * ```
 */
export interface UserDTO {
  id: number;
  username: string;
  roles: Role[];
}
