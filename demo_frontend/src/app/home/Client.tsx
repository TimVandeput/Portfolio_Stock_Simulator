/**
 * @fileoverview Interactive dashboard client component for the Stock Simulator.
 *
 * This module provides the main dashboard interface featuring role-based navigation,
 * responsive design, animated card transitions, and real-time status indicators.
 * It serves as the central hub for authenticated users to access all application features.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useRouter } from "next/navigation";
import { filterNavItemsByRole } from "@/lib/utils";
import { navItems } from "@/lib/constants/navItems";
import type { NavItem } from "@/types";
import { useAccessControl } from "@/hooks/useAuth";
import { useAnimationSequence } from "@/hooks/useAnimationSequence";
import { useResponsiveGrid } from "@/hooks/useResponsiveGrid";
import { useNotificationStatus } from "@/hooks/useNotificationStatus";
import DashboardCard from "@/components/cards/DashboardCard";
import Loader from "@/components/ui/Loader";

/**
 * Interactive dashboard client component with role-based navigation.
 *
 * This client component provides a comprehensive dashboard interface that adapts
 * to user roles, screen sizes, and authentication state. It features animated
 * navigation cards, real-time status indicators, and responsive grid layouts
 * for optimal user experience across all devices.
 *
 * @remarks
 * The component implements several sophisticated features:
 *
 * **Authentication & Authorization**:
 * - Enforces user authentication with automatic redirects
 * - Filters navigation cards based on user roles and permissions
 * - Provides loading states during authentication checks
 *
 * **Responsive Design**:
 * - Adaptive grid layout (1-4 columns based on screen size)
 * - Flexible card sizing and spacing
 * - Mobile-first responsive typography and layouts
 *
 * **Animation & UX**:
 * - Entrance animations with staggered timing
 * - Smooth transitions between states
 * - Loading indicators for better perceived performance
 *
 * **Real-time Features**:
 * - Live notification status indicators
 * - Dynamic card filtering based on user permissions
 * - Immediate navigation with Next.js router integration
 *
 * The dashboard serves as the central navigation hub, providing quick access
 * to portfolio management, market data, order history, symbols library,
 * and other key application features.
 *
 * @example
 * ```tsx
 * // Rendered by the HomePage server component
 * function HomeClient() {
 *   const { isLoading, hasAccess, role } = useAccessControl({
 *     requireAuth: true
 *   });
 *
 *   const filteredItems = filterNavItemsByRole(navItems, role);
 *   const { gridStyle } = useResponsiveGrid(filteredItems.length);
 *
 *   return (
 *     <div className="page-container">
 *       <div className="dashboard-grid" style={gridStyle}>
 *         {filteredItems.map((item, index) => (
 *           <DashboardCard key={item.href} item={item} index={index} />
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns The interactive dashboard interface with animated navigation cards,
 * welcome header, and responsive grid layout, or a loading state during
 * authentication checks.
 *
 * @see {@link useAccessControl} - Hook managing authentication and authorization
 * @see {@link useAnimationSequence} - Hook controlling card entrance animations
 * @see {@link useResponsiveGrid} - Hook managing responsive grid layouts
 * @see {@link useNotificationStatus} - Hook providing real-time notification status
 * @see {@link DashboardCard} - Individual navigation card component
 * @see {@link filterNavItemsByRole} - Utility for role-based navigation filtering
 *
 * @public
 */
export default function HomeClient() {
  const router = useRouter();
  const notificationStatus = useNotificationStatus();

  const { isLoading, hasAccess, accessError, role } = useAccessControl({
    requireAuth: true,
  });

  const roleFilteredItems = role ? filterNavItemsByRole(navItems, role) : [];
  const dashboardItems = roleFilteredItems.filter(
    (item) => !item.hideOnDashboard
  );

  const { gridStyle, containerStyle } = useResponsiveGrid(
    dashboardItems.length
  );
  const { animateFromLogin, getItemStyle } = useAnimationSequence({
    itemCount: dashboardItems.length,
  });

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  if (isLoading || !role || dashboardItems.length === 0) {
    return (
      <div className="min-h-[60vh]">
        <Loader cover="main" />
      </div>
    );
  }

  return (
    <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="page-card p-4 sm:p-6 rounded-2xl max-w-7xl mx-auto w-full">
        {/* Welcome Header - Flexible sizing */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8 max-w-4xl mx-auto w-full">
          <h1
            className="dashboard-title font-bold mb-2 sm:mb-3 lg:mb-4"
            style={{
              color: "var(--text-primary)",
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
              lineHeight: "1.2",
            }}
          >
            Welcome to Stock Simulator
          </h1>
          <p
            className="dashboard-subtitle opacity-80 leading-relaxed max-w-2xl mx-auto"
            style={{
              color: "var(--text-secondary)",
              fontSize: "clamp(0.875rem, 2vw, 1.125rem)",
            }}
          >
            Manage your portfolio, track market trends, and stay informed with
            real-time data.
          </p>
        </div>

        {/* Dashboard Grid - Flexible and responsive */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr">
          {dashboardItems.map((item: NavItem, index: number) => (
            <div key={item.href} className="dashboard-card w-full">
              <DashboardCard
                item={item}
                index={index}
                onNavigate={handleNavigate}
                getItemStyle={getItemStyle}
                notificationStatus={
                  item.name === "NOTIFICATIONS" ? notificationStatus : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
