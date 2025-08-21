"use client";

import { useState, useEffect } from "react";

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
          This site uses <span style={{ color: "var(--cookie-banner-red, #ef4444)", fontWeight: "bold" }}>essential cookies</span> for authentication, role management, and theme preference. These cookies are required for the website to function and cannot be disabled.
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
