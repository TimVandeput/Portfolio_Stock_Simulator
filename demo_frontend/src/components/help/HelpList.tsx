/**
 * @fileoverview HelpList component for structured help content presentation
 *
 * This component provides a flexible list display system for help documentation,
 * supporting both ordered and unordered lists with HTML content rendering.
 * Features semantic markup, responsive design, and consistent typography for
 * professional help system integration.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import { BaseComponentProps } from "@/types";

/**
 * Props interface for HelpList component configuration
 * @interface HelpListProps
 * @extends {BaseComponentProps}
 */
export interface HelpListProps extends BaseComponentProps {
  /** Title or heading for the list section */
  title: string;
  /** Array of list items, supporting HTML content */
  items: string[];
  /** Whether to display as ordered (numbered) list */
  ordered?: boolean;
}

/**
 * HelpList component for structured help content presentation
 *
 * @remarks
 * The HelpList component delivers structured content presentation with the following features:
 *
 * **List Types:**
 * - Unordered lists (ul) with bullet points for general items
 * - Ordered lists (ol) with numerical indicators for sequential steps
 * - Dynamic component selection based on content requirements
 * - Semantic HTML structure for accessibility compliance
 *
 * **Content Features:**
 * - HTML content rendering with dangerouslySetInnerHTML
 * - Support for formatted text, links, and inline styling
 * - Consistent typography and spacing across list items
 * - Professional title presentation with bold formatting
 *
 * **Visual Design:**
 * - Clean indentation with consistent left margin
 * - Vertical spacing between list items for readability
 * - Integrated bullet/number styling with list-inside positioning
 * - Responsive design for various screen sizes
 *
 * **Typography:**
 * - Strong title emphasis for clear section identification
 * - Consistent item spacing for improved reading flow
 * - Professional font weights and sizing
 * - Proper visual hierarchy with title and content separation
 *
 * **Accessibility:**
 * - Semantic list markup (ul/ol) for screen readers
 * - Proper heading structure with strong elements
 * - Clear visual distinction between title and content
 * - Keyboard navigation friendly structure
 *
 * **Integration:**
 * - Seamless integration with help page components
 * - Flexible content structure for various help topics
 * - Consistent styling with application theme
 * - Reusable across different help sections
 *
 * @param props - Configuration object for list display
 * @returns HelpList component with structured content presentation
 *
 * @example
 * ```tsx
 * // Basic unordered help list
 * <HelpList
 *   title="Key Features"
 *   items={[
 *     "Real-time stock price tracking",
 *     "Portfolio management tools",
 *     "Trade execution simulation"
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Ordered step-by-step instructions
 * <HelpList
 *   title="Getting Started"
 *   ordered={true}
 *   items={[
 *     "Create your account and log in",
 *     "Set up your initial portfolio balance",
 *     "Search for stocks to begin trading"
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Advanced list with HTML formatting
 * <HelpList
 *   title="Trading Options"
 *   items={[
 *     "<strong>Market Orders:</strong> Execute immediately at current price",
 *     "<strong>Limit Orders:</strong> Set specific price targets",
 *     "View detailed <a href='/help/charts'>chart analysis</a>"
 *   ]}
 * />
 * ```
 */
export default function HelpList({
  title,
  items,
  ordered = false,
}: HelpListProps) {
  const ListComponent = ordered ? "ol" : "ul";
  const listClass = ordered ? "list-decimal" : "list-disc";

  return (
    <div>
      <p>
        <strong>{title}:</strong>
      </p>
      <ListComponent className={`${listClass} list-inside space-y-1 ml-4 mt-2`}>
        {items.map((item, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ListComponent>
    </div>
  );
}
