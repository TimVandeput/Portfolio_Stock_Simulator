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
      <p className="role-selector-title text-blue-300 text-sm mb-2 font-medium text-justify">
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
            ${
              selectedRole === "ROLE_USER"
                ? "bg-[#d9e6f9] text-blue-600 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.15),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
                : "bg-[#e0e5ec] text-blue-400 shadow-[3px_3px_8px_rgba(0,0,0,0.15),-3px_-3px_8px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_6px_rgba(0,0,0,0.2),-2px_-2px_6px_rgba(255,255,255,0.8)]"
            }
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
            ${
              selectedRole === "ROLE_ADMIN"
                ? "bg-[#d9e6f9] text-blue-600 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.15),inset_-2px_-2px_5px_rgba(255,255,255,0.8)]"
                : "bg-[#e0e5ec] text-blue-400 shadow-[3px_3px_8px_rgba(0,0,0,0.15),-3px_-3px_8px_rgba(255,255,255,0.7)] hover:shadow-[2px_2px_6px_rgba(0,0,0,0.2),-2px_-2px_6px_rgba(255,255,255,0.8)]"
            }
          `}
        >
          Admin
        </button>
      </div>
    </div>
  );
}
