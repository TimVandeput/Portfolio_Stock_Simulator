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
    // Show loading overlay immediately with correct theme
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains('dark');
      const overlay = document.createElement('div');
      overlay.id = 'logout-loading';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${isDark ? '#2a2d3a' : '#e0e5ec'};
        color: ${isDark ? '#c4b5fd' : '#60a5fa'};
        transition: opacity 0.2s ease;
      `;
      overlay.innerHTML = `
        <div style="text-align: center;">
          <div style="
            width: 32px;
            height: 32px;
            border: 3px solid ${isDark ? '#363a4c' : '#c2c8d0'};
            border-top: 3px solid ${isDark ? '#c4b5fd' : '#60a5fa'};
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 12px;
          "></div>
          <p style="margin: 0; font-size: 14px;">Logging out...</p>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(overlay);
    }
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                const isDark = savedTheme === 'dark';
                
                const loadingOverlay = document.createElement('div');
                loadingOverlay.id = 'theme-loading';
                loadingOverlay.style.cssText = \`
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  z-index: 99999;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: \${isDark ? '#2a2d3a' : '#e0e5ec'};
                  color: \${isDark ? '#c4b5fd' : '#60a5fa'};
                \`;
                
                loadingOverlay.innerHTML = \`
                  <div style="text-align: center;">
                    <div style="
                      width: 32px;
                      height: 32px;
                      border: 3px solid \${isDark ? '#363a4c' : '#c2c8d0'};
                      border-top: 3px solid \${isDark ? '#c4b5fd' : '#60a5fa'};
                      border-radius: 50%;
                      animation: spin 1s linear infinite;
                      margin: 0 auto 12px;
                    "></div>
                    <p style="margin: 0; font-size: 14px;">Loading...</p>
                  </div>
                  <style>
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  </style>
                \`;
                
                document.documentElement.appendChild(loadingOverlay);
                
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                window.removeThemeLoading = function() {
                  const overlay = document.getElementById('theme-loading');
                  if (overlay) {
                    overlay.style.opacity = '0';
                    overlay.style.transition = 'opacity 0.2s ease';
                    setTimeout(() => overlay.remove(), 200);
                  }
                };
                
                setTimeout(() => {
                  if (window.removeThemeLoading) {
                    window.removeThemeLoading();
                  }
                }, 2000);
              })();
            `,
          }}
        />
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
