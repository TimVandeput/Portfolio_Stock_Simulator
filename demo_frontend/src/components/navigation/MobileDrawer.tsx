import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";

interface MobileDrawerProps {
  isOpen: boolean;
  navItems: NavItem[];
  onClose: () => void;
  hideNav?: boolean;
}

export default function MobileDrawer({
  isOpen,
  navItems,
  onClose,
  hideNav = false,
}: MobileDrawerProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname === "/home";

  const filteredNavItems = navItems.filter(
    (item) => !(isDashboard && item.hideOnDashboard)
  );

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 400);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      if (isDesktop && isOpen) {
        setShouldRender(false);
        setIsAnimating(false);
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[99999] md:hidden">
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute left-0 top-0 bottom-0 w-64 z-[99999] transition-transform duration-500 ease-in-out overflow-y-auto ${
          isAnimating ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--bg-surface)",
          boxShadow: "var(--shadow-large)",
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Menu
            </h2>
            <button
              aria-label="Close menu"
              onClick={onClose}
              className="p-2"
              style={{ color: "var(--text-primary)" }}
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

          {!hideNav && (
            <nav className="flex flex-col gap-4">
              {filteredNavItems.map((item) => {
                const isActive = pathname === item.href;
                const spanStyle = isActive
                  ? {
                      color: "var(--bg-primary)",
                      backgroundColor: "var(--text-primary)",
                      boxShadow: "var(--shadow-neu-inset)",
                      transform: "translateY(1px)",
                    }
                  : {};

                return (
                  <Link
                    href={item.href}
                    key={item.name}
                    onClick={onClose}
                    className="no-underline"
                  >
                    <span
                      className="neu-button neumorphic-button block p-3 rounded-xl font-bold text-center"
                      style={spanStyle}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
