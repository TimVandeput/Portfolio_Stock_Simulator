"use client";

import { useRouter } from "next/navigation";
import { filterNavItemsByRole } from "@/lib/utils";
import { navItems } from "@/lib/constants/navItems";
import type { NavItem } from "@/types";
import { useAccessControl } from "@/hooks/useAuth";
import { useAnimationSequence } from "@/hooks/useAnimationSequence";
import { useResponsiveGrid } from "@/hooks/useResponsiveGrid";
import { useNotificationStatus } from "@/hooks/useNotificationStatus";
import DynamicIcon from "@/components/ui/DynamicIcon";

interface DashboardCardProps {
  item: NavItem;
  index: number;
  onNavigate: (href: string) => void;
  getItemStyle: (index: number) => React.CSSProperties;
  notificationStatus?: {
    statusText: string;
    total: number;
    unread: number;
  };
}

function DashboardCard({
  item,
  index,
  onNavigate,
  getItemStyle,
  notificationStatus,
}: DashboardCardProps) {
  const getCardContent = () => {
    const baseContent = {
      title: item.name,
      description: "",
      icon: item.icon || "info",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      textColor: "var(--text-primary)",
      descriptionColor: "var(--text-secondary)",
    };

    switch (item.name) {
      case "MARKETS":
        return {
          ...baseContent,
          title: "Markets",
          description:
            "Live stock streaming • Buy securities • Real-time market data",
          gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        };
      case "PORTFOLIO":
        return {
          ...baseContent,
          title: "Portfolio",
          description:
            "View current holdings and portfolio value • Sell stocks • Performance tracking",
          gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        };
      case "ORDERS":
        return {
          ...baseContent,
          title: "Orders",
          description:
            "Overview of all transactions • Export options • Trade history analysis",
          gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        };
      case "GRAPHS":
        return {
          ...baseContent,
          title: "Analytics",
          description:
            "Interactive performance charts • Historical data visualization for your owned stocks",
          gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
        };
      case "NOTIFICATIONS":
        return {
          ...baseContent,
          title: "Notifications",
          description: notificationStatus
            ? `${notificationStatus.statusText} • ${notificationStatus.total} total notifications`
            : "Account alerts • System notifications • Trading updates",
          gradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        };
      case "ABOUT":
        return {
          ...baseContent,
          title: "About",
          description:
            "Project information • Meet the designer • Disclaimers and legal information",
          gradient: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
        };
      case "HELP":
        return {
          ...baseContent,
          title: "Help Center",
          description:
            "Comprehensive guide • App functionality explanations • Trading tutorials",
          gradient: "linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)",
        };
      case "SYMBOLS":
        return {
          ...baseContent,
          title: "Symbol Management",
          description:
            "Stock symbol administration • Market data control • Symbol configuration",
          gradient: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
        };
      default:
        return baseContent;
    }
  };

  const content = getCardContent();

  return (
    <div
      className="group cursor-pointer w-full h-full"
      onClick={() => onNavigate(item.href)}
    >
      <div
        className="relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 h-full w-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px] transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
        style={{
          background: content.gradient,
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          ...getItemStyle(index),
        }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-10">
          <DynamicIcon
            iconName={content.icon}
            className="w-full h-full transform rotate-12"
            style={{ color: "#ffffff" }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 p-1.5 sm:p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DynamicIcon
                iconName={content.icon}
                size={20}
                className="sm:w-6 sm:h-6"
                style={{ color: "#ffffff" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base sm:text-lg md:text-xl leading-tight mb-1">
                {content.title}
              </h3>
              {item.name === "NOTIFICATIONS" &&
                notificationStatus &&
                notificationStatus.unread > 0 && (
                  <div className="inline-flex items-center justify-center px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white/30 rounded-full text-xs font-semibold text-white mb-1 sm:mb-2">
                    {notificationStatus.unread} new
                  </div>
                )}
            </div>
          </div>

          <div className="mt-2 sm:mt-4">
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
              {content.description}
            </p>
          </div>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </div>
    </div>
  );
}

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4"
            style={{
              borderColor: "var(--loader-spinner)",
              borderTopColor: "transparent",
            }}
          />
          <span
            className="text-lg font-medium opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            Loading your dashboard...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="dashboard-page-container"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="dashboard-content-wrapper">
        {/* Welcome Header - Flexible sizing */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8 max-w-4xl w-full">
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
        <div className="w-full max-w-7xl flex-1 flex items-start justify-center">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr">
            {dashboardItems.map((item: NavItem, index: number) => (
              <div key={item.href} className="dashboard-card w-full">
                <DashboardCard
                  item={item}
                  index={index}
                  onNavigate={handleNavigate}
                  getItemStyle={getItemStyle}
                  notificationStatus={
                    item.name === "NOTIFICATIONS"
                      ? notificationStatus
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
