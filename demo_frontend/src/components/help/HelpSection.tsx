/**
 * @fileoverview HelpSection component for organized help content display
 *
 * This component provides a comprehensive layout for help documentation sections,
 * featuring dynamic icons, color-coded sections, and flexible content areas.
 * Integrates neumorphic design elements with professional typography and
 * structured information presentation.
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import { BaseComponentProps } from "@/types";

/**
 * Props interface for HelpSection component configuration
 * @interface HelpSectionProps
 * @extends {BaseComponentProps}
 */
export interface HelpSectionProps extends BaseComponentProps {
  /** Icon name for section identification */
  icon: string;
  /** Color code for icon and accent border */
  iconColor: string;
  /** Section title displayed prominently */
  title: string;
  /** Brief description of section purpose */
  purpose: string;
  /** React children for flexible content rendering */
  children: React.ReactNode;
}

/**
 * HelpSection component for organized help content display
 *
 * @remarks
 * The HelpSection component delivers structured help content with the following features:
 *
 * **Visual Design:**
 * - Neumorphic card styling with elevated appearance
 * - Color-coded left border for visual section identification
 * - Professional rounded corners and consistent padding
 * - Integrated icon and typography hierarchy
 *
 * **Content Structure:**
 * - Prominent section header with icon and title
 * - Purpose statement with bold emphasis
 * - Flexible children content area for various help formats
 * - Consistent spacing and typography throughout
 *
 * **Icon Integration:**
 * - Dynamic icon system with customizable colors
 * - Consistent sizing (20px) for visual harmony
 * - Color coordination between icon and section accent
 * - Professional icon positioning and alignment
 *
 * **Typography:**
 * - Hierarchical text sizing for clear information structure
 * - High contrast primary text for headings
 * - Secondary text color for content readability
 * - Justified text alignment for professional appearance
 *
 * **Layout Features:**
 * - Consistent 6-unit padding for comfortable reading
 * - Vertical spacing system for content organization
 * - Responsive design for various screen sizes
 * - Flexible content area accommodating different help formats
 *
 * **Accessibility:**
 * - Semantic HTML structure with proper heading hierarchy
 * - High contrast color schemes for better visibility
 * - Screen reader friendly content organization
 * - Clear visual separation between sections
 *
 * @param props - Configuration object for section display
 * @returns HelpSection component with structured help content
 *
 * @example
 * ```tsx
 * // Basic help section with text content
 * <HelpSection
 *   icon="Home"
 *   iconColor="#3b82f6"
 *   title="Dashboard Overview"
 *   purpose="Provides a comprehensive view of your trading activity"
 * >
 *   <p>The dashboard displays key metrics including portfolio value...</p>
 * </HelpSection>
 * ```
 *
 * @example
 * ```tsx
 * // Section with structured list content
 * <HelpSection
 *   icon="TrendingUp"
 *   iconColor="#10b981"
 *   title="Trading Features"
 *   purpose="Execute and manage your stock trading operations"
 * >
 *   <HelpList
 *     title="Available Actions"
 *     items={["Buy stocks", "Sell positions", "View market data"]}
 *   />
 * </HelpSection>
 * ```
 *
 * @example
 * ```tsx
 * // Complex section with multiple content types
 * <HelpSection
 *   icon="Settings"
 *   iconColor="#f59e0b"
 *   title="Account Management"
 *   purpose="Manage your profile and application preferences"
 * >
 *   <div className="space-y-4">
 *     <p>Access your account settings to customize your experience.</p>
 *     <HelpSteps
 *       steps={[
 *         "Navigate to profile settings",
 *         "Update your preferences",
 *         "Save changes"
 *       ]}
 *     />
 *   </div>
 * </HelpSection>
 * ```
 */
export default function HelpSection({
  icon,
  iconColor,
  title,
  purpose,
  children,
}: HelpSectionProps) {
  return (
    <div
      className="neu-card p-6 rounded-xl border-l-4"
      style={{ borderLeftColor: iconColor }}
    >
      <div className="flex items-center gap-3 mb-4">
        <DynamicIcon iconName={icon} size={20} style={{ color: iconColor }} />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
      </div>
      <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
        <p>
          <strong>Purpose:</strong> {purpose}
        </p>
        {children}
      </div>
    </div>
  );
}
