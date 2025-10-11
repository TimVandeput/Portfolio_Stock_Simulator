/**
 * @fileoverview Theme Management Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * Theme context type for React context provider.
 *
 * Defines the structure of the theme context used throughout the
 * application for managing dark/light mode preferences. Provides
 * theme state and toggle functionality for consistent theming.
 *
 * @interface ThemeContextType
 * @property {boolean} isDark - Whether dark theme is currently active
 * @property {() => void} toggleTheme - Function to switch between light/dark themes
 *
 * @example
 * ```typescript
 * // Theme context provider
 * function ThemeProvider({ children }: { children: React.ReactNode }) {
 *   const [isDark, setIsDark] = useState(false);
 *
 *   const toggleTheme = () => {
 *     setIsDark(prev => !prev);
 *     // Persist theme preference
 *     localStorage.setItem('theme', (!isDark) ? 'dark' : 'light');
 *   };
 *
 *   const contextValue: ThemeContextType = {
 *     isDark,
 *     toggleTheme
 *   };
 *
 *   return (
 *     <ThemeContext.Provider value={contextValue}>
 *       <div className={isDark ? 'dark-theme' : 'light-theme'}>
 *         {children}
 *       </div>
 *     </ThemeContext.Provider>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Theme toggle component
 * function ThemeToggle() {
 *   const { isDark, toggleTheme } = useContext(ThemeContext);
 *
 *   return (
 *     <button
 *       onClick={toggleTheme}
 *       className="theme-toggle"
 *       aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
 *     >
 *       {isDark ? '☀️' : '🌙'}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Theme-aware component
 * function Card({ title, children }: { title: string; children: React.ReactNode }) {
 *   const { isDark } = useContext(ThemeContext);
 *
 *   return (
 *     <div className={`card ${isDark ? 'card--dark' : 'card--light'}`}>
 *       <h3 className={isDark ? 'text-light' : 'text-dark'}>{title}</h3>
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 */
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
