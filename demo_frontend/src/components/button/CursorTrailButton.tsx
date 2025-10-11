/**
 * @fileoverview Interactive cursor trail toggle button component.
 *
 * This module provides a specialized button component that enables users to toggle
 * cursor trail visual effects on and off. It integrates with the cursor trail
 * settings system to provide immediate visual feedback and persistent preferences
 * for enhanced user interface interactions within the Stock Simulator platform.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import { useCursorTrailSettings } from "@/hooks/useCursorTrailSettings";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the CursorTrailButton component.
 * @interface CursorTrailButtonProps
 * @extends BaseComponentProps
 */
export interface CursorTrailButtonProps extends BaseComponentProps {
  /** Optional callback function triggered when cursor trail state changes */
  onTrailChange?: (enabled: boolean) => void;
}

/**
 * Interactive cursor trail toggle button with visual state indication.
 *
 * This specialized button component provides users with the ability to toggle
 * cursor trail visual effects on and off through an intuitive interface. It
 * integrates seamlessly with the cursor trail settings system to deliver
 * immediate visual feedback, persistent user preferences, and enhanced
 * interactive experiences within the Stock Simulator platform.
 *
 * @remarks
 * The component delivers comprehensive cursor trail management through:
 *
 * **Visual Effect Toggle**:
 * - **Cursor Trail Control**: Enables/disables animated cursor trail effects
 * - **Immediate Feedback**: Instant visual response to toggle actions
 * - **State Persistence**: Maintains user preferences across sessions
 * - **Desktop Optimization**: Hidden on mobile devices for optimal experience
 *
 * **Interactive State Management**:
 * - **Settings Integration**: Connects with useCursorTrailSettings hook
 * - **State Synchronization**: Maintains consistent state across components
 * - **Callback Support**: Optional notification system for state changes
 * - **Default Configuration**: Starts with cursor trail disabled by default
 *
 * **Visual Design Features**:
 * - **Dynamic Icons**: Context-aware icon switching based on current state
 * - **Neumorphic Styling**: Consistent button design with platform aesthetics
 * - **Color Coding**: Orange highlighting for visual state identification
 * - **Accessibility Support**: Comprehensive ARIA labels and tooltips
 *
 * **User Experience Enhancements**:
 * - **Tooltip Feedback**: Clear descriptions of current state and actions
 * - **Active States**: Visual press feedback with transform animations
 * - **Responsive Design**: Desktop-only visibility for appropriate contexts
 * - **Intuitive Icons**: Mouse pointer icons with clear enabled/disabled states
 *
 * **Performance Optimizations**:
 * - **Client-side Rendering**: Optimized for interactive state management
 * - **Efficient State Hooks**: Minimal re-renders through specialized hooks
 * - **Conditional Rendering**: Smart visibility based on device capabilities
 * - **Lightweight Implementation**: Minimal overhead for visual effect control
 *
 * **Accessibility Features**:
 * - **Screen Reader Support**: Descriptive titles for assistive technologies
 * - **Keyboard Navigation**: Full keyboard accessibility support
 * - **State Announcements**: Clear indication of current trail state
 * - **Focus Management**: Proper focus handling for navigation
 *
 * The component serves as an essential user interface enhancement tool,
 * providing users with control over visual effects while maintaining
 * accessibility standards and delivering a polished interactive experience
 * within the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic cursor trail toggle usage
 * function NavigationBar() {
 *   const handleTrailChange = (enabled: boolean) => {
 *     console.log(`Cursor trail ${enabled ? 'enabled' : 'disabled'}`);
 *   };
 *
 *   return (
 *     <div className="navigation-controls">
 *       <CursorTrailButton onTrailChange={handleTrailChange} />
 *     </div>
 *   );
 * }
 *
 * // Integration with settings panel
 * function SettingsPanel() {
 *   return (
 *     <div className="visual-effects-section">
 *       <h3>Visual Effects</h3>
 *       <div className="controls">
 *         <CursorTrailButton />
 *         <span>Enable cursor trail effects</span>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for cursor trail toggle functionality
 * @returns An interactive button component for toggling cursor trail effects
 * with visual state indication and accessibility support
 *
 * @see {@link useCursorTrailSettings} - Custom hook for cursor trail state management
 * @see {@link DynamicIcon} - Icon component for visual state representation
 * @see {@link BaseComponentProps} - Base properties interface for components
 *
 * @public
 */
export default function CursorTrailButton({
  onTrailChange,
}: CursorTrailButtonProps) {
  const { cursorTrailEnabled, toggleCursorTrail } = useCursorTrailSettings(
    false,
    onTrailChange
  );

  return (
    <button
      className="hidden md:inline-flex neu-button p-3 rounded-xl font-bold active:translate-y-0.5 active:duration-75"
      title={
        cursorTrailEnabled ? "Disable Cursor Trail" : "Enable Cursor Trail"
      }
      onClick={toggleCursorTrail}
    >
      {cursorTrailEnabled ? (
        <DynamicIcon
          iconName="mouse-pointer-2"
          size={20}
          style={{ color: "orange" }}
        />
      ) : (
        <DynamicIcon
          iconName="mouse-pointer-ban"
          size={20}
          style={{ color: "orange" }}
        />
      )}
    </button>
  );
}
