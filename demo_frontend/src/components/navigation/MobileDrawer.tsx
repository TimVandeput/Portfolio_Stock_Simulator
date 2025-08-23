import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";

interface NavItem {
  name: string;
  href: string;
}

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
        className={`absolute left-0 top-0 bottom-0 w-64 p-6 z-[99999] transition-transform duration-500 ease-in-out ${
          isAnimating ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--bg-surface)",
          boxShadow: "var(--shadow-large)",
        }}
      >
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
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.name}
                onClick={onClose}
                className="no-underline"
              >
                <span className="neu-button neumorphic-button block p-3 rounded-xl font-bold text-center">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
