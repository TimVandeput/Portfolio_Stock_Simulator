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
