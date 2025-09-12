"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";
import CursorTrail from "@/components/effects/CursorTrail";
import RotationPrompt from "@/components/ui/RotationPrompt";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PriceProvider } from "@/contexts/PriceContext";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Loader from "@/components/ui/Loader";
import { logout } from "@/lib/api/auth";
import { loadTokensFromStorage } from "@/lib/auth/tokenStorage";
import { getCookie, setCookie } from "@/lib/utils/cookies";
import { BREAKPOINTS } from "@/lib/constants/breakpoints";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [cursorTrailEnabled, setCursorTrailEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallPhone, setIsSmallPhone] = useState(false);

  useEffect(() => {
    loadTokensFromStorage();
  }, []);

  const handleLogoutClick = () => {
    router.prefetch("/");
    setShowConfirmation(true);
  };

  const handleCancelLogout = () => setShowConfirmation(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/");
    } catch {
      setIsLoggingOut(false);
      setShowConfirmation(false);
    }
  };

  useEffect(() => {
    const cookieValue = getCookie("cursorTrailEnabled");
    if (cookieValue === "true") {
      setCursorTrailEnabled(true);
    } else {
      setCursorTrailEnabled(false);
    }

    const checkMobile = () => {
      const mobile = window.matchMedia(BREAKPOINTS.MOBILE_DOWN).matches;
      const smallPhone = window.matchMedia(
        BREAKPOINTS.SMALL_PHONE_DOWN
      ).matches;
      setIsMobile(mobile);
      setIsSmallPhone(smallPhone);
      if (mobile) {
        setCursorTrailEnabled(false);
      } else {
        const savedValue = getCookie("cursorTrailEnabled");
        if (savedValue === "true") {
          setCursorTrailEnabled(true);
        }
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setCookie("cursorTrailEnabled", String(cursorTrailEnabled), {
        days: 365,
      });
    }
  }, [cursorTrailEnabled, isMobile]);

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
          onLogoutClick={handleLogoutClick}
          isLoggingOut={isLoggingOut}
          cursorTrailEnabled={cursorTrailEnabled}
          setCursorTrailEnabled={setCursorTrailEnabled}
          hideTrailButton={isMobile}
        />

        <main className="flex-1 w-full overflow-y-auto flex flex-col">
          <div className="relative w-full min-h-full flex flex-col items-center justify-center flex-1">
            {showConfirmation ? (
              <ConfirmationModal
                isOpen={showConfirmation}
                title="Confirm Logout"
                message="Are you sure you want to logout? You will need to login again to access your account."
                confirmText={isLoggingOut ? "Logging out..." : "Yes, Logout"}
                cancelText="Cancel"
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
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
