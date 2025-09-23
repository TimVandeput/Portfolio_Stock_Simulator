"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";
import { Menu, X } from "lucide-react";

interface DesktopNavProps {
  navItems: NavItem[];
  hideNav: boolean;
}

export default function DesktopNav({ navItems, hideNav }: DesktopNavProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (btnRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;
      const items = Array.from(
        listRef.current?.querySelectorAll<HTMLAnchorElement>(
          "a[data-menuitem]"
        ) ?? []
      );
      const i = items.findIndex((el) => el === document.activeElement);

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        btnRef.current?.focus();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const next = items[(i + 1 + items.length) % items.length];
        next?.focus();
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = items[(i - 1 + items.length) % items.length];
        prev?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        items[items.length - 1]?.focus();
      }
    },
    [open]
  );

  // Focus first item when opening
  useEffect(() => {
    if (!open) return;
    const first =
      listRef.current?.querySelector<HTMLAnchorElement>("a[data-menuitem]");
    first?.focus();
  }, [open]);

  const hidden = hideNav
    ? "pointer-events-none opacity-0 h-0 overflow-hidden"
    : "";

  return (
    <div
      className={`relative hidden md:flex items-center ${hidden}`}
      aria-hidden={hideNav || undefined}
    >
      <button
        ref={btnRef}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`
    neu-button neumorphic-button p-3 font-bold inline-flex items-center gap-2 relative z-50
    ${
      open
        ? "rounded-t-xl border-b border-[var(--border)] menu-open-no-bottom"
        : "rounded-xl"
    }
  `}
        onMouseDown={(e) => e.preventDefault()}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
        Menu
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          aria-label="Main navigation"
          onKeyDown={onKeyDown}
          className="
            absolute left-0 top-full
            z-40
          "
        >
          <div
            className="
              bg-[var(--bg-surface)]
              px-8 py-6
              rounded-b-xl rounded-tr-xl
              inline-block
              max-h-[80vh] overflow-y-auto
            "
            style={{
              boxShadow: "var(--shadow-large)",
            }}
          >
            <ul
              ref={listRef}
              className="
                flex flex-col gap-3 md:gap-4 lg:gap-4
                items-stretch
              "
            >
              {navItems.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href} className="list-none">
                    <Link
                      href={item.href}
                      data-menuitem
                      role="menuitem"
                      className="no-underline block"
                      onClick={() => setOpen(false)}
                    >
                      <div
                        className={`
                          rounded-xl px-3 py-2 text-center whitespace-nowrap
                          focus-visible:outline focus-visible:outline-2
                          transition-colors
                          ${idx === 0 ? "mt-4 md:mt-6" : ""}
                        `}
                        style={{
                          color: isActive
                            ? "var(--bg-primary)"
                            : "var(--btn-text)",
                          background: isActive
                            ? "var(--text-primary)"
                            : "var(--btn-bg)",
                          boxShadow: isActive
                            ? "var(--shadow-neu-inset)"
                            : "var(--shadow-neu)",
                        }}
                      >
                        {item.name}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
