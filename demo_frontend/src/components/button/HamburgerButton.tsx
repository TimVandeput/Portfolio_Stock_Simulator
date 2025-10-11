/**
 * @fileoverview Mobile navigation hamburger menu button component.
 *
 * This module provides a specialized hamburger menu button component designed
 * for mobile navigation interfaces. It delivers a clean, accessible toggle
 * button with standard hamburger icon styling that integrates seamlessly
 * with mobile drawer navigation systems within the Stock Simulator platform.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * Props interface for the HamburgerButton component.
 * @interface HamburgerButtonProps
 */
export interface HamburgerButtonProps {
  /** Callback function triggered when the hamburger button is clicked */
  onClick: () => void;
}

/**
 * Mobile navigation hamburger menu button with accessibility features.
 *
 * This specialized button component provides mobile users with an intuitive
 * way to access navigation menus through the universally recognized hamburger
 * icon pattern. It delivers clean styling, proper accessibility support, and
 * seamless integration with mobile drawer navigation systems within the Stock
 * Simulator platform.
 *
 * @remarks
 * The component delivers essential mobile navigation functionality through:
 *
 * **Mobile-First Design**:
 * - **Responsive Visibility**: Hidden on desktop devices (md:hidden)
 * - **Touch-Optimized**: Appropriate padding for finger-friendly interaction
 * - **Mobile Navigation**: Specifically designed for drawer/sidebar toggles
 * - **Platform Integration**: Consistent with mobile UI patterns
 *
 * **Accessibility Standards**:
 * - **Screen Reader Support**: Descriptive aria-label for assistive technologies
 * - **Semantic HTML**: Proper button element with clear purpose
 * - **ARIA Compliance**: Hidden decorative SVG with aria-hidden="true"
 * - **Keyboard Navigation**: Full keyboard accessibility support
 *
 * **Visual Design Features**:
 * - **Standard Hamburger Icon**: Three horizontal lines in universal pattern
 * - **Dynamic Theming**: Uses CSS custom properties for consistent coloring
 * - **Clean Styling**: Minimalist design that fits various navigation contexts
 * - **Stroke-based SVG**: Scalable vector graphics for crisp rendering
 *
 * **Interactive Behavior**:
 * - **Click Handling**: Triggers provided onClick callback function
 * - **Visual Feedback**: Standard button interaction states
 * - **Touch Responsiveness**: Optimized for mobile touch interactions
 * - **State Management**: Delegates state handling to parent components
 *
 * **Performance Characteristics**:
 * - **Lightweight Implementation**: Minimal DOM footprint and JavaScript
 * - **SVG Optimization**: Inline SVG for fast rendering without network requests
 * - **CSS Integration**: Leverages platform theming system efficiently
 * - **No Dependencies**: Self-contained component with minimal overhead
 *
 * **Integration Patterns**:
 * - **Parent-Child Communication**: Simple callback pattern for state management
 * - **Theme Consistency**: Inherits color scheme from CSS custom properties
 * - **Layout Flexibility**: Works within various navigation layout systems
 * - **Event Delegation**: Clean separation of concerns with parent components
 *
 * The component serves as a fundamental building block for mobile navigation
 * interfaces, providing users with familiar interaction patterns while
 * maintaining accessibility standards and delivering consistent visual
 * design within the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic hamburger menu button usage
 * function MobileNavigation() {
 *   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
 *
 *   const handleMenuClick = () => {
 *     setIsDrawerOpen(!isDrawerOpen);
 *   };
 *
 *   return (
 *     <div className="mobile-nav">
 *       <HamburgerButton onClick={handleMenuClick} />
 *       <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
 *     </div>
 *   );
 * }
 *
 * // Integration with navigation header
 * function NavigationHeader() {
 *   const { toggleMobileMenu } = useNavigation();
 *
 *   return (
 *     <header className="navigation-header">
 *       <div className="logo">Stock Simulator</div>
 *       <HamburgerButton onClick={toggleMobileMenu} />
 *     </header>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for hamburger button functionality
 * @returns A mobile-optimized hamburger menu button with accessibility support
 * and clean visual design
 *
 * @see {@link MobileDrawer} - Related mobile drawer component for navigation menus
 *
 * @public
 */
export default function HamburgerButton({ onClick }: HamburgerButtonProps) {
  return (
    <button
      aria-label="Open menu"
      onClick={onClick}
      className="md:hidden p-3"
      style={{ color: "var(--text-primary)" }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          d="M3 6h18M3 12h18M3 18h18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
