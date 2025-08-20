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
            className="neu-button p-3 rounded-xl font-bold"
          >
            {item.name}
          </button>
        </Link>
      ))}
    </nav>
  );
}
