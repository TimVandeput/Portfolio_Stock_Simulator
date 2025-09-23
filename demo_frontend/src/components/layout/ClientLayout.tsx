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
import { BREAKPOINTS } from "@/lib/constants/breakpoints";
import { useLayoutAccessControl } from "@/hooks/useLayoutAccessControl";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const {
    showModal: showAccessModal,
    setShowModal: setShowAccessModal,
    accessError,
  } = useLayoutAccessControl();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutHandlers, setLogoutHandlers] = useState<{
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);
  const [cursorTrailEnabled, setCursorTrailEnabled] = useState(false);
  const [isSmallPhone, setIsSmallPhone] = useState(false);

  useEffect(() => {
    loadTokensFromStorage();
  }, []);

  const handleShowConfirmation = (
    show: boolean,
    loggingOut: boolean,
    onConfirm: () => void,
    onCancel: () => void
  ) => {
    setShowConfirmation(show);
    setIsLoggingOut(loggingOut);
    setLogoutHandlers(show ? { onConfirm, onCancel } : null);
  };

  const handleTrailChange = (enabled: boolean) => {
    setCursorTrailEnabled(enabled);
  };

  useEffect(() => {
    const checkMobile = () => {
      const smallPhone = window.matchMedia(
        BREAKPOINTS.SMALL_PHONE_DOWN
      ).matches;
      setIsSmallPhone(smallPhone);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (pathname === "/" && (isLoggingOut || showConfirmation)) {
      setIsLoggingOut(false);
      setShowConfirmation(false);
    }
  }, [pathname, isLoggingOut, showConfirmation]);

  return (
    <ThemeProvider>
      <PriceProvider>
        <RotationPrompt />
        {cursorTrailEnabled && <CursorTrail />}
        <Header
          onShowConfirmation={handleShowConfirmation}
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
            ) : showConfirmation ? (
              <ConfirmationModal
                isOpen={showConfirmation}
                title="Confirm Logout"
                message="Are you sure you want to logout? You will need to login again to access your account."
                confirmText={isLoggingOut ? "Logging out..." : "Yes, Logout"}
                cancelText="Cancel"
                onConfirm={logoutHandlers?.onConfirm || (() => {})}
                onCancel={logoutHandlers?.onCancel || (() => {})}
                confirmDisabled={isLoggingOut}
                cancelDisabled={isLoggingOut}
              />
            ) : (
              children
            )}

            {isLoggingOut && <Loader cover="content" />}
          </div>
        </main>

        {!isSmallPhone && <Footer />}
      </PriceProvider>
    </ThemeProvider>
  );
}
