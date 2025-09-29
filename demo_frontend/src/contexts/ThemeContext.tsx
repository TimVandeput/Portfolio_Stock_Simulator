"use client";

import React, { createContext, useContext } from "react";
import type { ThemeContextType } from "@/types/theme";
import { useDarkmodeSettings } from "@/hooks/useDarkmodeSettings";

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark, toggleTheme } = useDarkmodeSettings();

  if (isDark === undefined) return null;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
