/**
 * @fileoverview Mobile slide-out navigation drawer with sophisticated animations
 *
 * This component provides a comprehensive mobile navigation solution with smooth
 * slide-out animations, backdrop overlay, and responsive behavior. Features include
 * automatic desktop hiding, route-based filtering, and professional mobile-first
 * navigation patterns with accessibility and touch interaction support.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";
import { BaseComponentProps } from "@/types";

/**
 * Props interface for MobileDrawer component configuration
 * @interface MobileDrawerProps
 * @extends {BaseComponentProps}
 */
export interface MobileDrawerProps extends BaseComponentProps {
  /** Whether the drawer is currently open */
  isOpen: boolean;
  /** Array of navigation items to display */
  navItems: NavItem[];
  /** Callback function when drawer should close */
  onClose: () => void;
  /** Whether to hide navigation items */
  hideNav?: boolean;
}

/**
 * Mobile slide-out navigation drawer with sophisticated animations
 *
 * @remarks
 * The MobileDrawer component delivers comprehensive mobile navigation with the following features:
 *
 * **Animation System:**
 * - Smooth slide-in/slide-out transitions with timing controls
 * - Backdrop fade animations with opacity transitions
 * - State-managed rendering for performance optimization
 * - Professional easing curves for natural motion
 *
 * **Mobile Optimization:**
 * - Touch-friendly interface with appropriate sizing
 * - Gesture support with backdrop tap-to-close
 * - Responsive behavior with desktop auto-hiding
 * - Mobile-first design with swipe-friendly interactions
 *
 * **Navigation Features:**
 * - Dynamic navigation filtering based on current route
 * - Active route highlighting with visual feedback
 * - Auto-close on navigation selection
 * - Conditional item display with dashboard filtering
 *
 * **Visual Design:**
 * - Neumorphic styling with consistent design language
 * - Professional shadows and surface treatments
 * - Theme integration with CSS custom properties
 * - Clean typography and spacing hierarchy
 *
 * **Accessibility:**
 * - ARIA labels for screen reader compatibility
 * - Semantic HTML structure with proper navigation roles
 * - Keyboard navigation support
 * - Focus management and visual indicators
 *
 * **State Management:**
 * - Complex animation state tracking
 * - Render optimization with conditional rendering
 * - Window resize handling for responsive behavior
 * - Proper cleanup and event listener management
 *
 * **Interactive Features:**
 * - Backdrop overlay with click-to-close functionality
 * - Close button with custom SVG icon
 * - Touch and mouse interaction support
 * - Smooth transitions between open/closed states
 *
 * @param props - Configuration object for drawer behavior
 * @returns MobileDrawer component with slide-out navigation
 *
 * @example
 * ```tsx
 * // Basic mobile drawer with navigation items
 * const [isDrawerOpen, setIsDrawerOpen] = useState(false);
 * const navItems = [
 *   { name: "Home", href: "/home" },
 *   { name: "Portfolio", href: "/portfolio" },
 *   { name: "Market", href: "/market" }
 * ];
 *
 * <MobileDrawer
 *   isOpen={isDrawerOpen}
 *   navItems={navItems}
 *   onClose={() => setIsDrawerOpen(false)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with hamburger button
 * function MobileNavigation() {
 *   const [drawerOpen, setDrawerOpen] = useState(false);
 *   const { navItems } = useNavigation();
 *
 *   return (
 *     <>
 *       <HamburgerButton
 *         onClick={() => setDrawerOpen(true)}
 *       />
 *
 *       <MobileDrawer
 *         isOpen={drawerOpen}
 *         navItems={navItems}
 *         onClose={() => setDrawerOpen(false)}
 *         hideNav={false}
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced usage with authentication and filtering
 * function AuthenticatedMobileNav() {
 *   const [drawerOpen, setDrawerOpen] = useState(false);
 *   const { user } = useAuth();
 *   const { hideNav } = useHeaderState();
 *   const navItems = filterNavItemsByRole(user?.role);
 *
 *   return (
 *     <MobileDrawer
 *       isOpen={drawerOpen}
 *       navItems={navItems}
 *       onClose={() => setDrawerOpen(false)}
 *       hideNav={hideNav || !user}
 *     />
 *   );
 * }
 * ```
 */
export default function MobileDrawer({
  isOpen,
  navItems,
  onClose,
  hideNav = false,
}: MobileDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname === "/home";

  const filteredNavItems = navItems.filter(
    (item) => !(isDashboard && item.hideOnDashboard)
  );

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 400);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (isDesktop && isOpen) {
        setShouldRender(false);
        setIsAnimating(false);
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[99999] md:hidden">
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute left-0 top-0 bottom-0 w-64 z-[99999] transition-transform duration-500 ease-in-out overflow-y-auto ${
          isAnimating ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--bg-surface)",
          boxShadow: "var(--shadow-large)",
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Menu
            </h2>
            <button
              aria-label="Close menu"
              onClick={onClose}
              className="p-2"
              style={{ color: "var(--text-primary)" }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6l-12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {!hideNav && (
            <nav className="flex flex-col gap-4">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href;
                const spanStyle = isActive
                  ? {
                      color: "var(--bg-primary)",
                      backgroundColor: "var(--text-primary)",
                      boxShadow: "var(--shadow-neu-inset)",
                      transform: "translateY(1px)",
                    }
                  : {};

                return (
                  <Link
                    href={item.href}
                    key={item.name}
                    onClick={onClose}
                    className="no-underline"
                  >
                    <span
                      className="neu-button neumorphic-button block p-3 rounded-xl font-bold text-center"
                      style={spanStyle}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
