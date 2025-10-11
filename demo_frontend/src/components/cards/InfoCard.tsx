/**
 * @fileoverview Information display card component for content presentation.
 *
 * This module provides a structured information card component designed for
 * presenting detailed content, explanations, or informational sections within
 * the Stock Simulator platform. It combines iconography with formatted text
 * content in a clean, readable layout optimized for information consumption.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the InfoCard component.
 * @interface InfoCardProps
 * @extends BaseComponentProps
 */
export interface InfoCardProps extends BaseComponentProps {
  /** Icon name for visual content representation */
  icon: string;
  /** CSS class or color string for icon styling */
  iconColor: string;
  /** Information title or heading text */
  title: string;
  /** Detailed description or informational content */
  description: string;
}

/**
 * Information display card with icon, title, and formatted description content.
 *
 * This structured card component provides a professional way to present
 * detailed information, explanations, or educational content within the
 * Stock Simulator platform. It features optimized typography, visual
 * iconography, and content formatting designed for enhanced readability
 * and information consumption.
 *
 * @remarks
 * The component delivers professional information presentation through:
 *
 * **Content Organization**:
 * - **Header Section**: Icon and title combination for quick identification
 * - **Body Content**: Formatted description with optimized readability
 * - **Visual Hierarchy**: Clear separation between title and description
 * - **Icon Integration**: Contextual visual elements for content categorization
 *
 * **Typography Optimization**:
 * - **Readable Fonts**: Platform typography system for optimal readability
 * - **Text Justification**: Justified text alignment for professional appearance
 * - **Line Spacing**: Relaxed line height for comfortable reading experience
 * - **Content Flow**: Logical information flow from title to description
 *
 * **Design System Integration**:
 * - **Neumorphic Cards**: Consistent card styling with platform aesthetics
 * - **Color Theming**: CSS custom properties for dynamic theme support
 * - **Spacing System**: Standardized padding and margin implementations
 * - **Visual Consistency**: Unified design language across information displays
 *
 * **Use Case Applications**:
 * - **Help Documentation**: Explaining features and functionality
 * - **About Sections**: Detailed platform and feature descriptions
 * - **Educational Content**: Tutorial and guide information presentation
 * - **FAQ Displays**: Question and answer formatting
 * - **Legal Information**: Terms, disclaimers, and policy content
 *
 * **Accessibility Features**:
 * - **Semantic Structure**: Proper heading hierarchy with h4 elements
 * - **Screen Reader Support**: Descriptive content for assistive technologies
 * - **Color Accessibility**: High contrast ratios for visual accessibility
 * - **Content Organization**: Logical information flow for screen readers
 *
 * **Layout Characteristics**:
 * - **Flexible Content**: Adapts to varying description lengths
 * - **Responsive Design**: Mobile-optimized layouts and typography
 * - **Grid Compatibility**: Works well in responsive grid systems
 * - **Consistent Sizing**: Uniform card dimensions for aligned presentations
 *
 * **Visual Enhancement**:
 * - **Icon Customization**: Flexible icon selection and color theming
 * - **Content Formatting**: Professional text presentation and layout
 * - **Visual Balance**: Harmonious icon and text proportion
 * - **Brand Integration**: Consistent with platform visual identity
 *
 * The component serves as a versatile tool for information presentation,
 * providing users with clear, well-formatted content while maintaining
 * design system consistency throughout the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic information card usage
 * function AboutSection() {
 *   const infoItems = [
 *     {
 *       icon: "info",
 *       iconColor: "text-blue-500",
 *       title: "Platform Overview",
 *       description: "The Stock Simulator provides a comprehensive trading environment with real-time market data, portfolio management, and advanced analytics tools."
 *     },
 *     {
 *       icon: "shield",
 *       iconColor: "text-green-500",
 *       title: "Security",
 *       description: "Your data is protected with bank-level encryption and secure authentication systems ensuring complete privacy and security."
 *     }
 *   ];
 *
 *   return (
 *     <div className="info-grid">
 *       {infoItems.map((item, index) => (
 *         <InfoCard
 *           key={index}
 *           icon={item.icon}
 *           iconColor={item.iconColor}
 *           title={item.title}
 *           description={item.description}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 *
 * // Help documentation usage
 * function HelpContent() {
 *   return (
 *     <div className="help-section">
 *       <InfoCard
 *         icon="help-circle"
 *         iconColor="text-purple-500"
 *         title="Getting Started"
 *         description="Begin your trading journey by exploring the market section where you can view real-time stock prices, analyze market trends, and execute your first simulated trades with virtual currency."
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for information card content and styling
 * @returns An information display card with icon, title, and formatted
 * description content optimized for readability and information consumption
 *
 * @see {@link DynamicIcon} - Icon component for visual content representation
 *
 * @public
 */
export default function InfoCard({
  icon,
  iconColor,
  title,
  description,
}: InfoCardProps) {
  return (
    <div className="neu-card p-4 rounded-xl">
      <h4 className="font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
        <DynamicIcon iconName={icon} size={16} className={iconColor} />
        {title}
      </h4>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-justify">
        {description}
      </p>
    </div>
  );
}
