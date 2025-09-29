"use client";

import { useState } from "react";
import DynamicIcon from "../ui/DynamicIcon";

interface PasswordInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function PasswordInput({
  placeholder,
  value,
  onChange,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="neumorphic-input w-full p-3 pr-12 rounded-xl border-none focus:outline-none"
        style={{
          boxShadow: "var(--shadow-neu-inset)",
          color: "var(--input-text)",
        }}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="password-toggle-button absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        {showPassword ? (
          <DynamicIcon iconName="eye-off" size={18} />
        ) : (
          <DynamicIcon iconName="eye" size={18} />
        )}
      </button>
    </div>
  );
}
