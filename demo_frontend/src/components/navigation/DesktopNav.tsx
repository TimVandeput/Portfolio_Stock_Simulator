import { useRef, useEffect } from "react";
import Link from "next/link";

interface NavItem {
  name: string;
  href: string;
}

interface DesktopNavProps {
  navItems: NavItem[];
  hideNav: boolean;
  maxBtnWidth: number | null;
  onWidthCalculation: (nav: HTMLDivElement) => void;
}

export default function DesktopNav({
  navItems,
  hideNav,
  maxBtnWidth,
  onWidthCalculation,
}: DesktopNavProps) {
  const desktopNavRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (desktopNavRef.current) {
      onWidthCalculation(desktopNavRef.current);
    }
  }, [onWidthCalculation]);

  return (
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
              desktop-nav-button
              p-3 rounded-xl font-bold
              bg-[#e0e5ec] text-blue-300
              shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa]
              transition-all duration-150 hover:bg-blue-100
              active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]
              active:brightness-95
              active:translate-y-0.5
              active:duration-75
            "
          >
            {item.name}
          </button>
        </Link>
      ))}
    </nav>
  );
}
