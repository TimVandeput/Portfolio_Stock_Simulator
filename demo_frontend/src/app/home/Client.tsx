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
