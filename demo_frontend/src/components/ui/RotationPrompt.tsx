/**
 * @fileoverview Device rotation prompt component for optimal mobile experience
 *
 * This component provides user guidance for device orientation with automatic detection
 * and professional messaging. Features include orientation monitoring, overlay display,
 * animated iconography, and seamless integration with responsive design patterns
 * for optimal mobile user experience and interface usability.
 */

"use client";

import DynamicIcon from "./DynamicIcon";
import { useDeviceOrientation } from "@/hooks/useDeviceOrientation";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for RotationPrompt component configuration
 * @interface RotationPromptProps
 * @extends {BaseComponentProps}
 */
export interface RotationPromptProps extends BaseComponentProps {}

/**
 * Device rotation prompt component for optimal mobile experience
 *
 * @remarks
 * The RotationPrompt component delivers professional orientation guidance with the following features:
 *
 * **Orientation Detection:**
 * - Automatic landscape orientation detection
 * - Device-specific orientation monitoring
 * - Smart visibility management
 * - Professional orientation handling
 *
 * **Full-Screen Overlay:**
 * - Fixed positioning with highest z-index
 * - Complete viewport coverage
 * - Professional overlay styling
 * - Clean background integration
 *
 * **Visual Design:**
 * - Animated rotation icon with pulse effect
 * - Professional typography hierarchy
 * - Centered layout with optimal spacing
 * - Theme-integrated colors and styling
 *
 * **User Experience:**
 * - Clear orientation guidance
 * - Professional messaging
 * - Non-intrusive design
 * - Immediate visual feedback
 *
 * **Responsive Integration:**
 * - Mobile-specific functionality
 * - Portrait orientation optimization
 * - Professional mobile UX patterns
 * - Device-aware interface
 *
 * **Animation Effects:**
 * - Pulse animation for visual attention
 * - Professional micro-interactions
 * - Smooth visual feedback
 * - Engaging user guidance
 *
 * **Theme Integration:**
 * - CSS custom properties for theming
 * - Background and text color variables
 * - Professional color palette
 * - Consistent design system
 *
 * **Accessibility:**
 * - Clear visual messaging
 * - Screen reader compatible content
 * - Professional accessibility patterns
 * - Semantic HTML structure
 *
 * **Performance:**
 * - Conditional rendering for efficiency
 * - Hook-based orientation detection
 * - Optimized component lifecycle
 * - Clean state management
 *
 * **Mobile Optimization:**
 * - Touch-friendly interface
 * - Mobile-specific messaging
 * - Professional mobile patterns
 * - Device-aware functionality
 *
 * @returns RotationPrompt component with device orientation guidance
 *
 * @example
 * ```tsx
 * // Basic rotation prompt usage
 * <RotationPrompt />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with app layout
 * function AppLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <div className="app-container">
 *       {children}
 *       <RotationPrompt />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Mobile-specific app wrapper
 * function MobileAppWrapper({ children }: { children: React.ReactNode }) {
 *   return (
 *     <>
 *       <main className="mobile-app">
 *         {children}
 *       </main>
 *       <RotationPrompt />
 *       <CookieBanner />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom orientation handling
 * function CustomRotationPrompt() {
 *   const { isLandscape, isMobile } = useDeviceOrientation();
 *
 *   if (!isMobile || !isLandscape) {
 *     return null;
 *   }
 *
 *   return (
 *     <div className="rotation-overlay">
 *       <RotationPrompt />
 *       <button onClick={() => setForcePortrait(true)}>
 *         Continue Anyway
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export default function RotationPrompt() {
  const { shouldShow } = useDeviceOrientation();

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
      }}
    >
      <DynamicIcon
        iconName="rotate-ccw"
        className="w-16 h-16 mb-4 animate-pulse"
        style={{ color: "var(--text-primary)" }}
      />
      <h2 className="text-xl font-bold mb-2 text-center">
        Please Rotate Your Device
      </h2>
      <p className="text-center text-sm opacity-80">
        This app is designed for portrait orientation
      </p>
    </div>
  );
}
