"use client";

import { useState } from "react";
import Image from "next/image";
import { MousePointer2, MousePointerBan } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import HamburgerButton from "@/components/button/HamburgerButton";
import DesktopNav from "@/components/navigation/DesktopNav";
import MobileDrawer from "@/components/navigation/MobileDrawer";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LogoutButton from "@/components/button/LogoutButton";
import { useAuth } from "@/hooks/useAuth";
import type { NavItem, Role } from "@/types";
import { BREAKPOINTS } from "@/lib/constants/breakpoints";

export const navItems: NavItem[] = [
  // All roles
  { name: "HOME", href: "/home", icon: "home", hideOnDashboard: true },
  // USER only
  { name: "MARKETS", href: "/market", icon: "store" },
  { name: "PORTFOLIO", href: "/portfolio", icon: "briefcase" },
  { name: "ORDERS", href: "/orders", icon: "shoppingcart" },
  // All roles
  { name: "WALLET", href: "/wallet", icon: "wallet" },
  // USER only
  { name: "LIVE", href: "/live", icon: "activity" },
  { name: "NOTIFICATIONS", href: "/notifications", icon: "bell" },
  // ADMIN only
  { name: "USERS", href: "/users", icon: "users" },
  { name: "SYMBOLS", href: "/symbols", icon: "receipt" },
  // All roles
  { name: "ABOUT", href: "/about", icon: "info" },
  { name: "HELP", href: "/help", icon: "help" },
];

export function filterNavItemsByRole(
  items: NavItem[],
  userRole: Role | null
): NavItem[] {
  return items.filter((item) => {
    if (!item.allowedRoles || item.allowedRoles.length === 0) return true;
    if (!userRole) return true;
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

  const handleWidthCalculation = (nav: HTMLDivElement) => {
    const calc = () => {
      if (!nav) return;

      const isDesktop = window.matchMedia(BREAKPOINTS.MOBILE_UP).matches;
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
      className="sticky top-0 z-50 w-full py-0 md:py-4 login-card min-h-[calc(3.25rem+0.5rem)] lg:min-h-[calc(3rem+1rem)]"
      style={{
        background: "var(--bg-surface)",
      }}
    >
      <div className="w-full h-full grid grid-cols-[auto_1fr_auto] items-center">
        <div className="flex items-center gap-3 pl-4 md:pl-6">
          <Link
            href="/home"
            aria-label="Go to Home"
            className="hidden md:flex items-center"
          >
            <Image
              src="/logoSS.png"
              alt="Stock Simulator logo"
              width={200}
              height={40}
              className="h-10 w-auto max-w-[200px] object-contain"
              draggable={false}
              priority
            />
          </Link>

          <div className="md:hidden flex items-center gap-2">
            <div
              className="w-11 h-11 flex items-center justify-center"
              style={
                hideLogout || hideHamburger
                  ? { visibility: "hidden" }
                  : undefined
              }
            >
              <HamburgerButton onClick={() => setOpen(true)} />
            </div>

            <Link href="/home" aria-label="Go to Home">
              <Image
                src="/logoSS_mobile.png"
                alt="Stock Simulator mobile logo"
                width={100}
                height={28}
                className="h-7 w-auto object-contain"
                draggable={false}
                priority
              />
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <DesktopNav
            navItems={filteredNavItems}
            hideNav={hideLogout || hideNav}
            maxBtnWidth={maxBtnWidth}
            onWidthCalculation={handleWidthCalculation}
          />
        </div>

        <div className="flex items-center gap-4 pr-4 md:pr-6 justify-end">
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
