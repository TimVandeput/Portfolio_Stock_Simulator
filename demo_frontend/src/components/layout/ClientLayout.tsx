/**
 * @fileoverview Main client-side layout component providing application structure and context
 *
 * This component serves as the root layout for the client-side application, orchestrating
 * global providers, navigation components, authentication flows, and modal systems.
 * Features comprehensive state management, responsive design patterns, and seamless
 * integration of all application-wide concerns including theming, pricing, and access control.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";
import CursorTrail from "@/components/effects/CursorTrail";
import RotationPrompt from "@/components/ui/RotationPrompt";
import NoAccessModal from "@/components/ui/NoAccessModal";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PriceProvider } from "@/contexts/PriceContext";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Loader from "@/components/ui/Loader";
import { loadTokensFromStorage } from "@/lib/auth/tokenStorage";
import { useLayoutAccessControl } from "@/hooks/useLayoutAccessControl";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { useLogoutFlow } from "@/hooks/useLogoutFlow";
import { BaseComponentProps } from "@/types";

/**
 * Props interface for ClientLayout component configuration
 * @interface ClientLayoutProps
 * @extends {BaseComponentProps}
 */
export interface ClientLayoutProps extends BaseComponentProps {
  /** React children to render within the layout */
  children: React.ReactNode;
}

/**
 * Main client-side layout component providing application structure and context
 *
 * @remarks
 * The ClientLayout component orchestrates the entire client-side application with the following capabilities:
 *
 * **Context Providers:**
 * - ThemeProvider for dark/light mode and visual theming
 * - PriceProvider for real-time stock price streaming
 * - Global state management and context distribution
 * - Nested provider architecture for optimal performance
 *
 * **Layout Structure:**
 * - Header component with navigation and user controls
 * - Main content area with flexible child rendering
 * - Footer component with responsive visibility
 * - Fullscreen modal and overlay systems
 *
 * **Authentication Integration:**
 * - Token loading and validation on application start
 * - Access control modal system for unauthorized access
 * - Logout flow management with confirmation dialogs
 * - Route-based authentication state handling
 *
 * **Modal Systems:**
 * - Confirmation modal for logout and critical actions
 * - Access control modal for permission violations
 * - Loading overlays for async operations
 * - Responsive modal positioning and styling
 *
 * **Interactive Features:**
 * - Cursor trail effects with toggle capability
 * - Device rotation prompts for mobile optimization
 * - Dynamic content loading with proper loading states
 * - Smooth transitions between application states
 *
 * **State Management:**
 * - Comprehensive hook integration for layout concerns
 * - Path-based state cleanup and management
 * - Modal state coordination and conflict resolution
 * - Loading state management across components
 *
 * **Responsive Design:**
 * - Mobile-first layout with breakpoint considerations
 * - Footer visibility control based on screen size
 * - Adaptive modal sizing and positioning
 * - Cross-device compatibility and optimization
 *
 * **Error Handling:**
 * - Access error display with user-friendly messages
 * - Graceful fallbacks for authentication failures
 * - Proper error state management and recovery
 * - User feedback for all error conditions
 *
 * @param props - Configuration object containing child components
 * @returns ClientLayout component with complete application structure
 *
 * @example
 * ```tsx
 * // Basic usage wrapping application pages
 * function RootLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <html>
 *       <body>
 *         <ClientLayout>
 *           {children}
 *         </ClientLayout>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Integration with Next.js App Router
 * export default function Layout({
 *   children,
 * }: {
 *   children: React.ReactNode;
 * }) {
 *   return (
 *     <ClientLayout>
 *       <div className="container mx-auto px-4">
 *         {children}
 *       </div>
 *     </ClientLayout>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom layout with additional providers
 * function AppLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <QueryProvider>
 *       <ClientLayout>
 *         <ErrorBoundary>
 *           {children}
 *         </ErrorBoundary>
 *       </ClientLayout>
 *     </QueryProvider>
 *   );
 * }
 * ```
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  const {
    showModal: showAccessModal,
    setShowModal: setShowAccessModal,
    accessError,
    setLoggingOut,
  } = useLayoutAccessControl();

  const confirmationModal = useConfirmationModal();
  const logoutFlow = useLogoutFlow();

  const [cursorTrailEnabled, setCursorTrailEnabled] = useState(false);

  useEffect(() => {
    loadTokensFromStorage();
  }, []);

  const handleShowConfirmation = (
    show: boolean,
    loggingOut: boolean,
    onConfirm: () => void,
    onCancel: () => void
  ) => {
    if (show) {
      confirmationModal.showModal(onConfirm, onCancel, false);
      if (loggingOut) {
        logoutFlow.startLogout();
        setLoggingOut(true);
      }
    } else {
      confirmationModal.hideModal();
      if (loggingOut) {
        logoutFlow.startLogout();
        setLoggingOut(true);
      } else {
        logoutFlow.endLogout();
        setLoggingOut(false);
      }
    }
  };

  const handleTrailChange = (enabled: boolean) => {
    setCursorTrailEnabled(enabled);
  };

  useEffect(() => {
    if (
      pathname === "/" &&
      (logoutFlow.isLoggingOut || confirmationModal.showConfirmation)
    ) {
      logoutFlow.endLogout();
      confirmationModal.hideModal();
      setLoggingOut(false);
    }
  }, [
    pathname,
    logoutFlow.isLoggingOut,
    confirmationModal.showConfirmation,
    logoutFlow,
    confirmationModal,
    setLoggingOut,
  ]);

  return (
    <ThemeProvider>
      <PriceProvider>
        <RotationPrompt />
        {cursorTrailEnabled && <CursorTrail />}
        <Header
          onShowConfirmation={handleShowConfirmation}
          onUpdateConfirmationLoading={confirmationModal.updateLoading}
          onTrailChange={handleTrailChange}
        />

        <main className="flex-1 w-full overflow-y-auto flex flex-col">
          <div className="relative w-full min-h-full flex flex-col items-center justify-center flex-1">
            {showAccessModal ? (
              <NoAccessModal
                isOpen={showAccessModal}
                accessType={accessError?.reason}
                message={accessError?.message || "Access denied"}
                onClose={() => setShowAccessModal(false)}
              />
            ) : confirmationModal.showConfirmation ? (
              <ConfirmationModal
                isOpen={confirmationModal.showConfirmation}
                title="Confirm Logout"
                message="Are you sure you want to logout? You will need to login again to access your account."
                confirmText={
                  confirmationModal.isLoading ? "Logging out..." : "Yes, Logout"
                }
                cancelText="Cancel"
                onConfirm={confirmationModal.handlers?.onConfirm || (() => {})}
                onCancel={confirmationModal.handlers?.onCancel || (() => {})}
                confirmDisabled={confirmationModal.isLoading}
                cancelDisabled={confirmationModal.isLoading}
              />
            ) : (
              children
            )}

            {logoutFlow.isLoggingOut && !confirmationModal.showConfirmation && (
              <Loader cover="content" />
            )}
          </div>
        </main>

        <div className="hidden [@media(min-width:351px)]:block w-full">
          <Footer />
        </div>
      </PriceProvider>
    </ThemeProvider>
  );
}
