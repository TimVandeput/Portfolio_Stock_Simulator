"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import HamburgerButton from "@/components/navigation/HamburgerButton";
import DesktopNav from "@/components/navigation/DesktopNav";
import MobileDrawer from "@/components/navigation/MobileDrawer";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navItems = [
  { name: "GAME", href: "/game" },
  { name: "A.I.", href: "/ai" },
  { name: "ABOUT", href: "/about" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [maxBtnWidth, setMaxBtnWidth] = useState<number | null>(null);
  const pathname = usePathname();
  const hideNav = pathname === "/login";
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
      className="sticky top-0 bg-gradient-to-b from-blue-300 to-[#e0e5ec] z-50 w-full md:py-4 py-0"
    >
      <div className="relative w-full h-full flex items-center">
        {!hideNav && <HamburgerButton onClick={() => setOpen(true)} />}

        <div className="flex-1 flex justify-center">
          <DesktopNav
            navItems={navItems}
            hideNav={hideNav}
            maxBtnWidth={maxBtnWidth}
            onWidthCalculation={handleWidthCalculation}
          />
        </div>

        {!hideNav && (
          <div className="absolute right-4 md:right-6 md:block">
            <ThemeToggle />
          </div>
        )}
      </div>

      <MobileDrawer
        isOpen={open && !hideNav}
        navItems={navItems}
        onClose={() => setOpen(false)}
      />
    </header>
  );
}
