"use client";

import React from "react";
import PasswordInput from "@/components/input/PasswordInput";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import StatusMessage from "@/components/status/StatusMessage";
import type { RegisterFormProps, RegisterStatus } from "@/types/components";

export default function RegisterForm({
  rUser,
  setRUser,
  rPass,
  setRPass,
  rPass2,
  setRPass2,
  rCode,
  setRCode,
  rStatus,
  isRegistering,
  onSubmit,
  onFlipToLogin,
}: RegisterFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}
      className={`
        login-card absolute inset-0 rounded-2xl px-8 py-6 sm:py-8 overflow-hidden
        [backface-visibility:hidden] flex flex-col h-full
        transition-shadow duration-500
      `}
      style={{
        backgroundColor: "var(--bg-surface)",
        boxShadow: "var(--shadow-large)",
        transform: "rotateY(180deg)",
      }}
    >
      <div className="flex justify-between items-start">
        <h1
          className="login-title text-2xl font-bold"
          style={{ color: "var(--text-secondary)" }}
        >
          Register
        </h1>
        <div
          onClick={() => {
            onFlipToLogin();
          }}
          className="login-link cursor-pointer transition-colors duration-200 text-sm font-medium border-b border-transparent"
          style={{
            color: "var(--text-secondary)",
            borderColor: "transparent",
          }}
        >
          Login →
        </div>
      </div>

      <div className="mt-3 sm:mt-5 flex flex-col flex-1">
        <NeumorphicInput
          type="text"
          placeholder="Username"
          value={rUser}
          onChange={setRUser}
          className="my-2"
        />
        <PasswordInput
          placeholder="Passcode"
          value={rCode}
          onChange={setRCode}
          className="my-2"
        />
        <PasswordInput
          placeholder="Password"
          value={rPass}
          onChange={setRPass}
          className="my-2"
        />
        <PasswordInput
          placeholder="Confirm password"
          value={rPass2}
          onChange={setRPass2}
          className="my-2"
        />

        <div className="mt-auto flex flex-col">
          <div className="mb-2 h-[54px] overflow-hidden flex items-center">
            {rStatus && (
              <StatusMessage
                message={rStatus.message}
                type={rStatus.type}
                className="mb-1 w-full"
              />
            )}
          </div>
          <NeumorphicButton
            type="submit"
            onClick={onSubmit}
            disabled={isRegistering}
          >
            {isRegistering ? "Registering..." : "Register"}
          </NeumorphicButton>
        </div>
      </div>
    </form>
  );
}
