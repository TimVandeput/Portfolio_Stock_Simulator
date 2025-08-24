"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointer2, MousePointerBan } from "lucide-react";
import { usePathname } from "next/navigation";
import HamburgerButton from "@/components/button/HamburgerButton";
import DesktopNav from "@/components/navigation/DesktopNav";
import MobileDrawer from "@/components/navigation/MobileDrawer";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LogoutButton from "@/components/button/LogoutButton";
import { useAuth } from "@/hooks/useAuth";
import type { NavItem, Role } from "@/types";

export const navItems: NavItem[] = [
  { name: "HOME", href: "/home", icon: "home", hideOnDashboard: true },
  {
    name: "GAME",
    href: "/game",
    icon: "gamepad-2",
    allowedRoles: ["ROLE_USER"],
  },
  { name: "A.I.", href: "/ai", icon: "bot", allowedRoles: ["ROLE_USER"] },
  { name: "ABOUT", href: "/about", icon: "info" },
];

export function filterNavItemsByRole(
  items: NavItem[],
  userRole: Role | null
): NavItem[] {
  return items.filter((item) => {
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true;
    }
    if (!userRole) {
      return true;
    }
    return item.allowedRoles.includes(userRole);
  });
}

export default function Header({
  onLogoutClick,
  isLoggingOut,
  cursorTrailEnabled,
  setCursorTrailEnabled,
  hideTrailButton,
}: {
  onLogoutClick: () => void;
  isLoggingOut: boolean;
  cursorTrailEnabled: boolean;
  setCursorTrailEnabled: (enabled: boolean) => void;
  hideTrailButton?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [maxBtnWidth, setMaxBtnWidth] = useState<number | null>(null);
  const pathname = usePathname();
  const { role } = useAuth();

  const filteredNavItems = filterNavItemsByRole(navItems, role);

  const hideLogout = pathname === "/";
  const hideNav = pathname === "/home";
  const hideHamburger = pathname === "/home";
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const applyHeights = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const header = headerRef.current;
      if (!header) return;

      if (isDesktop) {
        header.style.height = "";
        return;
      }

      const footer = document.querySelector("footer") as HTMLElement | null;
      const footerH = footer?.offsetHeight ?? 64;
      header.style.height = `${footerH}px`;
    };

    applyHeights();
    window.addEventListener("resize", applyHeights);
    return () => window.removeEventListener("resize", applyHeights);
  }, []);

  const handleWidthCalculation = (nav: HTMLDivElement) => {
    const calc = () => {
      if (!nav) return;

      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (!isDesktop) {
        setMaxBtnWidth(null);
        return;
      }

      const btns = nav.querySelectorAll<HTMLButtonElement>("button[data-eq]");
      let max = 0;
      btns.forEach((b) => {
        const prevWidth = b.style.width;
        b.style.width = "";
        const w = b.getBoundingClientRect().width;
        if (w > max) max = w;
        b.style.width = prevWidth;
      });
      setMaxBtnWidth(Math.ceil(max));
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full md:py-4 py-0 login-card"
      style={{
        background: "var(--bg-surface)",
        minHeight: "4rem",
      }}
    >
      <div className="relative w-full h-full flex items-center">
        {!hideLogout && !hideHamburger && (
          <HamburgerButton onClick={() => setOpen(true)} />
        )}

        <div className="flex-1 flex justify-center">
          <DesktopNav
            navItems={filteredNavItems}
            hideNav={hideLogout || hideNav}
            maxBtnWidth={maxBtnWidth}
            onWidthCalculation={handleWidthCalculation}
          />
        </div>

        <div className="absolute right-4 md:right-6 flex gap-4 items-center">
          <ThemeToggle />
          {!hideTrailButton && (
            <button
              className="neu-button p-3 rounded-xl font-bold active:translate-y-0.5 active:duration-75"
              title={
                cursorTrailEnabled
                  ? "Disable Cursor Trail"
                  : "Enable Cursor Trail"
              }
              onClick={() => setCursorTrailEnabled(!cursorTrailEnabled)}
            >
              {cursorTrailEnabled ? (
                <MousePointer2 size={20} style={{ color: "orange" }} />
              ) : (
                <MousePointerBan size={20} style={{ color: "orange" }} />
              )}
            </button>
          )}
          {!hideLogout && (
            <LogoutButton
              onLogoutClick={onLogoutClick}
              isLoggingOut={isLoggingOut}
            />
          )}
        </div>
      </div>

      <MobileDrawer
        isOpen={open && !hideLogout}
        navItems={filteredNavItems}
        hideNav={hideLogout || hideNav}
        onClose={() => setOpen(false)}
      />
    </header>
  );
}
