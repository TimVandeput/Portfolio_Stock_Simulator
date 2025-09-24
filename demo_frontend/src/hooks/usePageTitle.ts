"use client";

import { useMemo } from "react";
import navItems from "@/lib/constants/navItems";

export function usePageTitle(pathname: string) {
  const pageTitle = useMemo(() => {
    const exactMatch = navItems.find((n) => n.href === pathname)?.name;
    if (exactMatch) return exactMatch;

    const basePathMatch = navItems.find((n) => {
      const navHref = n.href.replace(/\/$/, "");
      const cleanPathname = pathname.replace(/\/$/, "");
      return (
        cleanPathname.startsWith(navHref + "/") || cleanPathname === navHref
      );
    })?.name;

    if (basePathMatch) return basePathMatch;

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
