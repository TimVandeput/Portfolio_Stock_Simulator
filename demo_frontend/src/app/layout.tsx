"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";
import CursorTrail from "@/components/effects/CursorTrail";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { logout } from "@/lib/api/auth";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => {
    router.prefetch("/login");
    setShowConfirmation(true);
  };
  const handleCancelLogout = () => setShowConfirmation(false);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true); // show overlay immediately
    try {
      await logout();
      router.replace("/login"); // client-side nav so loading.tsx can appear too
    } catch {
      setIsLoggingOut(false);
      setShowConfirmation(false);
    }
  };

  // When we arrive at /login, clear flags so loader/modal disappear
  useEffect(() => {
    if (pathname === "/login" && (isLoggingOut || showConfirmation)) {
      setIsLoggingOut(false);
      setShowConfirmation(false);
    }
  }, [pathname, isLoggingOut, showConfirmation]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <CursorTrail />
          <Header
            onLogoutClick={handleLogoutClick}
            isLoggingOut={isLoggingOut}
          />

          {/* Keep header/footer visible; loader only covers the main content */}
          <main className="flex-1 w-full flex flex-col justify-center items-center">
            {/* Make this wrapper relative so the content-only loader can position itself */}
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
                  confirmButtonClass="bg-red-500 hover:bg-red-600 text-white"
                  confirmDisabled={isLoggingOut}
                  cancelDisabled={isLoggingOut}
                />
              ) : (
                children
              )}

              {/* Loader only covers the main content area (header/footer remain visible) */}
              {isLoggingOut && <Loader cover="content" />}
            </div>
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
