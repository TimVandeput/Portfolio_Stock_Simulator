"use client";

import { useMemo } from "react";
import navItems from "@/lib/constants/navItems";

export function usePageTitle(pathname: string) {
  const pageTitle = useMemo(() => {
    const match = navItems.find((n) => n.href === pathname)?.name;
    if (match) return match;

    const slug = pathname.replace(/^\/+/, "");
    return slug ? slug.replace(/[-_]+/g, " ").toUpperCase() : "";
  }, [pathname]);

  const showCenteredTitle = useMemo(
    () => pathname !== "/" && pathname !== "/home",
    [pathname]
  );

  return {
    pageTitle,
    showCenteredTitle,
  };
}
