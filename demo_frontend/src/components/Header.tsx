"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { name: "Game", href: "/game" },
  { name: "A.I.", href: "/ai" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [maxBtnWidth, setMaxBtnWidth] = useState<number | null>(null);
  const pathname = usePathname();
  const hideNav = pathname === "/login";
  const headerRef = useRef<HTMLElement | null>(null);
  const desktopNavRef = useRef<HTMLDivElement | null>(null);

  // Match footer height on mobile
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

  // Equalize button widths on desktop
  useEffect(() => {
    const calc = () => {
      const nav = desktopNavRef.current;
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
        b.style.width = ""; // natural size
        const w = b.getBoundingClientRect().width;
        if (w > max) max = w;
        b.style.width = prevWidth;
      });
      setMaxBtnWidth(Math.ceil(max));
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [navItems.length]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 bg-gradient-to-b from-blue-200 to-[#e0e5ec] z-50 w-full md:py-4 py-0"
    >
      <div className="relative w-full h-full">
        {/* Hamburger (mobile only) */}
        {!hideNav && (
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 p-3 mt-2 text-blue-400"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {/* Desktop nav */}
        <nav
          ref={desktopNavRef}
          className={`hidden md:flex justify-center gap-6 ${
            hideNav ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          {navItems.map((item) => (
            <Link href={item.href} key={item.name} className="no-underline">
              <button
                data-eq
                style={maxBtnWidth ? { width: `${maxBtnWidth}px` } : undefined}
                className="
                  p-3 rounded-xl font-bold
                  bg-[#e0e5ec] text-blue-300
                  shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa]
                  transition hover:bg-blue-100
                "
              >
                {item.name}
              </button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile drawer */}
      {!hideNav && open && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-[#e0e5ec] p-6 shadow-[10px_0_15px_#c2c8d0]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-blue-400">Menu</h2>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="p-2 text-blue-400"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M18 6l-12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.name}
                  onClick={() => setOpen(false)}
                  className="no-underline"
                >
                  <span
                    className="
                      block p-3 rounded-xl font-bold
                      bg-[#e0e5ec] text-blue-300
                      shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa]
                      transition hover:bg-blue-100
                    "
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
