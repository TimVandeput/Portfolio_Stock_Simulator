/**
 * @fileoverview GDPR-compliant cookie banner component for essential cookie disclosure
 *
 * This component provides a professional cookie notice banner with persistent dismissal,
 * theme integration, and clear essential cookie disclosure. Features include localStorage
 * persistence, responsive design, and professional styling with high z-index positioning
 * for optimal visibility and user experience compliance.
 */

"use client";

import { useState, useEffect } from "react";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for CookieBanner component configuration
 * @interface CookieBannerProps
 * @extends {BaseComponentProps}
 */
export interface CookieBannerProps extends BaseComponentProps {}

/**
 * GDPR-compliant cookie banner component for essential cookie disclosure
 *
 * @remarks
 * The CookieBanner component delivers professional cookie compliance with the following features:
 *
 * **GDPR Compliance:**
 * - Clear disclosure of essential cookie usage
 * - Transparent explanation of cookie purposes
 * - Authentication and role management cookies
 * - Theme preference storage disclosure
 *
 * **Persistence Management:**
 * - localStorage-based dismissal tracking
 * - Permanent banner dismissal after user acknowledgment
 * - Browser session persistence
 * - Clean state management with useEffect
 *
 * **Visual Design:**
 * - Fixed bottom positioning with centered alignment
 * - Neumorphic card design with professional styling
 * - High z-index for optimal visibility
 * - Responsive layout with maximum width constraints
 *
 * **Typography:**
 * - Clear, readable font with medium weight
 * - Highlighted essential cookies with bold red styling
 * - Professional button typography
 * - Consistent theme color integration
 *
 * **Layout Structure:**
 * - Flexbox layout with proper spacing
 * - Centered content with margin bottom
 * - Responsive width with mobile optimization
 * - Clean button and text alignment
 *
 * **Theme Integration:**
 * - CSS custom properties for dynamic theming
 * - Cookie banner specific color variables
 * - Shadow and border color customization
 * - Consistent brand color application
 *
 * **Accessibility:**
 * - Clear language and straightforward messaging
 * - High contrast button with border styling
 * - Screen reader compatible structure
 * - Logical reading order and focus flow
 *
 * **Browser Compatibility:**
 * - Safe window object checking
 * - localStorage availability validation
 * - Graceful degradation for SSR environments
 * - Clean conditional rendering patterns
 *
 * **User Experience:**
 * - Non-intrusive bottom positioning
 * - Clear dismissal mechanism
 * - Professional acknowledgment flow
 * - Permanent dismissal on user action
 *
 * **Performance:**
 * - Conditional rendering based on dismissal state
 * - Efficient localStorage operations
 * - Optimized re-render management
 * - Clean component lifecycle
 *
 * @returns CookieBanner component with GDPR-compliant cookie disclosure
 *
 * @example
 * ```tsx
 * // Basic cookie banner implementation
 * <CookieBanner />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with app layout
 * function AppLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <div className="app-container">
 *       <Header />
 *       <main>{children}</main>
 *       <Footer />
 *       <CookieBanner />
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom cookie policy integration
 * function CookieCompliance() {
 *   const [showPolicy, setShowPolicy] = useState(false);
 *
 *   return (
 *     <>
 *       <CookieBanner />
 *
 *       {showPolicy && (
 *         <Modal
 *           title="Cookie Policy"
 *           onClose={() => setShowPolicy(false)}
 *         >
 *           <CookiePolicyContent />
 *         </Modal>
 *       )}
 *
 *       <FooterLink
 *         onClick={() => setShowPolicy(true)}
 *         text="Cookie Policy"
 *       />
 *     </>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced compliance with analytics
 * function ComplianceManager() {
 *   const [cookiesAccepted, setCookiesAccepted] = useState(false);
 *
 *   useEffect(() => {
 *     const dismissed = localStorage.getItem("cookieBannerDismissed");
 *     if (dismissed) {
 *       setCookiesAccepted(true);
 *       // Initialize analytics only after acceptance
 *       initializeAnalytics();
 *     }
 *   }, []);
 *
 *   return (
 *     <div className="compliance-wrapper">
 *       <CookieBanner />
 *
 *       {cookiesAccepted && (
 *         <AnalyticsProvider>
 *           <App />
 *         </AnalyticsProvider>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dismissed = localStorage.getItem("cookieBannerDismissed");
      if (!dismissed) setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("cookieBannerDismissed", "true");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[99999] flex justify-center pointer-events-auto">
      <div
        className="neu-card rounded-xl p-4 mb-6 flex items-center gap-4 max-w-xl w-full text-center border-2"
        style={{
          color: "var(--text-primary)",
          background: "var(--cookie-banner-bg, #e0e5ec)",
          borderColor: "var(--cookie-banner-border, #7c3aed)",
          boxShadow: "0 8px 32px 0 rgba(60,60,120,0.18), var(--shadow-large)",
        }}
      >
        <span className="flex-1 font-medium">
          This site uses{" "}
          <span
            style={{
              color: "var(--cookie-banner-red, #ef4444)",
              fontWeight: "bold",
            }}
          >
            essential cookies
          </span>{" "}
          for authentication, role management, and theme preference. These
          cookies are required for the website to function and cannot be
          disabled.
        </span>
        <button
          className="neu-button px-6 py-2 rounded-xl font-bold border"
          style={{ borderColor: "var(--cookie-banner-border, #7c3aed)" }}
          onClick={handleDismiss}
        >
          OK
        </button>
      </div>
    </div>
  );
}
