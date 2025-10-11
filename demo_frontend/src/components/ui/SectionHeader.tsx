/**
 * @fileoverview Professional section header component with iconography and consistent styling
 *
 * This component provides standardized section headers with dynamic icons and professional
 * typography. Features include customizable icon colors, consistent spacing, and theme
 * integration for creating clear visual hierarchy and professional section organization
 * throughout the application interface.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for SectionHeader component configuration
 * @interface SectionHeaderProps
 * @extends {BaseComponentProps}
 */
export interface SectionHeaderProps extends BaseComponentProps {
  /** Icon name for the section header */
  icon: string;
  /** Title text for the section */
  title: string;
  /** Custom color for the icon (defaults to accent color) */
  iconColor?: string;
}

/**
 * Professional section header component with iconography and consistent styling
 *
 * @remarks
 * The SectionHeader component delivers professional section organization with the following features:
 *
 * **Visual Design:**
 * - Consistent horizontal layout with flexbox alignment
 * - Professional icon container with subtle background
 * - Clean typography with semibold weight
 * - Standardized spacing and margins
 *
 * **Icon Integration:**
 * - Dynamic icon system integration
 * - Customizable icon colors with accent default
 * - Professional icon sizing (24px)
 * - Icon container with rounded background
 *
 * **Typography:**
 * - Large text (xl) for clear hierarchy
 * - Semibold font weight for emphasis
 * - Primary text color integration
 * - Professional heading presentation
 *
 * **Layout Structure:**
 * - Flex container with center alignment
 * - Consistent gap spacing (12px)
 * - Bottom margin for section separation
 * - Clean visual organization
 *
 * **Theme Integration:**
 * - CSS custom properties for theming
 * - Accent color integration
 * - Background color with opacity
 * - Professional color palette
 *
 * **Consistency:**
 * - Standardized section header pattern
 * - Reusable design system component
 * - Professional visual hierarchy
 * - Application-wide consistency
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Clear heading hierarchy
 * - Screen reader compatible
 * - Professional accessibility patterns
 *
 * **Customization:**
 * - Flexible icon selection
 * - Customizable icon colors
 * - Dynamic title content
 * - Professional customization options
 *
 * **Performance:**
 * - Lightweight component structure
 * - Efficient rendering patterns
 * - Minimal DOM footprint
 * - Optimized for frequent usage
 *
 * @param props - Configuration object for section header display
 * @returns SectionHeader component with professional styling and iconography
 *
 * @example
 * ```tsx
 * // Basic section header
 * <SectionHeader
 *   icon="briefcase"
 *   title="Portfolio Overview"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Custom icon color
 * <SectionHeader
 *   icon="bar-chart"
 *   title="Performance Analytics"
 *   iconColor="#10b981"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Dashboard sections
 * function DashboardSections() {
 *   return (
 *     <div className="dashboard-content">
 *       <SectionHeader
 *         icon="wallet"
 *         title="Account Balance"
 *       />
 *       <WalletBalanceCard />
 *
 *       <SectionHeader
 *         icon="trending-up"
 *         title="Recent Transactions"
 *       />
 *       <TransactionsList />
 *
 *       <SectionHeader
 *         icon="pie-chart"
 *         title="Portfolio Allocation"
 *       />
 *       <AllocationChart />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Settings page sections
 * function SettingsPage() {
 *   return (
 *     <div className="settings-container">
 *       <SectionHeader
 *         icon="user"
 *         title="Profile Settings"
 *       />
 *       <ProfileForm />
 *
 *       <SectionHeader
 *         icon="bell"
 *         title="Notification Preferences"
 *       />
 *       <NotificationSettings />
 *
 *       <SectionHeader
 *         icon="shield"
 *         title="Security Settings"
 *       />
 *       <SecurityForm />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Dynamic section headers
 * function DynamicSections({ sections }: { sections: Section[] }) {
 *   return (
 *     <div className="dynamic-content">
 *       {sections.map((section) => (
 *         <div key={section.id} className="section">
 *           <SectionHeader
 *             icon={section.icon}
 *             title={section.title}
 *             iconColor={section.color}
 *           />
 *           <section.Component />
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export default function SectionHeader({
  icon,
  title,
  iconColor = "var(--accent)",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
        <DynamicIcon iconName={icon} size={24} style={{ color: iconColor }} />
      </div>
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
    </div>
  );
}
