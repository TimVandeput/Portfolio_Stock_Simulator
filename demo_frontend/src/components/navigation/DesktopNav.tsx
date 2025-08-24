import { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";

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
  const pathname = usePathname();
  const isDashboard = pathname === "/home";

  const filteredNavItems = navItems.filter(
    (item) => !(isDashboard && item.hideOnDashboard)
  );

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
      {filteredNavItems.map((item) => {
        const isActive = pathname === item.href;
        const buttonStyle = {
          ...(maxBtnWidth ? { width: `${maxBtnWidth}px` } : {}),
          ...(isActive
            ? {
                color: "var(--bg-primary)",
                backgroundColor: "var(--text-primary)",
                boxShadow: "var(--shadow-neu-inset)",
                transform: "translateY(1px)",
              }
            : {}),
        };

        return (
          <Link href={item.href} key={item.name} className="no-underline">
            <button
              data-eq
              style={buttonStyle}
              className="neu-button neumorphic-button p-3 rounded-xl font-bold"
            >
              {item.name}
            </button>
          </Link>
        );
      })}
    </nav>
  );
}
