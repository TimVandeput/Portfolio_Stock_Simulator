/**
 * @fileoverview Professional theme toggle component for light/dark mode switching
 *
 * This component provides seamless theme switching functionality with dynamic iconography,
 * accessibility features, and smooth animations. Features include context integration,
 * professional button styling, visual feedback, and comprehensive theme management
 * for enhanced user experience and accessibility compliance.
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import { useTheme } from "@/contexts/ThemeContext";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for ThemeToggle component configuration
 * @interface ThemeToggleProps
 * @extends {BaseComponentProps}
 */
export interface ThemeToggleProps extends BaseComponentProps {}

/**
 * Professional theme toggle component for light/dark mode switching
 *
 * @remarks
 * The ThemeToggle component delivers comprehensive theme management with the following features:
 *
 * **Theme Integration:**
 * - Seamless ThemeContext integration for state management
 * - Real-time theme switching with immediate visual feedback
 * - Persistent theme preferences across sessions
 * - Professional theme transition handling
 *
 * **Dynamic Iconography:**
 * - Moon icon for dark mode indication
 * - Sun icon for light mode indication
 * - Context-aware icon switching
 * - Consistent icon sizing and styling
 *
 * **Interactive Design:**
 * - Neumorphic button styling with professional appearance
 * - Active state animation with translate-y effect
 * - Smooth transition timing (75ms duration)
 * - Professional hover and focus states
 *
 * **Accessibility Features:**
 * - Descriptive title attributes for screen readers
 * - Context-aware accessibility labels
 * - Keyboard navigation support
 * - ARIA-compliant interactive elements
 *
 * **Visual Feedback:**
 * - Immediate icon change on theme switch
 * - Color-coded icons (secondary for dark, primary for light)
 * - Professional button press animation
 * - Consistent visual hierarchy
 *
 * **User Experience:**
 * - Intuitive icon representation of current mode
 * - Single-click theme switching
 * - Professional animation feedback
 * - Consistent placement and sizing
 *
 * **Styling System:**
 * - Neumorphic design language integration
 * - Professional padding and border radius
 * - Theme-aware text and icon colors
 * - Consistent with application design system
 *
 * **Performance:**
 * - Lightweight component structure
 * - Efficient theme context usage
 * - Optimized re-render patterns
 * - Clean component lifecycle
 *
 * **Integration Features:**
 * - Seamless header and navigation integration
 * - Consistent theming across application
 * - Professional UI component standards
 * - Cross-component theme synchronization
 *
 * @returns ThemeToggle component with dynamic theme switching functionality
 *
 * @example
 * ```tsx
 * // Basic theme toggle usage
 * <ThemeToggle />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with navigation header
 * function NavigationHeader() {
 *   return (
 *     <header className="header-container">
 *       <Logo />
 *       <NavigationMenu />
 *       <div className="header-actions">
 *         <ThemeToggle />
 *         <UserMenu />
 *       </div>
 *     </header>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Settings panel integration
 * function SettingsPanel() {
 *   return (
 *     <div className="settings-section">
 *       <h3>Appearance</h3>
 *       <div className="setting-item">
 *         <label>Theme Preference</label>
 *         <ThemeToggle />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Mobile drawer integration
 * function MobileDrawer() {
 *   return (
 *     <div className="mobile-drawer">
 *       <DrawerHeader />
 *       <NavigationLinks />
 *       <div className="drawer-footer">
 *         <ThemeToggle />
 *         <LogoutButton />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom theme toggle with analytics
 * function AnalyticsThemeToggle() {
 *   const { isDark, toggleTheme } = useTheme();
 *   const analytics = useAnalytics();
 *
 *   const handleThemeToggle = () => {
 *     analytics.track('theme_toggled', {
 *       from_theme: isDark ? 'dark' : 'light',
 *       to_theme: isDark ? 'light' : 'dark'
 *     });
 *     toggleTheme();
 *   };
 *
 *   return (
 *     <button
 *       onClick={handleThemeToggle}
 *       className="neu-button p-3 rounded-xl"
 *       title={isDark ? "Switch to light mode" : "Switch to dark mode"}
 *     >
 *       <DynamicIcon
 *         iconName={isDark ? "moon" : "sun"}
 *         size={20}
 *         className={isDark ? "text-secondary" : "text-primary"}
 *       />
 *     </button>
 *   );
 * }
 * ```
 */
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
