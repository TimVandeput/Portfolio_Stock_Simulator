/**
 * @fileoverview Theme context provider for the Stock Simulator application.
 *
 * This context manages the global theme state, providing dark/light mode functionality
 * throughout the application. It integrates with the dark mode settings hook to persist
 * user preferences and applies theme changes across all components.
 *
 * The context provides:
 * - Current theme state (dark/light mode)
 * - Theme toggle functionality
 * - Persistent theme preferences
 * - System theme detection and integration
 * - Automatic theme application across components
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import React, { createContext, useContext } from "react";
import type { ThemeContextType } from "@/types/theme";
import { useDarkmodeSettings } from "@/hooks/useDarkmodeSettings";

/**
 * React context for managing theme state throughout the application.
 *
 * Provides centralized theme management with persistent storage and system theme detection.
 * The context automatically syncs with user preferences and system settings.
 *
 * @remarks
 * This context handles:
 * - Dark/light mode switching
 * - Persistent theme storage in localStorage
 * - System theme preference detection
 * - Automatic theme application to document classes
 * - Theme state synchronization across components
 *
 * @example
 * ```tsx
 * // Using the context to get current theme
 * const { isDark, toggleTheme } = useTheme();
 *
 * // Apply theme-specific styling
 * const buttonClass = isDark ? 'bg-gray-800 text-white' : 'bg-white text-black';
 *
 * // Toggle theme on user action
 * <button onClick={toggleTheme}>
 *   {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
 * </button>
 * ```
 */
const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

/**
 * Provider component that manages theme state and makes it available to child components.
 *
 * This component integrates with the dark mode settings hook to provide persistent theme
 * management and automatic system theme detection.
 *
 * @param props - The provider props
 * @param props.children - Child components that will have access to the theme context
 *
 * @returns The provider component wrapping children with theme context, or null during initialization
 *
 * @remarks
 * The provider:
 * - Uses localStorage to persist theme preferences
 * - Detects system theme preferences automatically
 * - Applies theme classes to the document element
 * - Returns null during initialization to prevent hydration mismatches
 * - Provides theme state and toggle function to all children
 *
 * @example
 * ```tsx
 * // Wrap your app with the theme provider
 * function App() {
 *   return (
 *     <ThemeProvider>
 *       <Header />
 *       <MainContent />
 *       <Footer />
 *     </ThemeProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Provider at the root level
 * function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ThemeProvider>
 *           {children}
 *         </ThemeProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark, toggleTheme } = useDarkmodeSettings();

  if (isDark === undefined) return null;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the theme context data and functionality.
 *
 * Provides access to the current theme state and theme toggle function.
 * Can be used anywhere within the ThemeProvider component tree.
 *
 * @returns The theme context value containing theme state and controls
 *
 * @remarks
 * This hook provides:
 * - `isDark`: Boolean indicating if dark mode is currently active
 * - `toggleTheme`: Function to switch between dark and light modes
 *
 * The theme state is automatically persisted and synchronized across the application.
 *
 * @example
 * ```tsx
 * function ThemeToggleButton() {
 *   const { isDark, toggleTheme } = useTheme();
 *
 *   return (
 *     <button
 *       onClick={toggleTheme}
 *       className={`px-4 py-2 rounded ${
 *         isDark
 *           ? 'bg-yellow-500 text-black hover:bg-yellow-400'
 *           : 'bg-gray-800 text-white hover:bg-gray-700'
 *       }`}
 *     >
 *       {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Apply theme-based conditional styling
 * function Card({ children }) {
 *   const { isDark } = useTheme();
 *
 *   return (
 *     <div className={`
 *       p-4 rounded-lg shadow-lg
 *       ${isDark
 *         ? 'bg-gray-800 text-white border-gray-700'
 *         : 'bg-white text-black border-gray-200'
 *       }
 *     `}>
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Use theme in complex components
 * function Dashboard() {
 *   const { isDark, toggleTheme } = useTheme();
 *
 *   const chartConfig = {
 *     backgroundColor: isDark ? '#1f2937' : '#ffffff',
 *     textColor: isDark ? '#f9fafb' : '#111827',
 *     gridColor: isDark ? '#374151' : '#e5e7eb'
 *   };
 *
 *   return (
 *     <div className={isDark ? 'dark' : 'light'}>
 *       <Chart config={chartConfig} />
 *       <button onClick={toggleTheme}>Toggle Theme</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme() {
  return useContext(ThemeContext);
}
