"use client";

import React from "react";
import PasswordInput from "@/components/input/PasswordInput";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import StatusMessage from "@/components/status/StatusMessage";
import type { BaseComponentProps } from "@/types/components";

export interface LoginFormProps extends BaseComponentProps {
  usernameOrEmail: string;
  setUsernameOrEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  error: string | null;
  success: string | null;
  isLoggingIn: boolean;
  onSubmit: () => void;
  onFlipToRegister: () => void;
}

export default function LoginForm({
  usernameOrEmail,
  setUsernameOrEmail,
  password,
  setPassword,
  error,
  success,
  isLoggingIn,
  onSubmit,
  onFlipToRegister,
}: LoginFormProps) {
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
          placeholder="Email or Username"
          value={usernameOrEmail}
          onChange={setUsernameOrEmail}
          className="my-2"
        />
        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={setPassword}
          className="my-2"
        />

        <div className="mt-auto flex flex-col">
          <div className="mb-2 h-[54px] overflow-hidden flex items-center">
            {(error || success) && (
              <StatusMessage
                message={(error || success) as string}
                type={error ? "error" : "success"}
                className="mb-1 w-full"
              />
            )}
          </div>
          <NeumorphicButton
            type="submit"
            onClick={onSubmit}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </NeumorphicButton>
        </div>
      </div>
    </form>
  );
}
