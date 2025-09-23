"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import HamburgerButton from "@/components/button/HamburgerButton";
import DesktopNav from "@/components/navigation/DesktopNav";
import MobileDrawer from "@/components/navigation/MobileDrawer";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LogoutButton from "@/components/button/LogoutButton";
import CursorTrailButton from "@/components/button/CursorTrailButton";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useHeaderState } from "@/hooks/useHeaderState";

export default function Header({
  onShowConfirmation,
  onUpdateConfirmationLoading,
  onTrailChange,
}: {
  onShowConfirmation: (
    show: boolean,
    loggingOut: boolean,
    onConfirm: () => void,
    onCancel: () => void
  ) => void;
  onUpdateConfirmationLoading?: (loading: boolean) => void;
  onTrailChange?: (enabled: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";

  const { pageTitle, showCenteredTitle } = usePageTitle(pathname);
  const { hideLogout, hideNav, hideHamburger, isHomePage, filteredForView } =
    useHeaderState(pathname);

  return (
    <header
      className="sticky top-0 z-50 w-full py-0 md:py-4 login-card min-h-[calc(3.25rem+0.5rem)] lg:min-h-[calc(3rem+1rem)]"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="w-full h-full grid grid-cols-[auto_1fr_auto] items-center">
        <div className="flex items-center gap-3 pl-4 md:pl-6">
          <div className="hidden md:flex items-center">
            <div className={hideNav ? "invisible" : ""}>
              <DesktopNav navItems={filteredForView} hideNav={false} />
            </div>

            {isHomePage ? (
              <div className="ml-4">
                <Image
                  src="/logoSS.png"
                  alt="Stock Simulator logo"
                  width={200}
                  height={40}
                  className="h-10 w-auto max-w-[200px] object-contain"
                  draggable={false}
                  priority
                />
              </div>
            ) : (
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
            )}
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

            {isHomePage ? (
              <Image
                src="/logoSS_mobile.png"
                alt="Stock Simulator mobile logo"
                width={100}
                height={28}
                className="h-7 w-auto object-contain"
                draggable={false}
                priority
              />
            ) : (
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
            )}
          </div>
        </div>

        {/* Page title */}
        <div className="flex items-center justify-center">
          <h1
            className={`text-sm md:text-2xl lg:text-3xl font-extrabold tracking-wide text-center truncate max-w-[50vw] leading-tight px-2 ${
              !showCenteredTitle ? "invisible" : ""
            }`}
            style={{ color: "var(--text-secondary)" }}
          >
            {pageTitle}
          </h1>
        </div>

        {/* Theme/Trail/Logout */}
        <div className="flex items-center gap-4 pr-4 md:pr-6 justify-end">
          <ThemeToggle />
          <CursorTrailButton onTrailChange={onTrailChange} />
          {!hideLogout && (
            <LogoutButton
              onShowConfirmation={onShowConfirmation}
              onUpdateConfirmationLoading={onUpdateConfirmationLoading}
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
