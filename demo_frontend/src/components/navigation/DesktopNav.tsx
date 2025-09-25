"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";
import DynamicIcon from "../ui/DynamicIcon";
import { useDropdownMenu } from "@/hooks/useDropdownMenu";

interface DesktopNavProps {
  navItems: NavItem[];
  hideNav: boolean;
}

export default function DesktopNav({ navItems, hideNav }: DesktopNavProps) {
  const pathname = usePathname();
  const { open, setOpen, panelRef, btnRef, listRef, onKeyDown } =
    useDropdownMenu();

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
    neu-button p-3 font-bold inline-flex items-center gap-2 relative z-50
    ${
      open
        ? "rounded-t-xl border-b border-[var(--border)] menu-open-no-bottom"
        : "rounded-xl"
    }
  `}
        style={{
          transition: "all 0.15s ease",
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.currentTarget.style.transform = "translateY(2px)";
          e.currentTarget.style.boxShadow = "var(--shadow-neu-inset)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        {open ? (
          <DynamicIcon iconName="x" size={18} />
        ) : (
          <DynamicIcon iconName="menu" size={18} />
        )}
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
                      draggable="false"
                    >
                      <div
                        className={`
                          neu-button rounded-xl px-3 py-2 text-center whitespace-nowrap
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
