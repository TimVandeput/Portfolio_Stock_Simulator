/**
 * @fileoverview Empty portfolio state component for new user onboarding and engagement
 *
 * This component provides an engaging empty state experience for users with no portfolio
 * holdings, featuring clear call-to-action, motivational messaging, and seamless navigation
 * to market exploration. Includes professional iconography, responsive design, and
 * user-friendly investment encouragement with intuitive market access.
 */

"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for EmptyPortfolio component configuration
 * @interface EmptyPortfolioProps
 * @extends {BaseComponentProps}
 */
export interface EmptyPortfolioProps extends BaseComponentProps {
  /** Callback function to navigate to market exploration */
  onViewMarkets: () => void;
}

/**
 * Empty portfolio state component for new user onboarding and engagement
 *
 * @remarks
 * The EmptyPortfolio component delivers engaging empty state experience with the following features:
 *
 * **User Engagement:**
 * - Motivational messaging for new investors
 * - Clear explanation of portfolio benefits
 * - Encouraging call-to-action for first investment
 * - Professional onboarding experience
 *
 * **Visual Design:**
 * - Large briefcase icon with subtle opacity
 * - Centered layout with professional spacing
 * - Hierarchical typography with clear messaging
 * - Accent-colored action button with hover effects
 *
 * **Content Strategy:**
 * - Friendly, non-intimidating language
 * - Clear benefit explanation for portfolio tracking
 * - Comprehensive feature preview (values, gains/losses, performance)
 * - Actionable next steps guidance
 *
 * **Interactive Elements:**
 * - Prominent "Start Investing" button
 * - Plus icon for positive association
 * - Hover scale animation for engagement
 * - Professional button styling with accent theming
 *
 * **Layout Structure:**
 * - Centered vertical alignment with padding
 * - Maximum width constraints for readability
 * - Logical information hierarchy
 * - Clean spacing and visual balance
 *
 * **Accessibility:**
 * - Clear semantic structure
 * - Appropriate heading hierarchy
 * - Screen reader compatible content
 * - Keyboard navigation support
 *
 * **Theme Integration:**
 * - CSS custom properties for theming
 * - Consistent color variable usage
 * - Accent color for call-to-action prominence
 * - Professional text color hierarchy
 *
 * **User Flow Integration:**
 * - Seamless navigation to market exploration
 * - Clear pathway for user progression
 * - Professional onboarding funnel
 * - Conversion-optimized design
 *
 * **Responsive Design:**
 * - Mobile-friendly layout
 * - Consistent spacing across devices
 * - Proper touch targets for mobile
 * - Flexible content presentation
 *
 * **Animation Effects:**
 * - Smooth hover scale transition
 * - Professional micro-interactions
 * - Engaging visual feedback
 * - Performance-optimized animations
 *
 * @param props - Configuration object for empty portfolio display
 * @returns EmptyPortfolio component with engaging onboarding experience
 *
 * @example
 * ```tsx
 * // Basic empty portfolio usage
 * <EmptyPortfolio
 *   onViewMarkets={() => router.push('/market')}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with portfolio dashboard
 * function PortfolioDashboard() {
 *   const { data: portfolio, isLoading } = usePortfolio();
 *   const router = useRouter();
 *
 *   if (isLoading) {
 *     return <PortfolioSkeleton />;
 *   }
 *
 *   if (!portfolio || portfolio.holdings.length === 0) {
 *     return (
 *       <EmptyPortfolio
 *         onViewMarkets={() => router.push('/market')}
 *       />
 *     );
 *   }
 *
 *   return <PortfolioContent portfolio={portfolio} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced integration with analytics
 * function PortfolioManager() {
 *   const { data: holdings } = usePortfolioHoldings();
 *   const analytics = useAnalytics();
 *
 *   const handleViewMarkets = () => {
 *     analytics.track('empty_portfolio_cta_clicked', {
 *       user_segment: 'new_investor',
 *       source: 'portfolio_page'
 *     });
 *
 *     router.push('/market?source=empty_portfolio');
 *   };
 *
 *   return holdings?.length === 0 ? (
 *     <EmptyPortfolio onViewMarkets={handleViewMarkets} />
 *   ) : (
 *     <PortfolioHoldings holdings={holdings} />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom empty state with tutorial integration
 * function EnhancedEmptyPortfolio() {
 *   const [showTutorial, setShowTutorial] = useState(false);
 *
 *   const handleStartInvesting = () => {
 *     if (isFirstTimeUser()) {
 *       setShowTutorial(true);
 *     } else {
 *       navigateToMarket();
 *     }
 *   };
 *
 *   return (
 *     <>
 *       <EmptyPortfolio onViewMarkets={handleStartInvesting} />
 *
 *       {showTutorial && (
 *         <InvestingTutorial
 *           onComplete={() => {
 *             setShowTutorial(false);
 *             navigateToMarket();
 *           }}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
export default function EmptyPortfolio({ onViewMarkets }: EmptyPortfolioProps) {
  return (
    <div className="text-center py-12">
      <DynamicIcon
        iconName="briefcase"
        size={48}
        className="mx-auto mb-4 opacity-50"
      />
      <h3 className="text-lg font-medium text-[var(--text-secondary)] mb-2">
        Your Portfolio is Empty
      </h3>
      <p className="text-[var(--text-secondary)] mb-4 max-w-md mx-auto">
        Start investing by purchasing stocks. Your bought stocks will appear
        here with their current values, gains/losses, and performance.
      </p>
      <div className="flex justify-center">
        <button
          onClick={onViewMarkets}
          className="neu-button px-6 py-3 rounded-xl hover:scale-105 transition-transform flex items-center gap-2 bg-[var(--accent)] text-white"
        >
          <DynamicIcon iconName="plus" size={16} />
          Start Investing
        </button>
      </div>
    </div>
  );
}
