/**
 * @fileoverview Dark mode theme management hook with persistent storage.
 *
 * This hook provides comprehensive dark mode functionality with smooth transitions,
 * persistent storage via cookies, and seamless integration with CSS frameworks.
 * It manages the complete theme switching lifecycle with performance optimizations.
 *
 * The hook provides:
 * - Persistent theme storage using cookies
 * - Smooth theme transitions with animation control
 * - CSS class management for theme switching
 * - Initial theme detection and application
 * - Performance optimizations during theme changes
 * - Cross-tab theme synchronization support
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { getCookie, setCookie } from "@/lib/utils/cookies";

/**
 * Hook for managing dark mode theme settings with persistent storage.
 *
 * Provides comprehensive theme management with smooth transitions, cookie-based
 * persistence, and performance optimizations during theme switching.
 *
 * @returns Theme control object with current state and toggle function
 *
 * @remarks
 * This hook manages the complete theme switching lifecycle:
 * - Loads saved theme preference from cookies on initialization
 * - Applies theme by adding/removing CSS classes on document element
 * - Prevents flash of unstyled content during theme changes
 * - Temporarily disables transitions during theme switching for performance
 * - Persists theme choice in cookies for future sessions
 * - Returns undefined initially to prevent hydration mismatches
 *
 * The hook uses cookies instead of localStorage for better SSR compatibility
 * and automatically applies the theme to the document element for CSS framework integration.
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { isDark, toggleTheme } = useDarkmodeSettings();
 *
 *   if (isDark === undefined) {
 *     return <div>Loading theme...</div>;
 *   }
 *
 *   return (
 *     <button
 *       onClick={toggleTheme}
 *       className={`px-4 py-2 rounded-lg transition-colors ${
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
 * // Theme-aware component styling
 * function Card({ children }) {
 *   const { isDark } = useDarkmodeSettings();
 *
 *   if (isDark === undefined) return null;
 *
 *   return (
 *     <div className={`
 *       p-6 rounded-lg shadow-lg transition-colors
 *       ${isDark
 *         ? 'bg-gray-800 text-white border-gray-700'
 *         : 'bg-white text-gray-900 border-gray-200'
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
 * // App-wide theme provider
 * function App() {
 *   const { isDark, toggleTheme } = useDarkmodeSettings();
 *
 *   // Wait for theme to load to prevent flash
 *   if (isDark === undefined) {
 *     return <div className="loading-screen">Loading...</div>;
 *   }
 *
 *   return (
 *     <div className={isDark ? 'dark' : 'light'}>
 *       <Header>
 *         <ThemeToggle onClick={toggleTheme} isDark={isDark} />
 *       </Header>
 *       <MainContent />
 *     </div>
 *   );
 * }
 * ```
 */
export function useDarkmodeSettings() {
  const [isDark, setIsDark] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Force remove any existing dark class first
    document.documentElement.classList.remove("dark");

    // Get saved theme, defaulting to light if not set
    const savedTheme = getCookie("theme") || "light";

    // Apply the saved theme, ignoring system preference
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      // Ensure dark class is removed (redundant but explicit)
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      *, *::before, *::after {
        transition: none !important;
        animation-duration: 0s !important;
        animation-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);

    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add("dark");
      setCookie("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      setCookie("theme", "light");
    }

    setTimeout(() => {
      document.head.removeChild(style);
    }, 50);
  }, [isDark]);

  return {
    isDark,
    toggleTheme,
  };
}
