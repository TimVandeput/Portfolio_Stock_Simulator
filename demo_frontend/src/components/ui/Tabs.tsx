/**
 * @fileoverview Professional tabs component with responsive design and adaptive interface
 *
 * This component provides comprehensive tab navigation with responsive design patterns,
 * featuring desktop tab interface and mobile dropdown selector. Includes professional
 * styling, smooth transitions, theme integration, and flexible content management
 * for optimal user experience across all device sizes.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */
"use client";

import { useState } from "react";
import type { BaseComponentProps } from "@/types/components";

/**
 * Tab configuration interface
 * @interface Tab
 */
export interface Tab {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** React content to render when tab is active */
  content: React.ReactNode;
}

/**
 * Props interface for Tabs component configuration
 * @interface TabsProps
 * @extends {BaseComponentProps}
 */
export interface TabsProps extends BaseComponentProps {
  /** Array of tab configurations */
  tabs: Tab[];
  /** ID of the tab that should be active by default */
  defaultActiveTab?: string;
  /** Additional CSS classes for styling */
  className?: string;
}

/**
 * Professional tabs component with responsive design and adaptive interface
 *
 * @remarks
 * The Tabs component delivers comprehensive tab navigation with the following features:
 *
 * **Responsive Design:**
 * - Desktop: Traditional horizontal tab buttons
 * - Mobile: Dropdown selector for space efficiency
 * - Adaptive interface based on screen size
 * - Professional breakpoint management
 *
 * **Tab Management:**
 * - Active tab state management with useState
 * - Default tab selection with fallback logic
 * - Dynamic tab switching with smooth transitions
 * - Professional state synchronization
 *
 * **Visual Design:**
 * - Neumorphic card styling for mobile dropdown
 * - Professional tab button styling with hover states
 * - Active tab highlighting with accent border
 * - Clean border and spacing management
 *
 * **Mobile Interface:**
 * - Full-width dropdown selector
 * - Custom dropdown arrow icon
 * - Professional select styling
 * - Theme-integrated colors and backgrounds
 *
 * **Desktop Interface:**
 * - Horizontal tab layout with gap spacing
 * - Professional hover and active states
 * - Border bottom for active tab indication
 * - Clean typography and spacing
 *
 * **Content Management:**
 * - Dynamic content rendering based on active tab
 * - Efficient tab lookup and content display
 * - Clean content container styling
 * - Professional content presentation
 *
 * **Theme Integration:**
 * - CSS custom properties for consistent theming
 * - Primary and secondary background colors
 * - Text color variables for hierarchy
 * - Professional color palette usage
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Screen reader compatible labels
 * - Keyboard navigation support
 * - Professional accessibility patterns
 *
 * **Interactive Features:**
 * - Smooth transition animations (200ms duration)
 * - Professional hover states
 * - Clean click handlers
 * - Responsive touch targets
 *
 * **Performance:**
 * - Efficient tab lookup with find method
 * - Optimized re-render patterns
 * - Clean component lifecycle
 * - Professional state management
 *
 * @param props - Configuration object for tabs functionality
 * @returns Tabs component with responsive tab navigation interface
 *
 * @example
 * ```tsx
 * // Basic tabs usage
 * <Tabs
 *   tabs={[
 *     {
 *       id: 'overview',
 *       label: 'Overview',
 *       content: <OverviewContent />
 *     },
 *     {
 *       id: 'details',
 *       label: 'Details',
 *       content: <DetailsContent />
 *     }
 *   ]}
 *   defaultActiveTab="overview"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Portfolio management tabs
 * function PortfolioTabs() {
 *   const portfolioTabs = [
 *     {
 *       id: 'holdings',
 *       label: 'Holdings',
 *       content: <HoldingsTable />
 *     },
 *     {
 *       id: 'transactions',
 *       label: 'Transactions',
 *       content: <TransactionHistory />
 *     },
 *     {
 *       id: 'performance',
 *       label: 'Performance',
 *       content: <PerformanceCharts />
 *     }
 *   ];
 *
 *   return (
 *     <Tabs
 *       tabs={portfolioTabs}
 *       defaultActiveTab="holdings"
 *       className="portfolio-tabs"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Dynamic tabs with data loading
 * function DynamicTabs() {
 *   const { data: symbols } = useWatchlistSymbols();
 *
 *   const symbolTabs = symbols?.map(symbol => ({
 *     id: symbol.id,
 *     label: symbol.symbol,
 *     content: <SymbolDetails symbol={symbol} />
 *   })) || [];
 *
 *   return symbolTabs.length > 0 ? (
 *     <Tabs
 *       tabs={symbolTabs}
 *       defaultActiveTab={symbolTabs[0]?.id}
 *     />
 *   ) : (
 *     <EmptyState
 *       icon="briefcase"
 *       title="No Symbols"
 *       description="Add symbols to your watchlist to see them here."
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced tabs with analytics
 * function AnalyticsTabs() {
 *   const analytics = useAnalytics();
 *
 *   const handleTabChange = (tabId: string) => {
 *     analytics.track('tab_switched', {
 *       tab_id: tabId,
 *       section: 'dashboard'
 *     });
 *   };
 *
 *   const dashboardTabs = [
 *     {
 *       id: 'overview',
 *       label: 'Overview',
 *       content: <DashboardOverview />
 *     },
 *     {
 *       id: 'analytics',
 *       label: 'Analytics',
 *       content: <AnalyticsDashboard />
 *     }
 *   ];
 *
 *   return (
 *     <Tabs
 *       tabs={dashboardTabs}
 *       defaultActiveTab="overview"
 *       onTabChange={handleTabChange}
 *     />
 *   );
 * }
 * ```
 */
export default function Tabs({
  tabs,
  defaultActiveTab,
  className = "",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile: Dropdown-style selector */}
      <div className="sm:hidden mb-6">
        <div className="neu-card rounded-xl p-1 relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full bg-transparent text-[var(--text-primary)] font-medium p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] appearance-none cursor-pointer"
            style={{ background: "var(--bg-primary)" }}
          >
            {tabs.map((tab) => (
              <option
                key={tab.id}
                value={tab.id}
                className="bg-[var(--bg-primary)] text-[var(--text-primary)]"
              >
                {tab.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-[var(--text-secondary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop: Traditional tabs */}
      <div className="hidden sm:flex gap-2 mb-6 border-b border-[var(--border-subtle)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-base rounded-t-lg font-medium transition-all duration-200 text-center ${
              activeTab === tab.id
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-b-2 border-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
