"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
        className="password-input w-full p-3 pr-12 rounded-xl border-none 
          bg-[#e4e8f0] 
          shadow-[inset_1px_1px_3px_rgba(0,0,0,0.2),inset_-1px_-1px_3px_rgba(255,255,255,0.6)]
          focus:outline-none 
          focus:bg-[#e0e4ec] 
          text-blue-400 placeholder-blue-300"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="password-toggle-button absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-blue-400 transition-colors"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
