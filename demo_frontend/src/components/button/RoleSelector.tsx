"use client";

import type { Role } from "@/types";

interface RoleSelectorProps {
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
  className?: string;
}

export default function RoleSelector({
  selectedRole,
  onRoleChange,
  className = "",
}: RoleSelectorProps) {
  return (
    <div className={`${className}`}>
      <p
        className="role-selector-title text-sm mb-2 font-medium text-justify"
        style={{ color: "var(--text-secondary)" }}
      >
        Please select your role before logging in. It is recommended to start
        with Admin.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onRoleChange("ROLE_USER")}
          className={`
            role-selector-button
            flex-1 p-3 rounded-xl font-medium text-sm
            transition-all duration-200
            ${selectedRole === "ROLE_USER" ? "role-selected" : "neu-button"}
          `}
        >
          User
        </button>
        <button
          type="button"
          onClick={() => onRoleChange("ROLE_ADMIN")}
          className={`
            role-selector-button
            flex-1 p-3 rounded-xl font-medium text-sm
            transition-all duration-200
            ${selectedRole === "ROLE_ADMIN" ? "role-selected" : "neu-button"}
          `}
        >
          Admin
        </button>
      </div>
    </div>
  );
}
