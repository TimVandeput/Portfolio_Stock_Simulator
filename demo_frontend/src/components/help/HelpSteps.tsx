/**
 * @fileoverview HelpSteps component for sequential instruction presentation
 *
 * This component provides a specialized ordered list display for step-by-step
 * instructions and procedures. Features sequential numbering, HTML content
 * support, and consistent formatting for professional help documentation
 * and user guidance systems.
 */

import { BaseComponentProps } from "@/types";

/**
 * Props interface for HelpSteps component configuration
 * @interface HelpStepsProps
 * @extends {BaseComponentProps}
 */
export interface HelpStepsProps extends BaseComponentProps {
  /** Title for the step sequence */
  title: string;
  /** Array of step instructions with HTML support */
  steps: string[];
}

/**
 * HelpSteps component for sequential instruction presentation
 *
 * @remarks
 * The HelpSteps component delivers structured step-by-step guidance with the following features:
 *
 * **Sequential Design:**
 * - Ordered list (ol) with automatic decimal numbering
 * - Clear visual progression for multi-step processes
 * - Consistent indentation and spacing between steps
 * - Professional typography with proper hierarchy
 *
 * **Content Features:**
 * - HTML content rendering with dangerouslySetInnerHTML
 * - Support for formatted text, links, and inline elements
 * - Flexible step descriptions accommodating various instruction types
 * - Title presentation with bold emphasis for clear identification
 *
 * **Visual Structure:**
 * - Clean left indentation (ml-4) for proper visual alignment
 * - Vertical spacing (space-y-1) between steps for readability
 * - Inside list positioning for compact number display
 * - Consistent margin top (mt-2) for title separation
 *
 * **Typography:**
 * - Strong title formatting for section identification
 * - Standard text formatting for step content
 * - Proper line height and spacing for comfortable reading
 * - Professional appearance with consistent styling
 *
 * **Use Cases:**
 * - Tutorial and onboarding sequences
 * - Feature explanation walkthroughs
 * - Troubleshooting procedures
 * - Setup and configuration instructions
 *
 * **Accessibility:**
 * - Semantic ordered list markup for screen readers
 * - Sequential numbering for logical content flow
 * - Clear visual distinction between title and steps
 * - Keyboard navigation friendly structure
 *
 * @param props - Configuration object for step display
 * @returns HelpSteps component with numbered instruction sequence
 *
 * @example
 * ```tsx
 * // Basic step-by-step instructions
 * <HelpSteps
 *   title="How to Place an Order"
 *   steps={[
 *     "Search for the stock you want to trade",
 *     "Click the 'Buy' or 'Sell' button",
 *     "Enter the quantity and review details",
 *     "Confirm your transaction"
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Steps with HTML formatting and links
 * <HelpSteps
 *   title="Account Setup Process"
 *   steps={[
 *     "Navigate to the <strong>Registration</strong> page",
 *     "Fill in your personal information carefully",
 *     "Verify your email address via the confirmation link",
 *     "Complete your <a href='/profile'>profile setup</a>"
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration within help section
 * <HelpSection
 *   icon="PlayCircle"
 *   iconColor="#10b981"
 *   title="Getting Started"
 *   purpose="Learn the basics of using the Stock Simulator"
 * >
 *   <HelpSteps
 *     title="First Time User Guide"
 *     steps={[
 *       "Create your account and log in",
 *       "Explore the dashboard to understand key metrics",
 *       "Practice with small trades to learn the interface"
 *     ]}
 *   />
 * </HelpSection>
 * ```
 */
export default function HelpSteps({ title, steps }: HelpStepsProps) {
  return (
    <div>
      <p>
        <strong>{title}:</strong>
      </p>
      <ol className="list-decimal list-inside space-y-1 ml-4 mt-2">
        {steps.map((step, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: step }} />
        ))}
      </ol>
    </div>
  );
}
