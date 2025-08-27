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
    <div className={className}>
      <div className="flex w-full justify-center">
        <div className="flex bg-[var(--bg-surface)] rounded-xl shadow-[var(--shadow-neu)] p-1 gap-1 w-full max-w-[340px] h-[48px]">
          <button
            type="button"
            onClick={() => onRoleChange("ROLE_USER")}
            className={`flex-1 h-full px-4 py-2 rounded-xl font-medium text-sm transition-all duration-150
              ${
                selectedRole === "ROLE_USER"
                  ? "bg-[var(--btn-hover)] text-[var(--btn-text)] shadow-[var(--shadow-neu-inset)]"
                  : "bg-transparent text-[var(--btn-text)] hover:bg-[var(--btn-hover)] hover:shadow-[var(--shadow-neu-hover)]"
              }
            `}
            style={{ outline: "none", border: "none" }}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => onRoleChange("ROLE_ADMIN")}
            className={`flex-1 h-full px-4 py-2 rounded-xl font-medium text-sm transition-all duration-150
              ${
                selectedRole === "ROLE_ADMIN"
                  ? "bg-[var(--btn-hover)] text-[var(--btn-text)] shadow-[var(--shadow-neu-inset)]"
                  : "bg-transparent text-[var(--btn-text)] hover:bg-[var(--btn-hover)] hover:shadow-[var(--shadow-neu-hover)]"
              }
            `}
            style={{ outline: "none", border: "none" }}
          >
            Admin
          </button>
        </div>
      </div>
      <p className="role-selector-title text-sm mt-3 font-medium text-center text-secondary">
        Please select your role before logging in.
        <br />
        It is recommended to start with Admin.
      </p>
    </div>
  );
}
