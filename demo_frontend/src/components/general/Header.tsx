"use client";

import { useState, useMemo } from "react";
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
import navItems from "@/lib/constants/navItems";

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
  const pathname = usePathname() || "/";
  const { role } = useAuth();

  const filteredNavItems = filterNavItemsByRole(navItems, role);

  const hideLogout = pathname === "/";
  const hideNav = pathname === "/home" || hideLogout;
  const hideHamburger = pathname === "/home" || hideLogout;

  const isDashboard = pathname === "/home";
  const filteredForView = filteredNavItems.filter(
    (item) => !(isDashboard && item.hideOnDashboard)
  );

  const showCenteredTitle = useMemo(
    () => pathname !== "/" && pathname !== "/home",
    [pathname]
  );

  const pageTitle = useMemo(() => {
    const match = navItems.find((n) => n.href === pathname)?.name;
    if (match) return match;
    const slug = pathname.replace(/^\/+/, "");
    return slug ? slug.replace(/[-_]+/g, " ").toUpperCase() : "";
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50 w-full py-0 md:py-4 login-card min-h-[calc(3.25rem+0.5rem)] lg:min-h-[calc(3rem+1rem)]"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="w-full h-full grid grid-cols-[auto_1fr_auto] items-center">
        <div className="flex items-center gap-3 pl-4 md:pl-6">
          <div className="hidden md:flex items-center">
            <DesktopNav navItems={filteredForView} hideNav={hideNav} />

            <Link href="/home" aria-label="Go to Home" className="ml-4">
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
          </div>

          {/* Mobile */}
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

        {/* Page title */}
        <div className="flex items-center justify-center">
          {showCenteredTitle && (
            <h1
              className="text-sm md:text-2xl lg:text-3xl font-extrabold tracking-wide text-center truncate max-w-[50vw] leading-tight px-2"
              style={{ color: "var(--text-secondary)" }}
              title={pageTitle}
            >
              {pageTitle}
            </h1>
          )}
        </div>

        {/* Theme/Trail/Logout */}
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

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={open && !hideLogout}
        navItems={filteredForView}
        hideNav={hideLogout || hideNav}
        onClose={() => setOpen(false)}
      />
    </header>
  );
}
