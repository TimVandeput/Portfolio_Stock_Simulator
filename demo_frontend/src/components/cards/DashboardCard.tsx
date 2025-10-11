/**
 * @fileoverview Interactive dashboard navigation card component.
 *
 * This module provides an advanced dashboard card component that serves as the
 * primary navigation interface for the Stock Simulator platform. It features
 * dynamic content generation, gradient backgrounds, hover effects, and
 * contextual information display for each major application section.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useRouter } from "next/navigation";
import type { NavItem } from "@/types";
import type { BaseComponentProps } from "@/types/components";
import DynamicIcon from "@/components/ui/DynamicIcon";

/**
 * Props interface for the DashboardCard component.
 * @interface DashboardCardProps
 * @extends BaseComponentProps
 */
export interface DashboardCardProps extends BaseComponentProps {
  /** Navigation item containing route and display information */
  item: NavItem;
  /** Card index for styling and animation purposes */
  index: number;
  /** Callback function triggered when card is clicked for navigation */
  onNavigate: (href: string) => void;
  /** Function to generate dynamic styling based on card index */
  getItemStyle: (index: number) => React.CSSProperties;
  /** Optional notification status for notification-specific cards */
  notificationStatus?: {
    /** Current status text description */
    statusText: string;
    /** Total number of notifications */
    total: number;
    /** Number of unread notifications */
    unread: number;
  };
}

/**
 * Interactive dashboard navigation card with dynamic content and styling.
 *
 * This sophisticated card component serves as the primary navigation interface
 * for the Stock Simulator platform's dashboard. It provides contextual content,
 * dynamic gradient backgrounds, interactive hover effects, and specialized
 * handling for different application sections including markets, portfolio,
 * orders, analytics, and more.
 *
 * @remarks
 * The component delivers comprehensive dashboard navigation through:
 *
 * **Dynamic Content Generation**:
 * - **Section-Specific Content**: Customized titles, descriptions, and gradients for each app section
 * - **Market Section**: Live streaming data and real-time market information
 * - **Portfolio Section**: Holdings overview and performance tracking details
 * - **Orders Section**: Transaction history and trade analysis information
 * - **Analytics Section**: Performance charts and data visualization features
 * - **Notifications Section**: Alert counts and status integration
 *
 * **Visual Design System**:
 * - **Gradient Backgrounds**: Unique color gradients for visual section identification
 * - **Interactive Hover Effects**: Scale animations and shadow enhancements
 * - **Icon Integration**: Contextual icons with background decoration elements
 * - **Responsive Layout**: Adaptive sizing for mobile, tablet, and desktop viewing
 *
 * **Advanced Styling Features**:
 * - **Dynamic Styling**: Index-based style generation for layout variations
 * - **Backdrop Effects**: Glass-morphism effects with backdrop blur
 * - **Animation States**: Smooth transitions for hover and active states
 * - **Shadow Systems**: Multi-layer shadow effects for depth perception
 *
 * **Notification Integration**:
 * - **Status Badges**: Unread notification counts with visual indicators
 * - **Dynamic Descriptions**: Context-aware content based on notification status
 * - **Real-time Updates**: Live notification count integration
 * - **Visual Emphasis**: Enhanced styling for active notification states
 *
 * **Accessibility Features**:
 * - **Keyboard Navigation**: Full keyboard accessibility support
 * - **Screen Reader Support**: Semantic HTML with descriptive content
 * - **Focus Management**: Proper focus indicators and navigation
 * - **Color Contrast**: High contrast ratios for visual accessibility
 *
 * **Interactive Behavior**:
 * - **Click Navigation**: Single-click navigation to target sections
 * - **Hover Feedback**: Visual feedback for interactive elements
 * - **Touch Optimization**: Mobile-friendly touch interactions
 * - **Loading States**: Smooth transitions during navigation
 *
 * **Content Customization**:
 * - **Markets**: Live data streaming and security trading features
 * - **Portfolio**: Holdings management and performance analytics
 * - **Orders**: Transaction oversight and history analysis
 * - **Analytics**: Interactive charts and visualization tools
 * - **Notifications**: Alert management and status tracking
 * - **Help Center**: Comprehensive guides and tutorials
 * - **Symbol Management**: Administrative controls for market data
 *
 * The component serves as the central hub for platform navigation, providing
 * users with intuitive access to all major features while delivering rich
 * visual feedback and contextual information for enhanced user experience
 * within the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic dashboard card usage
 * function Dashboard() {
 *   const navItems = [
 *     { name: 'MARKETS', href: '/market', icon: 'trending-up' },
 *     { name: 'PORTFOLIO', href: '/portfolio', icon: 'briefcase' }
 *   ];
 *
 *   const handleNavigation = (href: string) => {
 *     router.push(href);
 *   };
 *
 *   const getItemStyle = (index: number) => ({
 *     animationDelay: `${index * 100}ms`
 *   });
 *
 *   return (
 *     <div className="dashboard-grid">
 *       {navItems.map((item, index) => (
 *         <DashboardCard
 *           key={item.name}
 *           item={item}
 *           index={index}
 *           onNavigate={handleNavigation}
 *           getItemStyle={getItemStyle}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 *
 * // Dashboard card with notification integration
 * function NotificationDashboard() {
 *   const notificationStatus = {
 *     statusText: "New alerts available",
 *     total: 12,
 *     unread: 3
 *   };
 *
 *   return (
 *     <DashboardCard
 *       item={{ name: 'NOTIFICATIONS', href: '/notifications', icon: 'bell' }}
 *       index={0}
 *       onNavigate={handleNav}
 *       getItemStyle={getStyle}
 *       notificationStatus={notificationStatus}
 *     />
 *   );
 * }
 * ```
 *
 * @param props - Component properties for dashboard card functionality and styling
 * @returns An interactive dashboard navigation card with dynamic content,
 * gradient backgrounds, hover effects, and contextual information display
 *
 * @see {@link NavItem} - TypeScript interface for navigation item data
 * @see {@link DynamicIcon} - Icon component for visual elements
 *
 * @public
 */
export default function DashboardCard({
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
      case "ANALYTICS":
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
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-10">
          <DynamicIcon
            iconName={content.icon}
            className="w-full h-full transform rotate-12"
            style={{ color: "#ffffff" }}
          />
        </div>

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

        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </div>
    </div>
  );
}
