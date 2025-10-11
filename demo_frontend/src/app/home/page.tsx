/**
 * @packageDocumentation
 * Dashboard page route for authenticated users.
 *
 * This module defines the main dashboard page that serves as the central hub
 * for authenticated users of the Stock Simulator. It provides quick access
 * to all major application features through an interactive card-based interface.
 *
 * @remarks
 * This Next.js App Router page serves as the primary landing destination for
 * authenticated users after successful login. It implements a responsive
 * dashboard design with animated navigation cards that adapt to different
 * user roles and screen sizes.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { Metadata } from "next";
import HomeClient from "./Client";

/**
 * SEO metadata configuration for the dashboard page.
 *
 * Defines the page title and description for the main dashboard, optimized
 * for search engines and providing clear context about the application's
 * central hub functionality.
 *
 * @example
 * ```tsx
 * // This metadata is automatically applied by Next.js
 * export const metadata: Metadata = {
 *   title: "Dashboard",
 *   description: "Main dashboard of the application"
 * };
 * ```
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Next.js Metadata API}
 */
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Main dashboard of the application",
};

/**
 * Dashboard page server component.
 *
 * Renders the main dashboard page that serves as the central navigation hub
 * for authenticated users. This server component delegates all interactive
 * functionality to the HomeClient component while providing the page structure
 * and metadata.
 *
 * @remarks
 * This server component follows the Next.js App Router pattern, handling
 * static rendering concerns while delegating interactive features to the
 * client component. The dashboard provides:
 *
 * - **Role-based Navigation**: Cards filtered by user permissions
 * - **Responsive Design**: Adaptive grid layout for all screen sizes
 * - **Animated Interface**: Smooth transitions and loading states
 * - **Real-time Status**: Live notification indicators and data updates
 *
 * The page is only accessible to authenticated users and automatically
 * adjusts the available navigation options based on user roles and permissions.
 *
 * @example
 * ```tsx
 * // This component is automatically rendered by Next.js for "/home" route
 * export default function HomePage() {
 *   return <HomeClient />; // Delegate to interactive client component
 * }
 * ```
 *
 * @returns The dashboard page React element containing the interactive
 * dashboard grid with navigation cards and welcome content.
 *
 * @see {@link HomeClient} - The client component handling dashboard interactivity
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts | Next.js Pages Documentation}
 *
 * @public
 */
export default function HomePage() {
  return <HomeClient />;
}
