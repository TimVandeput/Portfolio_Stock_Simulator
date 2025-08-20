"use client";

import { Lightbulb, LightbulbOff } from "lucide-react";
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
        <Lightbulb size={20} style={{ color: "var(--text-secondary)" }} />
      ) : (
        <LightbulbOff size={20} style={{ color: "var(--text-primary)" }} />
      )}
    </button>
  );
}
