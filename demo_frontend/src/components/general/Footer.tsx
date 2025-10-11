/**
 * @fileoverview Professional footer component with branding and dynamic copyright.
 *
 * This module provides a consistent footer component that serves as the bottom
 * navigation and branding element for the Stock Simulator platform. It features
 * dynamic copyright year updates, sticky positioning, themed styling, and
 * professional visual elements integrated with the platform's design system.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the Footer component.
 * @interface FooterProps
 * @extends BaseComponentProps
 */
export interface FooterProps extends BaseComponentProps {}

/**
 * Professional footer component with branding, dynamic copyright, and sticky positioning.
 *
 * This essential layout component provides consistent footer branding and
 * copyright information throughout the Stock Simulator platform. It features
 * sticky positioning for persistent visibility, dynamic copyright year updates,
 * themed styling integration, and professional visual presentation that
 * complements the platform's overall design language.
 *
 * @remarks
 * The component delivers professional footer functionality through:
 *
 * **Branding Elements**:
 * - **Copyright Notice**: Dynamic copyright with current year calculation
 * - **Platform Identity**: Clear "Stock Simulator" branding display
 * - **Professional Typography**: Semibold font weight for brand prominence
 * - **Legal Compliance**: Proper copyright symbol and year formatting
 *
 * **Layout and Positioning**:
 * - **Sticky Positioning**: Remains visible at bottom of viewport
 * - **High Z-index**: Positioned above other content (z-10)
 * - **Full Width**: Complete horizontal coverage of viewport
 * - **Centered Content**: Horizontally centered copyright text
 * - **Consistent Height**: Minimum 40px height for uniform appearance
 *
 * **Visual Design System**:
 * - **Theme Integration**: CSS custom properties for dynamic theming
 * - **Surface Background**: Consistent background with platform surfaces
 * - **Shadow Effects**: Subtle upward shadow for visual separation
 * - **Color Coordination**: Primary text color for optimal contrast
 * - **Responsive Design**: Consistent appearance across all screen sizes
 *
 * **Dynamic Features**:
 * - **Auto-updating Year**: Automatically displays current copyright year
 * - **JavaScript Date**: Uses native Date object for year calculation
 * - **No Manual Updates**: Eliminates need for annual copyright updates
 * - **Future-proof**: Automatically remains current indefinitely
 *
 * **Accessibility Features**:
 * - **Semantic HTML**: Proper footer element for document structure
 * - **Screen Reader Support**: Clear copyright information for assistive tech
 * - **High Contrast**: Optimal color contrast for visual accessibility
 * - **Keyboard Navigation**: Accessible via standard navigation patterns
 *
 * **Technical Implementation**:
 * - **Client-side Rendering**: Ensures accurate year calculation
 * - **Minimal Performance**: Lightweight component with minimal overhead
 * - **CSS Variables**: Leverages platform theming system
 * - **No External Dependencies**: Pure React implementation
 *
 * **Layout Integration**:
 * - **Sticky Footer**: Remains at bottom regardless of content height
 * - **Content Separation**: Visual shadow provides content boundary
 * - **Consistent Spacing**: Uniform padding for professional appearance
 * - **Full Coverage**: Edge-to-edge footer coverage
 *
 * **Brand Consistency**:
 * - **Unified Styling**: Matches platform design language
 * - **Professional Appearance**: Business-appropriate visual presentation
 * - **Legal Compliance**: Proper copyright notice formatting
 * - **Brand Recognition**: Clear platform identification
 *
 * The component serves as an essential branding and legal element providing
 * consistent footer presence throughout the Stock Simulator platform while
 * maintaining professional appearance, legal compliance, and seamless
 * integration with the overall design system.
 *
 * @example
 * ```tsx
 * // Basic footer usage
 * function AppLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <div className="app-layout">
 *       <Header />
 *       <main className="main-content">
 *         {children}
 *       </main>
 *       <Footer />
 *     </div>
 *   );
 * }
 *
 * // Layout with client wrapper
 * function ClientLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <div className="client-container">
 *       <div className="content-area">
 *         {children}
 *       </div>
 *       <Footer />
 *     </div>
 *   );
 * }
 *
 * // Page-specific layout
 * function HomePage() {
 *   return (
 *     <div className="page-container">
 *       <Header />
 *       <main>
 *         <h1>Welcome to Stock Simulator</h1>
 *         <p>Your trading platform content here</p>
 *       </main>
 *       <Footer />
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for footer configuration
 * @returns A professional footer component with dynamic copyright, branding,
 * sticky positioning, and integrated theming for consistent platform presence
 *
 * @see {@link BaseComponentProps} - Base properties interface for components
 *
 * @public
 */
export default function Footer(props: FooterProps = {}) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="sticky bottom-0 z-10 w-full flex items-center justify-center footer-shadow-above"
      style={{
        background: "var(--bg-surface)",
        minHeight: "2.5rem",
      }}
    >
      <div className="flex justify-center py-2">
        {" "}
        <span
          className="font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          &copy; Stock Simulator {year}
        </span>
      </div>
    </footer>
  );
}
