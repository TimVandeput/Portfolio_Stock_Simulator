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

          <main className="flex-1 h-full flex flex-col justify-center items-center">
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
          </main>

          <Footer />

          {isLoggingOut && <Loader />}
        </ThemeProvider>
      </body>
    </html>
  );
}
