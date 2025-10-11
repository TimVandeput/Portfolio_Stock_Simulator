/**
 * @fileoverview Desktop navigation component with advanced dropdown menu system
 *
 * This component provides a comprehensive desktop navigation solution with sophisticated
 * dropdown functionality, accessibility features, and interactive visual feedback.
 * Features include neumorphic design elements, keyboard navigation support, and
 * seamless integration with Next.js routing and authentication systems.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";
import DynamicIcon from "../ui/DynamicIcon";
import { useDropdownMenu } from "@/hooks/useDropdownMenu";
import { BaseComponentProps } from "@/types";

/**
 * Props interface for DesktopNav component configuration
 * @interface DesktopNavProps
 * @extends {BaseComponentProps}
 */
export interface DesktopNavProps extends BaseComponentProps {
  /** Array of navigation items to display */
  navItems: NavItem[];
  /** Whether to hide the navigation component */
  hideNav: boolean;
}

/**
 * Desktop navigation component with advanced dropdown menu system
 *
 * @remarks
 * The DesktopNav component delivers sophisticated desktop navigation with the following features:
 *
 * **Navigation Structure:**
 * - Dropdown menu system with expandable navigation items
 * - Dynamic menu toggle button with X/menu icon switching
 * - Professional neumorphic button styling with interactive effects
 * - Responsive design optimized for desktop and larger screens
 *
 * **Interactive Features:**
 * - Click-to-expand dropdown with smooth animations
 * - Hover and press effects with visual feedback
 * - Active route highlighting with inverted color scheme
 * - Mouse interactions with press/release state management
 *
 * **Accessibility:**
 * - Full ARIA support with proper menu semantics
 * - Keyboard navigation with arrow key support
 * - Screen reader compatible with role and label attributes
 * - Focus management and visual focus indicators
 *
 * **Visual Design:**
 * - Neumorphic design language with soft shadows
 * - Dynamic border radius adjustments for open states
 * - Consistent spacing and typography hierarchy
 * - Theme integration with CSS custom properties
 *
 * **State Management:**
 * - Path-based active state detection
 * - Dropdown open/close state management
 * - Auto-close on navigation selection
 * - Hide/show functionality for conditional display
 *
 * **Layout Features:**
 * - Absolute positioning for dropdown overlay
 * - Scrollable menu area for long navigation lists
 * - Proper z-index layering for modal behavior
 * - Responsive spacing and sizing adaptations
 *
 * **Integration:**
 * - Next.js Link components for client-side navigation
 * - usePathname hook for active route detection
 * - Custom dropdown menu hook for complex interactions
 * - Dynamic icon system for consistent iconography
 *
 * @param props - Configuration object for navigation behavior
 * @returns DesktopNav component with sophisticated dropdown navigation
 *
 * @example
 * ```tsx
 * // Basic desktop navigation with nav items
 * const navItems = [
 *   { name: "Dashboard", href: "/dashboard" },
 *   { name: "Portfolio", href: "/portfolio" },
 *   { name: "Market", href: "/market" }
 * ];
 *
 * <DesktopNav
 *   navItems={navItems}
 *   hideNav={false}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Conditional navigation with authentication
 * function HeaderNavigation({ user }: { user: User | null }) {
 *   const navItems = filterNavItemsByRole(user?.role);
 *
 *   return (
 *     <DesktopNav
 *       navItems={navItems}
 *       hideNav={!user}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Integration with header component
 * function AppHeader() {
 *   const { user } = useAuth();
 *   const navItems = getNavigationItems(user);
 *   const shouldHideNav = useHeaderState().hideNav;
 *
 *   return (
 *     <header className="flex items-center justify-between">
 *       <Logo />
 *       <DesktopNav
 *         navItems={navItems}
 *         hideNav={shouldHideNav}
 *       />
 *       <UserControls />
 *     </header>
 *   );
 * }
 * ```
 */
export default function DesktopNav({ navItems, hideNav }: DesktopNavProps) {
  const pathname = usePathname();
  const { open, setOpen, panelRef, btnRef, listRef, onKeyDown } =
    useDropdownMenu();

  const hidden = hideNav
    ? "pointer-events-none opacity-0 h-0 overflow-hidden"
    : "";

  return (
    <div
      className={`relative hidden md:flex items-center ${hidden}`}
      aria-hidden={hideNav || undefined}
    >
      <button
        ref={btnRef}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`
    neu-button p-3 font-bold inline-flex items-center gap-2 relative z-50
    ${
      open
        ? "rounded-t-xl border-b border-[var(--border)] menu-open-no-bottom"
        : "rounded-xl"
    }
  `}
        style={{
          transition: "all 0.15s ease",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.currentTarget.style.transform = "translateY(2px)";
          e.currentTarget.style.boxShadow = "var(--shadow-neu-inset)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        {open ? (
          <DynamicIcon iconName="x" size={18} />
        ) : (
          <DynamicIcon iconName="menu" size={18} />
        )}
        Menu
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label="Main navigation"
          onKeyDown={onKeyDown}
          className="
            absolute left-0 top-full
            z-40
          "
        >
          <div
            className="
              bg-[var(--bg-surface)]
              px-8 py-6
              rounded-b-xl rounded-tr-xl
              inline-block
              max-h-[80vh] overflow-y-auto
            "
            style={{
              boxShadow: "var(--shadow-large)",
            }}
          >
            <ul
              ref={listRef}
              className="
                flex flex-col gap-3 md:gap-4 lg:gap-4
                items-stretch
              "
            >
              {navItems.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href} className="list-none">
                    <Link
                      href={item.href}
                      data-menuitem
                      role="menuitem"
                      className="no-underline block"
                      onClick={() => setOpen(false)}
                      draggable="false"
                    >
                      <div
                        className={`
                          neu-button rounded-xl px-3 py-2 text-center whitespace-nowrap
                          focus-visible:outline focus-visible:outline-2
                          transition-colors
                          ${idx === 0 ? "mt-4 md:mt-6" : ""}
                        `}
                        style={{
                          color: isActive
                            ? "var(--bg-primary)"
                            : "var(--btn-text)",
                          background: isActive
                            ? "var(--text-primary)"
                            : "var(--btn-bg)",
                          boxShadow: isActive
                            ? "var(--shadow-neu-inset)"
                            : "var(--shadow-neu)",
                        }}
                      >
                        {item.name}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
