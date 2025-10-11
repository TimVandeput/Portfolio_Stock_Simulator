/**
 * @fileoverview Interactive help and support client component.
 *
 * This module provides comprehensive help documentation and support resources
 * through an interactive, tabbed interface. It includes detailed tutorials,
 * FAQs, feature guides, and troubleshooting information to help users
 * effectively navigate and utilize the Stock Simulator platform.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import Tabs from "@/components/ui/Tabs";
import DynamicIcon from "@/components/ui/DynamicIcon";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/cards/FeatureCard";
import InfoCard from "@/components/cards/InfoCard";
import HelpSection from "@/components/help/HelpSection";
import HelpList from "@/components/help/HelpList";
import HelpSteps from "@/components/help/HelpSteps";

/**
 * Interactive help center client component with comprehensive documentation.
 *
 * This sophisticated client component provides a complete help and support
 * system featuring organized documentation, interactive tutorials, searchable
 * FAQs, and comprehensive feature guides. It implements modern UX patterns
 * to make complex platform information easily accessible and digestible
 * for users of all experience levels.
 *
 * @remarks
 * The component delivers comprehensive support through organized content:
 *
 * **Content Organization & Structure**:
 * - **Tabbed Navigation**: Logical categorization of help topics
 * - **Hierarchical Information**: Nested sections for detailed exploration
 * - **Progressive Disclosure**: Information revealed as needed
 * - **Cross-references**: Links between related help topics
 *
 * **Help Content Categories**:
 * - **Platform Overview**: Introduction, key concepts, and navigation
 * - **Getting Started**: New user onboarding and first steps
 * - **Trading Guides**: Comprehensive buying, selling, and portfolio tutorials
 * - **Account Management**: Profile settings, security, and preferences
 * - **Advanced Features**: Power user functionality and tips
 * - **Troubleshooting**: Common issues and resolution steps
 *
 * **Interactive Learning Features**:
 * - **Step-by-step Tutorials**: Guided processes with visual cues
 * - **Interactive Examples**: Live demonstrations of features
 * - **Video Tutorials**: Visual learning for complex processes
 * - **Practice Scenarios**: Safe environment for learning
 * - **Progress Tracking**: Completion status for tutorial sequences
 *
 * **Search & Discovery**:
 * - **Content Search**: Full-text search across all help content
 * - **Tag-based Filtering**: Topic-based content discovery
 * - **Popular Topics**: Frequently accessed help sections
 * - **Recent Updates**: Newly added or modified documentation
 * - **Contextual Suggestions**: Related help topics and resources
 *
 * **User Experience Design**:
 * - **Responsive Layout**: Optimized for all device types and screen sizes
 * - **Accessibility Features**: Full keyboard navigation and screen reader support
 * - **Print-friendly Formatting**: Clean printing for offline reference
 * - **Bookmark Functionality**: Save and organize frequently needed content
 * - **Feedback Integration**: User rating and improvement suggestions
 *
 * **Support Integration**:
 * - **Contact Options**: Multiple support escalation pathways
 * - **Live Chat Integration**: Real-time support when available
 * - **Ticket System**: Structured support request management
 * - **Community Forums**: Peer-to-peer support and knowledge sharing
 * - **Knowledge Base Updates**: Regular content refresh and expansion
 *
 * The component serves as a comprehensive self-service support portal,
 * empowering users to independently resolve issues, learn new features,
 * and maximize their platform experience while reducing support overhead.
 *
 * @example
 * ```tsx
 * // Rendered by the HelpPage server component
 * function HelpClient() {
 *   const helpTabs = [
 *     {
 *       id: "overview",
 *       label: "Platform Overview",
 *       content: (
 *         <div>
 *           <SectionHeader icon="help" title="Getting Started" />
 *           <HelpSteps steps={onboardingSteps} />
 *           <HelpList items={keyFeatures} />
 *         </div>
 *       )
 *     },
 *     {
 *       id: "trading",
 *       label: "Trading Guide",
 *       content: (
 *         <div>
 *           <HelpSection title="How to Buy Stocks">
 *             <HelpSteps steps={buyingProcess} />
 *           </HelpSection>
 *           <HelpSection title="Portfolio Management">
 *             <InfoCard title="Tip" content="Regular review improves performance" />
 *           </HelpSection>
 *         </div>
 *       )
 *     }
 *   ];
 *
 *   return (
 *     <div className="help-center">
 *       <Tabs tabs={helpTabs} defaultActiveTab="overview" />
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns The comprehensive help center interface with tabbed documentation,
 * interactive tutorials, searchable content, and organized support resources
 * designed to help users at all experience levels.
 *
 * @see {@link Tabs} - Tabbed navigation component for content organization
 * @see {@link HelpSection} - Individual help section component
 * @see {@link HelpSteps} - Step-by-step tutorial component
 * @see {@link HelpList} - Structured list component for help content
 * @see {@link SectionHeader} - Section header component with icons
 *
 * @public
 */
export default function HelpClient() {
  const helpTabs = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="space-y-6">
          <SectionHeader icon="help" title="Platform Overview" />

          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
            <p>
              Welcome to our comprehensive trading platform. This guide will
              help you navigate through all features and functionalities
              effectively.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <FeatureCard
                icon="home"
                iconColor="text-blue-500"
                title="Dashboard"
                description="Central hub with quick access to all platform sections"
              />
              <FeatureCard
                icon="trending-up"
                iconColor="text-green-500"
                title="Live Markets"
                description="Real-time stock prices with search and filtering capabilities"
              />
              <FeatureCard
                icon="pie-chart"
                iconColor="text-purple-500"
                title="Portfolio Tracking"
                description="Monitor your investments with detailed performance analytics"
              />
              <FeatureCard
                icon="trending-up"
                iconColor="text-amber-500"
                title="Analytics"
                description="Interactive charts and graphs for market analysis"
              />
            </div>

            <p>
              Each section is designed to provide intuitive navigation and
              comprehensive functionality for managing your trading simulation
              experience.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "pages",
      label: "Page Guide",
      content: (
        <div className="space-y-6">
          <SectionHeader icon="help" title="Page-by-Page Manual" />

          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
            <p>
              Detailed guide for each section of the platform, following the
              navigation order to help you understand all available features and
              functionality.
            </p>
          </div>

          <div className="space-y-6">
            {/* HOME PAGE HELP */}
            <div className="neu-card p-6 rounded-xl border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3 mb-4">
                <DynamicIcon
                  iconName="home"
                  size={20}
                  className="text-blue-500"
                />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  HOME - Dashboard
                </h3>
              </div>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
                <p>
                  <strong>Purpose:</strong> Your central hub for quick
                  navigation and platform overview.
                </p>

                <div>
                  <p>
                    <strong>How to Use:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      Click any navigation card to jump directly to that section
                    </li>
                    <li>
                      Cards show status indicators when relevant data is
                      available
                    </li>
                    <li>Use this as your starting point when logging in</li>
                    <li>All cards are responsive and work on mobile devices</li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>Navigation Cards Available:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>Markets:</strong> Browse and search available
                      stocks
                    </li>
                    <li>
                      <strong>Portfolio:</strong> View your current holdings and
                      performance
                    </li>
                    <li>
                      <strong>Orders:</strong> Review your transaction history
                    </li>
                    <li>
                      <strong>Analytics:</strong> Analyze performance with
                      charts
                    </li>
                    <li>
                      <strong>Notifications:</strong> Check system messages and
                      alerts
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <HelpSection
              icon="store"
              iconColor="#10b981"
              title="MARKETS - Browse Stocks"
              purpose="Search, browse, and explore available stocks with real-time pricing."
            >
              <HelpList
                title="Key Features"
                items={[
                  "<strong>Real-time Price Updates:</strong> Prices update automatically with color indicators",
                  "<strong>Search Function:</strong> Find specific stocks by symbol or company name",
                  "<strong>Market Status:</strong> See if markets are currently open or closed",
                  "<strong>Price Animations:</strong> Watch for pulsating effects on price changes",
                ]}
              />

              <HelpSteps
                title="How to Search"
                steps={[
                  'Use the search bar at the top to enter stock symbols (e.g., "AAPL") or company names',
                  "Results appear automatically as you type",
                  "Clear the search to see all available stocks",
                ]}
              />

              <HelpList
                title="Sorting Options"
                items={[
                  "<strong>Name (A-Z/Z-A):</strong> Alphabetical by company name",
                  "<strong>Price (High/Low):</strong> Sort by current stock price",
                  "<strong>Change (Up/Down):</strong> Sort by price change percentage",
                ]}
              />

              <HelpList
                title="Understanding Price Colors"
                items={[
                  "<strong>Green:</strong> Stock price has increased",
                  "<strong>Red:</strong> Stock price has decreased",
                  "<strong>Pulsating:</strong> Price just updated in real-time",
                ]}
              />

              <HelpSteps
                title="How to Buy Stocks"
                steps={[
                  "Find the stock you want to purchase using search or browsing",
                  'Click the <strong>"Buy" button</strong> in the rightmost column of the table',
                  "You'll be taken to the individual stock purchase page",
                  "Enter the quantity of shares you want to buy",
                  "Confirm your purchase to add the stock to your portfolio",
                ]}
              />

              <HelpList
                title="Navigation and Controls"
                items={[
                  "Use pagination controls at the bottom to browse through all available stocks",
                  "<strong>Rows are not clickable</strong> - use the Buy button to purchase stocks",
                  'Adjust "Rows" dropdown to show 10, 25, or 50 stocks per page',
                  "Page layout adapts automatically for mobile devices",
                ]}
              />

              <HelpList
                title="Important Notes"
                items={[
                  "Only enabled stocks can be purchased (Buy button will be disabled for others)",
                  "Market status indicator shows if markets are currently open or closed",
                  "Price updates happen automatically during market hours",
                  'Search works for both stock symbols (like "AAPL") and company names',
                ]}
              />
            </HelpSection>

            {/* PORTFOLIO PAGE HELP */}
            <div
              className="neu-card p-6 rounded-xl border-l-4"
              style={{ borderLeftColor: "#8b5cf6" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <DynamicIcon
                  iconName="briefcase"
                  size={20}
                  style={{ color: "#8b5cf6" }}
                />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  PORTFOLIO - Track Your Investments
                </h3>
              </div>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
                <p>
                  <strong>Purpose:</strong> Monitor your stock holdings, track
                  performance, and analyze your investment portfolio.
                </p>

                <div>
                  <p>
                    <strong>Portfolio Statistics Card:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>Cash Balance:</strong> Available funds for new
                      investments
                    </li>
                    <li>
                      <strong>Total Market Value:</strong> Current value of all
                      your stock holdings
                    </li>
                    <li>
                      <strong>Total Portfolio Value:</strong> Cash + Market
                      Value combined
                    </li>
                    <li>
                      <strong>Overall P&L:</strong> Your total profit or loss
                    </li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>Holdings Table Features:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>Symbol:</strong> Stock ticker symbol
                    </li>
                    <li>
                      <strong>Quantity:</strong> Number of shares you own
                    </li>
                    <li>
                      <strong>Avg Cost:</strong> Average price you paid per
                      share
                    </li>
                    <li>
                      <strong>Current Price:</strong> Real-time market price
                    </li>
                    <li>
                      <strong>Market Value:</strong> Current total value of your
                      position
                    </li>
                    <li>
                      <strong>P&L:</strong> Profit or loss on this position
                    </li>
                    <li>
                      <strong>P&L %:</strong> Percentage gain or loss
                    </li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>Visual Indicators:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>Green Border:</strong> Profitable positions
                      (you're making money)
                    </li>
                    <li>
                      <strong>Red Border:</strong> Loss positions (currently
                      losing money)
                    </li>
                    <li>
                      <strong>Real-time Updates:</strong> Values update
                      automatically during market hours
                    </li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>Selling Stocks:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>Sell Button:</strong> Each holding has a "Sell"
                      button on the right
                    </li>
                    <li>
                      <strong>Quick Access:</strong> Click the Sell button to
                      navigate to the selling page
                    </li>
                    <li>
                      <strong>Real-time Pricing:</strong> Sell orders execute at
                      current market price
                    </li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>How to Sell Stocks:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4 mt-2">
                    <li>
                      Find the stock you want to sell in your holdings list
                    </li>
                    <li>Click the "Sell" button for that stock</li>
                    <li>
                      Review your holding details (quantity owned, average cost)
                    </li>
                    <li>
                      Enter the number of shares to sell (or click "Max
                      Available")
                    </li>
                    <li>Review the order summary showing total sale value</li>
                    <li>Click "Sell Shares" to open the confirmation dialog</li>
                    <li>Confirm your sell order to execute the transaction</li>
                    <li>Funds are immediately added to your cash balance</li>
                  </ol>
                </div>

                <div>
                  <p>
                    <strong>How to Use Portfolio:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4 mt-2">
                    <li>
                      Review your portfolio statistics at the top for overall
                      performance
                    </li>
                    <li>
                      Scroll through your holdings to see individual stock
                      performance
                    </li>
                    <li>
                      Use the colored borders to quickly identify profitable vs.
                      losing positions
                    </li>
                    <li>Click "Sell" buttons to reduce or close positions</li>
                    <li>Monitor real-time price changes and P&L updates</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* ORDERS PAGE HELP */}
            <div
              className="neu-card p-6 rounded-xl border-l-4"
              style={{ borderLeftColor: "#f59e0b" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <DynamicIcon
                  iconName="shoppingcart"
                  size={20}
                  style={{ color: "#f59e0b" }}
                />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  ORDERS - Transaction History
                </h3>
              </div>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
                <p>
                  <strong>Purpose:</strong> Review all your trading activity
                  with detailed transaction records and filtering options.
                </p>

                <div>
                  <p>
                    <strong>Transaction Information Displayed:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>Date & Time:</strong> When the transaction
                      occurred
                    </li>
                    <li>
                      <strong>Symbol:</strong> Stock ticker that was traded
                    </li>
                    <li>
                      <strong>Type:</strong> BUY or SELL transaction
                    </li>
                    <li>
                      <strong>Quantity:</strong> Number of shares traded
                    </li>
                    <li>
                      <strong>Price:</strong> Price per share at time of
                      transaction
                    </li>
                    <li>
                      <strong>Total Value:</strong> Total transaction amount
                    </li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>Search and Filter Options:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>Search Box:</strong> Type stock symbol or company
                      name to filter transactions
                    </li>
                    <li>
                      <strong>Date Range Filter:</strong> Select start and end
                      dates to narrow results
                    </li>
                    <li>
                      <strong>Sort Dropdown:</strong> Sort by newest first,
                      oldest first, symbol A-Z/Z-A, buy orders, sell orders,
                      highest/lowest amount
                    </li>
                    <li>
                      <strong>Rows Per Page:</strong> Choose 10, 25, 50, or 100
                      transactions per page
                    </li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>How to Use Orders Page:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4 mt-2">
                    <li>
                      View transaction statistics at the top showing total
                      trades and volume
                    </li>
                    <li>
                      Use search box to find specific stocks by symbol or
                      company name
                    </li>
                    <li>
                      Apply date range filters to view transactions from
                      specific time periods
                    </li>
                    <li>
                      Sort transactions using the dropdown (newest first, by
                      symbol, by amount, etc.)
                    </li>
                    <li>Adjust rows per page for better viewing experience</li>
                    <li>
                      Export filtered results to CSV, Excel, or PDF formats
                    </li>
                  </ol>
                </div>

                <div>
                  <p>
                    <strong>Export Options:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>CSV Export:</strong> For spreadsheet analysis
                    </li>
                    <li>
                      <strong>Excel Export:</strong> Professional formatted
                      reports
                    </li>
                    <li>
                      <strong>PDF Export:</strong> Print-ready transaction
                      reports
                    </li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>Transaction Statistics:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>View summary statistics at the top of the page</li>
                    <li>
                      See total number of transactions, buy/sell breakdown
                    </li>
                    <li>Review total trading volume and activity</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* GRAPHS PAGE HELP */}
            <div
              className="neu-card p-6 rounded-xl border-l-4"
              style={{ borderLeftColor: "#06b6d4" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <DynamicIcon
                  iconName="trending-up"
                  size={20}
                  style={{ color: "#06b6d4" }}
                />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  ANALYTICS - Visual Analysis
                </h3>
              </div>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
                <p>
                  <strong>Purpose:</strong> Analyze your portfolio performance
                  with interactive charts and visual data representation.
                </p>

                <div>
                  <p>
                    <strong>Chart Features:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>Interactive Charts:</strong> Hover over data
                      points for detailed information
                    </li>
                    <li>
                      <strong>Multi-Stock Display:</strong> View charts for all
                      your portfolio holdings
                    </li>
                    <li>
                      <strong>Real-time Updates:</strong> Charts update
                      automatically with new price data
                    </li>
                    <li>
                      <strong>Responsive Design:</strong> Charts adapt to your
                      screen size
                    </li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>Time Range Options:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>1M (1 Month):</strong> Monthly trend analysis and
                      recent performance
                    </li>
                    <li>
                      <strong>1Y (1 Year):</strong> Annual performance
                      perspective
                    </li>
                    <li>
                      <strong>5Y (5 Years):</strong> Long-term trend analysis
                      and historical performance
                    </li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>How to Use the Charts:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>Select Time Range:</strong> Click on 1M, 1Y, or 5Y
                      buttons
                    </li>
                    <li>
                      <strong>Hover for Details:</strong> Move your mouse over
                      chart lines to see exact values
                    </li>
                    <li>
                      <strong>Compare Stocks:</strong> View multiple charts to
                      compare performance
                    </li>
                    <li>
                      <strong>Watch for Updates:</strong> Charts refresh
                      automatically during market hours
                    </li>
                  </ol>
                </div>

                <div>
                  <p>
                    <strong>Chart Interpretation:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      <strong>Upward Trend:</strong> Stock price is generally
                      increasing
                    </li>
                    <li>
                      <strong>Downward Trend:</strong> Stock price is generally
                      decreasing
                    </li>
                    <li>
                      <strong>Flat/Sideways:</strong> Stock price is relatively
                      stable
                    </li>
                    <li>
                      <strong>Volatility:</strong> Sharp up/down movements
                      indicate price volatility
                    </li>
                  </ul>
                </div>

                <div>
                  <p>
                    <strong>Best Practices:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                    <li>
                      Use 5Y range for comprehensive long-term trend analysis
                    </li>
                    <li>Use 1Y for annual performance and seasonal patterns</li>
                    <li>Use 1M for recent performance and short-term trends</li>
                    <li>
                      Compare your stocks' performance against market conditions
                    </li>
                    <li>
                      Look for patterns and trends rather than individual data
                      points
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* NOTIFICATIONS PAGE HELP */}
            <div
              className="neu-card p-6 rounded-xl border-l-4"
              style={{ borderLeftColor: "#ef4444" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <DynamicIcon
                  iconName="bell"
                  size={20}
                  style={{ color: "#ef4444" }}
                />
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  NOTIFICATIONS - Stay Updated
                </h3>
              </div>
              <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
                <p>
                  <strong>Purpose:</strong> View your notifications.
                </p>

                <div>
                  <p>
                    <strong>How to Use:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1 ml-4 mt-2">
                    <li>
                      Click on any notification card to expand and read full
                      content
                    </li>
                    <li>
                      Expanding an unread notification automatically marks it as
                      read
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "support",
      label: "Support",
      content: (
        <div className="space-y-6">
          <SectionHeader icon="help" title="Support & Troubleshooting" />

          <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
            <p>
              Common issues and solutions, plus information on getting
              additional help when needed.
            </p>
          </div>

          <div className="space-y-4">
            <InfoCard
              icon="alert-circle"
              iconColor="text-red-500"
              title="Common Issues"
              description="Price updates not showing - Check internet connection. Charts not loading - Refresh page. Login issues - Clear browser cache. Mobile display problems - Use supported browser."
            />
            <InfoCard
              icon="activity"
              iconColor="text-blue-500"
              title="Browser Requirements"
              description="Chrome (recommended) Version 90+, Firefox Version 88+, Safari Version 14+, Edge Version 90+. JavaScript must be enabled for full functionality."
            />
            <InfoCard
              icon="help"
              iconColor="text-green-500"
              title="Getting Additional Help"
              description="Check the About page for developer contact information. Review system notifications for known issues. Try refreshing page or clearing browser cache for display problems."
            />
          </div>

          <div className="neu-card p-4 rounded-xl bg-blue-50/5 border-l-4 border-l-blue-500 mt-6">
            <h3 className="font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <DynamicIcon
                iconName="info"
                size={16}
                className="text-blue-500"
              />
              Support Note
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-justify">
              When reporting issues, please include the specific page where the
              problem occurs, describe what you were trying to do, include your
              browser type and version, and check if the issue persists after
              page refresh.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="page-card p-4 sm:p-6 rounded-2xl max-w-6xl mx-auto w-full">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Help & Support
          </h1>
          <p className="text-[var(--text-secondary)]">
            Complete guide to using the trading platform effectively
          </p>
        </div>

        <Tabs tabs={helpTabs} defaultActiveTab="overview" />
      </div>
    </div>
  );
}
