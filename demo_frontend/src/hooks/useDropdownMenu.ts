"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

export function useDropdownMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const pathname = usePathname();

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

  useEffect(() => {
    if (!open) return;
    const first =
      listRef.current?.querySelector<HTMLAnchorElement>("a[data-menuitem]");
    first?.focus();
  }, [open]);

  return {
    open,
    setOpen,
    panelRef,
    btnRef,
    listRef,
    onKeyDown,
  };
}
