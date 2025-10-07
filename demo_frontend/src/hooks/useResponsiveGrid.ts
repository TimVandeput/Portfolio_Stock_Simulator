"use client";

import { useMemo } from "react";

export function useResponsiveGrid(itemCount: number) {
  const gridConfig = useMemo(() => {
    const baseColumns =
      itemCount <= 1 ? 1 : itemCount <= 4 ? 2 : itemCount <= 9 ? 3 : 4;

    return {
      columns: baseColumns,
      containerClass: "w-full max-w-none",
      gridClass: "grid gap-4 sm:gap-6 md:gap-8 auto-rows-fr",
      responsiveColumns: {
        mobile: Math.min(baseColumns, 1),
        tablet: Math.min(baseColumns, 2),
        desktop: baseColumns,
      },
    };
  }, [itemCount]);

  const gridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(1, 1fr)",
      gap: "1rem",
      width: "100%",
      minHeight: "auto",
    }),
    []
  );

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: "100%",
      padding: "1rem",
      paddingTop: "2rem",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "calc(100vh - 6rem)",
      overflowY: "auto" as const,
    }),
    []
  );

  return {
    ...gridConfig,
    gridStyle,
    containerStyle,
  };
}
