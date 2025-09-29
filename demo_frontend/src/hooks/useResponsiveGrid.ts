"use client";

import { useMemo } from "react";

export function useResponsiveGrid(itemCount: number) {
  const columns = useMemo(() => {
    if (itemCount <= 1) return 1;
    if (itemCount <= 4) return 2;
    if (itemCount <= 9) return 3;
    return 4;
  }, [itemCount]);

  const gridStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      maxHeight: "min(80vh, 600px)",
    }),
    [columns]
  );

  return {
    columns,
    gridStyle,
  };
}
