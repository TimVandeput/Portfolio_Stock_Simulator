/**
 * @packageDocumentation
 * Application root page and authentication entry point.
 *
 * This module defines the root route ("/") of the Stock Simulator application,
 * serving as the primary authentication gateway. It handles user authentication
 * state detection and routing logic for logged-in users.
 *
 * @remarks
 * This Next.js App Router page implements server-side authentication checking
 * using HTTP-only cookies. If a valid authentication token is detected, users
 * are automatically redirected to the home dashboard. Otherwise, the login
 * interface is presented.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import LoginClient from "./Client";

/**
 * SEO metadata configuration for the login page.
 *
 * Defines the page title and description for the authentication page,
 * optimized for search engines and social media sharing.
 *
 * @example
 * ```tsx
 * // This metadata is automatically applied by Next.js
 * export const metadata: Metadata = {
 *   title: "Login",
 *   description: "Sign in to your account"
 * };
 * ```
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata | Next.js Metadata API}
 */
export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
};

/**
 * Root page server component with authentication routing.
 *
 * This async server component handles the application's main entry point,
 * implementing server-side authentication state detection and automatic
 * routing for authenticated users. It serves as the gateway to the entire
 * Stock Simulator application.
 *
 * @remarks
 * The component performs server-side authentication checking by reading
 * HTTP-only cookies. This approach provides better security compared to
 * client-side token storage. If a valid auth token is found, the user is
 * redirected to the home dashboard, otherwise the login interface is rendered.
 *
 * The authentication flow follows these steps:
 * 1. Server reads HTTP-only cookies on page load
 * 2. Checks for presence of "auth.access" token
 * 3. Redirects authenticated users to "/home"
 * 4. Renders login form for unauthenticated users
 *
 * @example
 * ```tsx
 * // This component is automatically rendered by Next.js for "/" route
 * export default async function Home() {
 *   // Server-side authentication check
 *   const cookieStore = await cookies();
 *   const token = cookieStore.get("auth.access")?.value;
 *
 *   if (token) {
 *     redirect("/home"); // Authenticated user
 *   }
 *
 *   return <LoginClient />; // Show login form
 * }
 * ```
 *
 * @returns Promise resolving to the login interface for unauthenticated users,
 * or triggers a redirect to "/home" for authenticated users.
 *
 * @see {@link LoginClient} - The client component handling login/register forms
 * @see {@link https://nextjs.org/docs/app/building-your-application/authentication | Next.js Authentication}
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/cookies | Next.js Cookies API}
 *
 * @public
 */
export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth.access")?.value;
  if (token) {
    redirect("/home");
  }

  return <LoginClient />;
}
