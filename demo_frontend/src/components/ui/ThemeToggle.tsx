"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
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
        <DynamicIcon iconName="moon" size={20} className="text-secondary" />
      ) : (
        <DynamicIcon iconName="sun" size={20} className="text-primary" />
      )}
    </button>
  );
}
