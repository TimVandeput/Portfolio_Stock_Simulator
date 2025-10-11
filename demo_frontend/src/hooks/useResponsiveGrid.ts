/**
 * @fileoverview Responsive grid layout hook for adaptive content organization.
 *
 * This hook provides intelligent grid layout configuration based on item count
 * and screen size, automatically adjusting columns and spacing for optimal
 * content presentation across different devices and data sizes.
 *
 * The hook provides:
 * - Dynamic column calculation based on item count
 * - Responsive breakpoint handling for mobile/tablet/desktop
 * - CSS class generation for grid layouts
 * - Performance-optimized memoized calculations
 * - Flexible grid configuration with automatic adjustments
 * - Equal height row management
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import { useMemo } from "react";

/**
 * Hook for creating responsive grid layouts based on content quantity.
 *
 * Automatically calculates optimal grid configuration based on item count
 * and provides responsive CSS classes for adaptive layouts.
 *
 * @param itemCount - Number of items to display in the grid
 * @returns Grid configuration object with responsive settings and CSS classes
 *
 * @remarks
 * This hook intelligently determines grid layout:
 * - 1 item: Single column layout
 * - 2-4 items: Two column layout
 * - 5-9 items: Three column layout
 * - 10+ items: Four column layout
 *
 * The responsive system adapts columns for different screen sizes:
 * - Mobile: Maximum 1 column for readability
 * - Tablet: Maximum 2 columns for balance
 * - Desktop: Full calculated columns for optimal use of space
 *
 * All calculations are memoized for performance optimization.
 *
 * @example
 * ```tsx
 * function DashboardGrid({ cards }) {
 *   const { gridClass, responsiveColumns, containerClass } = useResponsiveGrid(cards.length);
 *
 *   return (
 *     <div className={containerClass}>
 *       <div className={`${gridClass} grid-cols-${responsiveColumns.mobile} sm:grid-cols-${responsiveColumns.tablet} lg:grid-cols-${responsiveColumns.desktop}`}>
 *         {cards.map(card => (
 *           <div key={card.id} className="dashboard-card">
 *             {card.content}
 *           </div>
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Portfolio holdings grid
 * function PortfolioGrid({ holdings }) {
 *   const gridConfig = useResponsiveGrid(holdings.length);
 *
 *   return (
 *     <section className="portfolio-section">
 *       <h2>Your Holdings ({holdings.length})</h2>
 *       <div className={`${gridConfig.gridClass} grid-cols-1 sm:grid-cols-${gridConfig.responsiveColumns.tablet} lg:grid-cols-${gridConfig.columns}`}>
 *         {holdings.map(holding => (
 *           <HoldingCard
 *             key={holding.symbol}
 *             holding={holding}
 *             className="h-full" // Equal height with auto-rows-fr
 *           />
 *         ))}
 *       </div>
 *     </section>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Dynamic content grid with loading states
 * function ContentGrid({ items, isLoading }) {
 *   const { containerClass, gridClass, columns } = useResponsiveGrid(items.length);
 *
 *   if (isLoading) {
 *     // Show skeleton grid with same layout
 *     const skeletonItems = Array(8).fill(null);
 *     const skeletonConfig = useResponsiveGrid(skeletonItems.length);
 *
 *     return (
 *       <div className={skeletonConfig.containerClass}>
 *         <div className={skeletonConfig.gridClass}>
 *           {skeletonItems.map((_, index) => (
 *             <div key={index} className="skeleton-card" />
 *           ))}
 *         </div>
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <div className={containerClass}>
 *       <p>Showing {items.length} items in {columns} columns</p>
 *       <div className={gridClass}>
 *         {items.map(item => (
 *           <ContentCard key={item.id} item={item} />
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export function useResponsiveGrid(itemCount: number) {
  const gridConfig = useMemo(() => {
    const baseColumns =
      itemCount <= 1 ? 1 : itemCount <= 4 ? 2 : itemCount <= 9 ? 3 : 4;

    return {
      columns: baseColumns,
      containerClass: "w-full max-w-none",
      gridClass: "grid gap-4 sm:gap-6 md:gap-8 auto-rows-fr",
      responsiveColumns: {
        mobile: Math.min(baseColumns, 1),
        tablet: Math.min(baseColumns, 2),
        desktop: baseColumns,
      },
    };
  }, [itemCount]);

  const gridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(1, 1fr)",
      gap: "1rem",
      width: "100%",
      minHeight: "auto",
    }),
    []
  );

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: "100%",
      padding: "1rem",
      paddingTop: "2rem",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "calc(100vh - 6rem)",
      overflowY: "auto" as const,
    }),
    []
  );

  return {
    ...gridConfig,
    gridStyle,
    containerStyle,
  };
}
