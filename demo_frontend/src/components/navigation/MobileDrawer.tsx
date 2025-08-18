import Link from "next/link";
import { useEffect, useState } from "react";

interface NavItem {
  name: string;
  href: string;
}

interface MobileDrawerProps {
  isOpen: boolean;
  navItems: NavItem[];
  onClose: () => void;
}

export default function MobileDrawer({
  isOpen,
  navItems,
  onClose,
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
        className={`absolute left-0 top-0 bottom-0 w-64 bg-[#e0e5ec] p-6 shadow-[10px_0_15px_#c2c8d0] z-[99999] transition-transform duration-500 ease-in-out ${
          isAnimating ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-blue-400">Menu</h2>
          <button
            aria-label="Close menu"
            onClick={onClose}
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
              onClick={onClose}
              className="no-underline"
            >
              <span
                className="
                  block p-3 rounded-xl font-bold
                  bg-[#e0e5ec] text-blue-300
                  shadow-[6px_6px_10px_#c2c8d0,-5px_-5px_10px_#e6f0fa]
                  transition-all duration-150 hover:bg-blue-100
                  active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.25),inset_-2px_-2px_5px_rgba(255,255,255,0.7)]
                  active:brightness-95
                  active:translate-y-0.5
                  active:duration-75
                  text-center
                "
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
