"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="neu-button p-3 rounded-xl font-bold active:translate-y-0.5 active:duration-75"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Moon size={20} className="text-secondary" />
      ) : (
        <Sun size={20} className="text-primary" />
      )}
    </button>
  );
}
