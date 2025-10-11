/**
 * @packageDocumentation
 * About page route for comprehensive project information and documentation.
 *
 * This module defines the about page that provides comprehensive information
 * about the Stock Simulator project, including project details, developer
 * biography, technology stack, and important legal disclaimers. It serves
 * as the primary information hub for users seeking platform details.
 *
 * @remarks
 * This Next.js App Router page implements a sophisticated information
 * presentation system with tabbed navigation, visual content organization,
 * and comprehensive project documentation. It provides transparency about
 * the platform's purpose, capabilities, and limitations while building
 * user confidence through detailed information disclosure.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Metadata } from "next";
import AboutClient from "./Client";

/**
 * SEO metadata configuration for the about page.
 *
 * Defines the page title and description for the project information interface,
 * optimized for search engines and providing clear context about the comprehensive
 * project documentation and developer information available on this page.
 *
 * @example
 * ```tsx
 * // This metadata is automatically applied by Next.js
 * export const metadata: Metadata = {
 *   title: "About - Stock Simulator",
 *   description: "Learn more about this project, its creator, and important disclaimers"
 * };
 * ```
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Next.js Metadata API}
 */
export const metadata: Metadata = {
  title: "About - Stock Simulator",
  description:
    "Learn more about this project, its creator, and important disclaimers",
};

/**
 * About page server component.
 *
 * Renders the comprehensive project information interface that provides users
 * with detailed insights into the Stock Simulator platform, developer background,
 * technology implementation, and important usage disclaimers. This server
 * component organizes complex information into an accessible, tabbed format.
 *
 * @remarks
 * This server component follows the Next.js App Router pattern while
 * providing access to comprehensive project documentation. The about
 * interface includes:
 *
 * **Information Categories**:
 * - **Project Overview**: Platform purpose, features, and capabilities
 * - **Technology Stack**: Development frameworks and implementation details
 * - **Developer Biography**: Creator background, expertise, and philosophy
 * - **Legal Disclaimers**: Important usage terms, limitations, and educational purpose
 * - **Demo Constraints**: Transparent communication about platform limitations
 *
 * **Content Presentation**:
 * - **Tabbed Navigation**: Organized information sections for easy browsing
 * - **Visual Elements**: Feature cards, info cards, and iconography
 * - **Responsive Design**: Optimized layouts for all device types
 * - **Professional Presentation**: Clean, modern interface design
 *
 * **Educational Value**:
 * - **Transparency**: Clear communication about demo nature and constraints
 * - **Learning Context**: Educational objectives and appropriate usage
 * - **Risk Awareness**: Important financial education messaging
 * - **Platform Scope**: Realistic expectations about simulation capabilities
 *
 * **User Experience**:
 * - **Information Architecture**: Logical organization of complex content
 * - **Progressive Disclosure**: Information revealed through navigation
 * - **Accessibility**: Full keyboard navigation and screen reader support
 * - **Performance**: Optimized loading and rendering for smooth interaction
 *
 * The page serves as a crucial trust-building and educational resource,
 * providing users with comprehensive understanding of the platform while
 * establishing appropriate expectations for the trading simulation experience.
 *
 * @example
 * ```tsx
 * // This component is automatically rendered by Next.js for "/about" route
 * export default function AboutPage() {
 *   return <AboutClient />; // Delegate to interactive information interface
 * }
 * ```
 *
 * @returns The about page React element containing the comprehensive project
 * information interface with tabbed content, developer details, and disclaimers.
 *
 * @see {@link AboutClient} - The client component handling information presentation
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Pages Documentation}
 *
 * @public
 */
export default function AboutPage() {
  return <AboutClient />;
}
