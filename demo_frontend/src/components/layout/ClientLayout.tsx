"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";
import CursorTrail from "@/components/effects/CursorTrail";
import RotationPrompt from "@/components/ui/RotationPrompt";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import Loader from "@/components/ui/Loader";
import { logout } from "@/lib/api/auth";
import { loadTokensFromStorage } from "@/lib/auth/tokenStorage";

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

  useEffect(() => {
    loadTokensFromStorage();
  }, []);

  const handleLogoutClick = () => {
    router.prefetch("/login");
    setShowConfirmation(true);
  };

  const handleCancelLogout = () => setShowConfirmation(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
    } catch {
      setIsLoggingOut(false);
      setShowConfirmation(false);
    }
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return undefined;
    };
    const cookieValue = getCookie("cursorTrailEnabled");
    if (cookieValue === "true") {
      setCursorTrailEnabled(true);
    } else {
      setCursorTrailEnabled(false);
    }

    const checkMobile = () => {
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      setIsMobile(mobile);
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
      document.cookie = `cursorTrailEnabled=${String(
        cursorTrailEnabled
      )}; path=/; max-age=${60 * 60 * 24 * 365}`;
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
      <RotationPrompt />
      {cursorTrailEnabled && <CursorTrail />}
      <Header
        onLogoutClick={handleLogoutClick}
        isLoggingOut={isLoggingOut}
        cursorTrailEnabled={cursorTrailEnabled}
        setCursorTrailEnabled={setCursorTrailEnabled}
        hideTrailButton={isMobile}
      />

      <main className="flex-1 w-full flex flex-col justify-center items-center">
        <div className="relative w-full h-full flex items-center justify-center">
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

      <Footer />
    </ThemeProvider>
  );
}
