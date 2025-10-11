/**
 * @fileoverview Neumorphic-styled button component with advanced interaction states.
 *
 * This module provides a comprehensive button component featuring neumorphic
 * design styling with advanced interaction states, accessibility support, and
 * flexible customization options. It serves as the primary button component
 * throughout the Stock Simulator platform, delivering consistent visual design
 * and professional user interface interactions.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the NeumorphicButton component.
 * @interface ButtonProps
 * @extends BaseComponentProps
 */
export interface ButtonProps extends BaseComponentProps {
  /** Optional click event handler */
  onClick?: () => void;
  /** HTML button type attribute */
  type?: "button" | "submit" | "reset";
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Visual variant styling (currently defined but not implemented) */
  variant?: "primary" | "secondary" | "danger";
  /** Size variant for the button (currently defined but not implemented) */
  size?: "small" | "medium" | "large";
  /** Accessibility label for screen readers */
  "aria-label"?: string;
}

/**
 * Neumorphic-styled button component with advanced interaction states and accessibility.
 *
 * This comprehensive button component provides the primary interactive element
 * throughout the Stock Simulator platform, featuring distinctive neumorphic
 * design styling, smooth interaction animations, accessibility compliance, and
 * flexible customization options. It delivers professional-grade user interface
 * interactions with consistent visual design patterns.
 *
 * @remarks
 * The component delivers comprehensive button functionality through:
 *
 * **Neumorphic Design System**:
 * - **3D Visual Effects**: Distinctive raised button appearance with subtle shadows
 * - **Consistent Styling**: Unified design language across the platform
 * - **Rounded Corners**: Modern border-radius for contemporary aesthetics
 * - **Platform Integration**: Seamless integration with overall design system
 *
 * **Advanced Interaction States**:
 * - **Press Animation**: Satisfying downward translation on active state
 * - **Smooth Transitions**: 150ms duration transitions for polished interactions
 * - **Quick Response**: 75ms active state duration for immediate feedback
 * - **Hover Effects**: Subtle visual feedback for desktop interactions
 *
 * **Accessibility Standards**:
 * - **Screen Reader Support**: Full ARIA label support for assistive technologies
 * - **Keyboard Navigation**: Complete keyboard accessibility compliance
 * - **Focus Management**: Proper focus indicators and state management
 * - **Semantic HTML**: Uses proper button element with appropriate attributes
 *
 * **Flexible Customization**:
 * - **Custom Classes**: Supports additional CSS classes for extended styling
 * - **Content Flexibility**: Accepts any React children for flexible content
 * - **Type Support**: Full HTML button type attribute support
 * - **Conditional Behavior**: Smart onClick handling based on disabled state
 *
 * **State Management**:
 * - **Disabled States**: Visual and functional disabled state handling
 * - **Loading Integration**: Opacity reduction for loading state indication
 * - **Cursor Management**: Automatic cursor styling based on interaction state
 * - **Event Prevention**: Proper event handling for disabled states
 *
 * **Performance Optimizations**:
 * - **CSS Transitions**: Hardware-accelerated animations for smooth performance
 * - **Conditional Rendering**: Efficient prop handling with default values
 * - **Minimal Re-renders**: Optimized for performance with proper prop handling
 * - **Lightweight Implementation**: Clean component structure with minimal overhead
 *
 * **Design Variants (Prepared for Future)**:
 * - **Variant System**: Props prepared for primary, secondary, danger variants
 * - **Size System**: Props prepared for small, medium, large size options
 * - **Extensible Design**: Architecture ready for additional styling variants
 * - **Consistent API**: Standardized prop interface for future enhancements
 *
 * The component serves as the foundation for interactive elements throughout
 * the Stock Simulator platform, providing users with consistent, accessible,
 * and visually appealing button interactions that enhance the overall user
 * experience and maintain design system coherence.
 *
 * @example
 * ```tsx
 * // Basic button usage
 * function ActionPanel() {
 *   const handleSubmit = () => {
 *     console.log('Form submitted');
 *   };
 *
 *   return (
 *     <div className="action-panel">
 *       <NeumorphicButton onClick={handleSubmit}>
 *         Submit Form
 *       </NeumorphicButton>
 *     </div>
 *   );
 * }
 *
 * // Advanced button with accessibility and styling
 * function TradingInterface() {
 *   const [isLoading, setIsLoading] = useState(false);
 *
 *   const handleTrade = async () => {
 *     setIsLoading(true);
 *     await executeTrade();
 *     setIsLoading(false);
 *   };
 *
 *   return (
 *     <NeumorphicButton
 *       onClick={handleTrade}
 *       disabled={isLoading}
 *       aria-label="Execute stock trade"
 *       className="trade-button w-full"
 *     >
 *       {isLoading ? 'Processing...' : 'Execute Trade'}
 *     </NeumorphicButton>
 *   );
 * }
 *
 * // Form integration
 * function LoginForm() {
 *   return (
 *     <form>
 *       <input type="email" placeholder="Email" />
 *       <input type="password" placeholder="Password" />
 *       <NeumorphicButton type="submit" className="w-full mt-4">
 *         Login to Account
 *       </NeumorphicButton>
 *     </form>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for button functionality and styling
 * @returns A neumorphic-styled button component with advanced interaction states,
 * accessibility support, and flexible customization options
 *
 * @see {@link BaseComponentProps} - Base properties interface for components
 *
 * @public
 */
export default function NeumorphicButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  "aria-label": ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`neu-button neumorphic-button p-3 rounded-xl font-bold 
        transition-all duration-150 
        active:translate-y-0.5
        active:duration-75
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
    >
      {children}
    </button>
  );
}
