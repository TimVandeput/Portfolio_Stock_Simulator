/**
 * @fileoverview Page title generation hook for dynamic navigation and SEO.
 *
 * This hook provides intelligent page title generation based on the current pathname,
 * with fallback strategies and navigation integration. It's designed to work with
 * dynamic routing and provides consistent title formatting across the application.
 *
 * The hook provides:
 * - Dynamic page title generation from pathnames
 * - Navigation item integration for consistent naming
 * - Fallback title generation for dynamic routes
 * - Centered title display logic for layout components
 * - Memoized calculations for performance optimization
 * - SEO-friendly title formatting
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useMemo } from "react";
import navItems from "@/lib/constants/navItems";

/**
 * Hook for generating dynamic page titles based on current pathname.
 *
 * Intelligently determines page titles using navigation configuration with
 * fallback strategies for dynamic routes and custom formatting.
 *
 * @param pathname - Current page pathname to generate title for
 * @returns Object with generated page title and display preferences
 *
 * @remarks
 * This hook uses a multi-tier strategy for title generation:
 * 1. Exact match against navigation items for standard pages
 * 2. Base path matching for nested routes (e.g., /portfolio/AAPL)
 * 3. Slug-based formatting for unknown routes
 * 4. Determines if title should be centered based on page type
 *
 * The title generation is memoized for performance and updates only when
 * the pathname changes. Special handling is provided for home pages.
 *
 * @example
 * ```tsx
 * function PageHeader() {
 *   const pathname = usePathname();
 *   const { pageTitle, showCenteredTitle } = usePageTitle(pathname);
 *
 *   return (
 *     <header className={`page-header ${showCenteredTitle ? 'centered' : ''}`}>
 *       <h1>{pageTitle}</h1>
 *     </header>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Dynamic title for stock pages
 * function StockPage() {
 *   const pathname = usePathname(); // "/market/AAPL"
 *   const { pageTitle } = usePageTitle(pathname);
 *
 *   // pageTitle will be "Market" (from navItems)
 *   return (
 *     <div>
 *       <title>{pageTitle} - Stock Simulator</title>
 *       <h1>{pageTitle}</h1>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Layout component with conditional title display
 * function Layout({ children }) {
 *   const pathname = usePathname();
 *   const { pageTitle, showCenteredTitle } = usePageTitle(pathname);
 *
 *   return (
 *     <div className="layout">
 *       {showCenteredTitle && (
 *         <div className="title-bar">
 *           <h1 className="page-title">{pageTitle}</h1>
 *         </div>
 *       )}
 *       <main>{children}</main>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePageTitle(pathname: string) {
  const pageTitle = useMemo(() => {
    const exactMatch = navItems.find((n) => n.href === pathname)?.name;
    if (exactMatch) return exactMatch;

    const basePathMatch = navItems.find((n) => {
      const navHref = n.href.replace(/\/$/, "");
      const cleanPathname = pathname.replace(/\/$/, "");
      return (
        cleanPathname.startsWith(navHref + "/") || cleanPathname === navHref
      );
    })?.name;

    if (basePathMatch) return basePathMatch;

    const slug = pathname.replace(/^\/+/, "");
    return slug ? slug.replace(/[-_]+/g, " ").toUpperCase() : "";
  }, [pathname]);

  const showCenteredTitle = useMemo(
    () => pathname !== "/" && pathname !== "/home",
    [pathname]
  );

  return {
    pageTitle,
    showCenteredTitle,
  };
}
