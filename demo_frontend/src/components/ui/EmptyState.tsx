/**
 * @fileoverview Generic empty state component for consistent user experience across data views
 *
 * This component provides a reusable empty state pattern with customizable iconography,
 * messaging, and styling. Features include neumorphic design integration, responsive
 * layout, and professional typography for maintaining consistent user experience
 * when content is unavailable or loading states complete without data.
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for EmptyState component configuration
 * @interface EmptyStateProps
 * @extends {BaseComponentProps}
 */
export interface EmptyStateProps extends BaseComponentProps {
  /** Icon name for the empty state display */
  icon: string;
  /** Primary title text for the empty state */
  title: string;
  /** Descriptive text explaining the empty state */
  description: string;
  /** Size of the icon in pixels */
  iconSize?: number;
  /** Additional CSS classes for customization */
  className?: string;
}

/**
 * Generic empty state component for consistent user experience across data views
 *
 * @remarks
 * The EmptyState component delivers professional empty state patterns with the following features:
 *
 * **Reusable Pattern:**
 * - Consistent empty state design across application
 * - Standardized layout and typography
 * - Customizable content and iconography
 * - Professional visual hierarchy
 *
 * **Visual Design:**
 * - Neumorphic card container with rounded corners
 * - Centered layout with optimal spacing
 * - Professional icon presentation with secondary text color
 * - Clear typography hierarchy with primary and secondary text
 *
 * **Customization Options:**
 * - Dynamic icon selection through DynamicIcon integration
 * - Configurable icon size for different contexts
 * - Custom title and description content
 * - Additional className support for styling flexibility
 *
 * **Layout Structure:**
 * - Centered container with vertical padding
 * - Maximum width constraints for optimal readability
 * - Consistent spacing between elements
 * - Responsive design with mobile optimization
 *
 * **Content Hierarchy:**
 * - Large icon for visual impact
 * - Primary title with medium font weight
 * - Secondary description with muted text color
 * - Logical reading flow and information architecture
 *
 * **Theme Integration:**
 * - CSS custom properties for consistent theming
 * - Primary and secondary text color variables
 * - Neumorphic card styling integration
 * - Professional color palette usage
 *
 * **Accessibility:**
 * - Semantic HTML structure with proper headings
 * - Screen reader compatible content
 * - Clear content hierarchy
 * - Appropriate text contrast ratios
 *
 * **Use Cases:**
 * - Data tables with no results
 * - Search results without matches
 * - Lists with no items
 * - Dashboard widgets without data
 *
 * **Performance:**
 * - Lightweight component structure
 * - Efficient rendering with minimal DOM
 * - Clean prop interface
 * - Optimized for frequent usage
 *
 * **Integration:**
 * - Seamless DynamicIcon system integration
 * - Consistent with application design system
 * - Professional empty state patterns
 * - Cross-component compatibility
 *
 * @param props - Configuration object for empty state display
 * @returns EmptyState component with customizable empty state presentation
 *
 * @example
 * ```tsx
 * // Basic empty state usage
 * <EmptyState
 *   icon="briefcase"
 *   title="No Transactions"
 *   description="Your transaction history will appear here once you start trading."
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Search results empty state
 * <EmptyState
 *   icon="database"
 *   title="No Results Found"
 *   description="Try adjusting your search criteria or browse all available stocks."
 *   iconSize={64}
 *   className="my-8"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Conditional empty state rendering
 * function DataTable({ data, isLoading }: { data: any[]; isLoading: boolean }) {
 *   if (isLoading) {
 *     return <TableSkeleton />;
 *   }
 *
 *   if (data.length === 0) {
 *     return (
 *       <EmptyState
 *         icon="bar-chart"
 *         title="No Data Available"
 *         description="Data will appear here when available."
 *       />
 *     );
 *   }
 *
 *   return <DataTableContent data={data} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Context-specific empty states
 * function NotificationsList() {
 *   const { data: notifications } = useNotifications();
 *
 *   const getEmptyStateConfig = () => {
 *     return {
 *       icon: "bell",
 *       title: "No Notifications",
 *       description: "You're all caught up! New notifications will appear here."
 *     };
 *   };
 *
 *   return notifications?.length === 0 ? (
 *     <EmptyState {...getEmptyStateConfig()} />
 *   ) : (
 *     <NotificationItems notifications={notifications} />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced empty state with actions
 * function EmptyStateWithAction({ onAction }: { onAction: () => void }) {
 *   return (
 *     <div className="space-y-6">
 *       <EmptyState
 *         icon="plus-circle"
 *         title="Get Started"
 *         description="Add your first item to begin tracking your progress."
 *       />
 *
 *       <div className="flex justify-center">
 *         <button
 *           onClick={onAction}
 *           className="neu-button px-6 py-3 rounded-xl"
 *         >
 *           Add First Item
 *         </button>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export default function EmptyState({
  icon,
  title,
  description,
  iconSize = 48,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="neu-card p-8 rounded-2xl max-w-md mx-auto">
        <DynamicIcon
          iconName={icon}
          size={iconSize}
          className="mx-auto mb-4 text-[var(--text-secondary)]"
        />
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
          {title}
        </h3>
        <p className="text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
  );
}
