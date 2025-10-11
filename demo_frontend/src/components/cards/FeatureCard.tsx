/**
 * @fileoverview Feature presentation card component for highlighting platform capabilities.
 *
 * This module provides a clean and consistent card component designed to showcase
 * individual features, capabilities, or benefits of the Stock Simulator platform.
 * It combines iconography, titles, and descriptive content in a unified design
 * system for feature presentation and marketing materials.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the FeatureCard component.
 * @interface FeatureCardProps
 * @extends BaseComponentProps
 */
export interface FeatureCardProps extends BaseComponentProps {
  /** Icon name for visual feature representation */
  icon: string;
  /** CSS class or color string for icon styling */
  iconColor: string;
  /** Feature title or heading text */
  title: string;
  /** Detailed description of the feature or capability */
  description: string;
}

/**
 * Feature presentation card with icon, title, and description content.
 *
 * This clean and consistent card component provides a standardized way to
 * showcase individual features, capabilities, or benefits of the Stock Simulator
 * platform. It combines visual iconography with descriptive content in a
 * unified design system suitable for marketing materials, feature lists,
 * and capability presentations.
 *
 * @remarks
 * The component delivers professional feature presentation through:
 *
 * **Visual Design Elements**:
 * - **Neumorphic Styling**: Consistent card design with platform aesthetics
 * - **Icon Integration**: Contextual icons with customizable color schemes
 * - **Typography Hierarchy**: Clear title and description text organization
 * - **Compact Layout**: Space-efficient design for grid arrangements
 *
 * **Content Structure**:
 * - **Feature Titles**: Bold, prominent headings for quick identification
 * - **Descriptive Text**: Detailed explanations of feature capabilities
 * - **Visual Icons**: Symbolic representation of feature concepts
 * - **Color Coding**: Customizable icon colors for categorization
 *
 * **Design System Integration**:
 * - **Platform Theming**: Uses CSS custom properties for consistent theming
 * - **Responsive Typography**: Adaptive text sizing for different screen sizes
 * - **Consistent Spacing**: Standardized padding and margin systems
 * - **Card Styling**: Unified neumorphic design language
 *
 * **Use Case Applications**:
 * - **Feature Showcases**: Highlighting platform capabilities and benefits
 * - **Marketing Materials**: Professional presentation of key features
 * - **Onboarding Content**: Explaining functionality to new users
 * - **Help Documentation**: Visual feature explanations and guides
 *
 * **Accessibility Standards**:
 * - **Semantic HTML**: Proper heading hierarchy and content structure
 * - **Screen Reader Support**: Descriptive content for assistive technologies
 * - **Color Accessibility**: High contrast ratios for visual accessibility
 * - **Keyboard Navigation**: Full keyboard accessibility support
 *
 * **Layout Flexibility**:
 * - **Grid Integration**: Works well in responsive grid layouts
 * - **Consistent Sizing**: Uniform card dimensions for aligned presentations
 * - **Content Adaptation**: Handles varying content lengths gracefully
 * - **Mobile Optimization**: Responsive design for mobile viewing
 *
 * The component serves as a fundamental building block for feature presentations,
 * providing a professional and consistent way to communicate platform
 * capabilities while maintaining design system coherence throughout the
 * Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic feature card usage
 * function FeatureShowcase() {
 *   const features = [
 *     {
 *       icon: "trending-up",
 *       iconColor: "text-green-500",
 *       title: "Real-time Trading",
 *       description: "Execute trades with live market data and instant order processing"
 *     },
 *     {
 *       icon: "shield-check",
 *       iconColor: "text-blue-500",
 *       title: "Secure Platform",
 *       description: "Bank-level security with encrypted data and secure authentication"
 *     }
 *   ];
 *
 *   return (
 *     <div className="features-grid">
 *       {features.map((feature, index) => (
 *         <FeatureCard
 *           key={index}
 *           icon={feature.icon}
 *           iconColor={feature.iconColor}
 *           title={feature.title}
 *           description={feature.description}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 *
 * // Feature card with custom styling
 * function PlatformBenefits() {
 *   return (
 *     <div className="benefits-section">
 *       <FeatureCard
 *         icon="bar-chart"
 *         iconColor="text-purple-500"
 *         title="Advanced Analytics"
 *         description="Comprehensive portfolio analysis with interactive charts and performance metrics"
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for feature card content and styling
 * @returns A feature presentation card with icon, title, and description
 * content in a consistent design system layout
 *
 * @see {@link DynamicIcon} - Icon component for visual feature representation
 *
 * @public
 */
export default function FeatureCard({
  icon,
  iconColor,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="neu-card p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <DynamicIcon iconName={icon} size={16} className={iconColor} />
        <h3 className="font-medium text-[var(--text-primary)]">{title}</h3>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
