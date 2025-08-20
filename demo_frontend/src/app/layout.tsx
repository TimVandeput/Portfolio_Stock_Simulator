"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";
import CursorTrail from "@/components/effects/CursorTrail";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useState } from "react";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { logout } from "@/lib/api/auth";

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
}: Readonly<{ children: React.ReactNode }>) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutClick = () => setShowConfirmation(true);
  const handleCancelLogout = () => setShowConfirmation(false);
  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
      setShowConfirmation(false);
    }
  };

  return (
    <html lang="en">
      <head>
      </head>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
