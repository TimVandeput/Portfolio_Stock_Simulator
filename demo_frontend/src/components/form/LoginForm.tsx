"use client";

import React from "react";
import PasswordInput from "@/components/input/PasswordInput";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import StatusMessage from "@/components/status/StatusMessage";
import RoleSelector from "@/components/button/RoleSelector";
import type { Role } from "@/types";

type Props = {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string;
  success: string;
  selectedRole: Role;
  setSelectedRole: (r: Role) => void;
  isLoggingIn: boolean;
  onSubmit: () => void | Promise<void>;
  onFlipToRegister: () => void;
};

export default function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  error,
  success,
  selectedRole,
  setSelectedRole,
  isLoggingIn,
  onSubmit,
  onFlipToRegister,
}: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}
      className={`
        login-card login-card-front absolute inset-0 rounded-2xl px-8 py-6 sm:py-8 overflow-hidden
        [backface-visibility:hidden] flex flex-col h-full
        transition-shadow duration-500
      `}
    >
      <div className="flex justify-between items-start">
        <h1 className="login-title text-2xl font-bold text-secondary">Login</h1>
        <div
          onClick={() => {
            onFlipToRegister();
          }}
          className="login-link cursor-pointer transition-colors duration-200 text-sm font-medium border-b border-transparent"
          style={{
            color: "var(--text-secondary)",
            borderColor: "transparent",
          }}
        >
          Register →
        </div>
      </div>

      <div className="mt-3 sm:mt-5 flex flex-col flex-1">
        <NeumorphicInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={setUsername}
          className="my-2"
        />
        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={setPassword}
          className="my-2"
        />
        <RoleSelector
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          className="my-2"
        />

        <div className="mt-auto flex flex-col">
          <div className="mb-2 h-[54px] overflow-hidden flex items-center">
            {error && <StatusMessage message={error} className="mb-1 w-full" />}
            {success && (
              <StatusMessage message={success} type="success" className="mb-1 w-full" />
            )}
          </div>
          <NeumorphicButton type="submit" onClick={onSubmit} disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </NeumorphicButton>
        </div>
      </div>
    </form>
  );
}
