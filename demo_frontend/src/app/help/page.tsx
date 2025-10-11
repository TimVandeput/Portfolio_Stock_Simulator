/**
 * @packageDocumentation
 * Help and support documentation page route.
 *
 * This module defines the help page that provides comprehensive user
 * documentation, tutorials, FAQs, and support resources for the Stock
 * Simulator platform. It serves as the central knowledge base for users
 * to learn about platform features and troubleshoot common issues.
 *
 * @remarks
 * This Next.js App Router page implements a sophisticated help system
 * with tabbed navigation, searchable content, interactive tutorials,
 * and comprehensive feature documentation. It provides users with
 * self-service support capabilities and detailed platform guidance.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Metadata } from "next";
import HelpClient from "./Client";

/**
 * SEO metadata configuration for the help page.
 *
 * Defines the page title and description for the help and support interface,
 * emphasizing the comprehensive documentation and support resources
 * available to users for learning and troubleshooting.
 *
 * @example
 * ```tsx
 * // This metadata is automatically applied by Next.js
 * export const metadata: Metadata = {
 *   title: "Help",
 *   description: "Help and support"
 * };
 * ```
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Next.js Metadata API}
 */
export const metadata: Metadata = {
  title: "Help",
  description: "Help and support",
};

/**
 * Help page server component.
 *
 * Renders the comprehensive help and support interface that provides users
 * with detailed documentation, tutorials, FAQs, and troubleshooting guides
 * for all aspects of the Stock Simulator platform. This server component
 * organizes extensive help content into an accessible, searchable format.
 *
 * @remarks
 * This server component follows the Next.js App Router pattern while
 * providing access to comprehensive support resources. The help interface
 * includes:
 *
 * **Documentation Categories**:
 * - **Platform Overview**: Introduction and key concepts
 * - **Trading Guides**: Step-by-step trading tutorials
 * - **Portfolio Management**: Investment tracking and analysis
 * - **Account Settings**: Profile and preference management
 * - **Technical Support**: Troubleshooting and common issues
 *
 * **Interactive Features**:
 * - **Tabbed Navigation**: Organized content sections
 * - **Search Functionality**: Quick access to specific topics
 * - **Interactive Tutorials**: Step-by-step guided processes
 * - **FAQ Sections**: Common questions and answers
 * - **Contact Options**: Support escalation pathways
 *
 * **Content Organization**:
 * - **Beginner Guides**: New user onboarding content
 * - **Advanced Features**: Power user documentation
 * - **API References**: Technical integration information
 * - **Video Tutorials**: Visual learning resources
 * - **Best Practices**: Expert tips and recommendations
 *
 * The page serves as a comprehensive self-service support portal,
 * reducing support burden while empowering users with knowledge.
 *
 * @example
 * ```tsx
 * // This component is automatically rendered by Next.js for "/help" route
 * export default function HelpPage() {
 *   return <HelpClient />; // Delegate to interactive help interface
 * }
 * ```
 *
 * @returns The help page React element containing the comprehensive
 * documentation interface with tutorials, guides, and support resources.
 *
 * @see {@link HelpClient} - The client component handling help content interactivity
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Pages Documentation}
 *
 * @public
 */
export default function HelpPage() {
  return <HelpClient />;
}
