export const BREAKPOINTS = {
  // Pixel values
  SMALL_PHONE: 350,
  MOBILE: 767,
  TABLET: 1024,
  DESKTOP: 1280,

  // Media query strings
  SMALL_PHONE_DOWN: "(max-width: 350px)",
  MOBILE_DOWN: "(max-width: 767px)",
  MOBILE_UP: "(min-width: 768px)",
  TABLET_UP: "(min-width: 1024px)",
  DESKTOP_UP: "(min-width: 1280px)",

  // Landscape orientation
  LANDSCAPE_MEDIUM_DOWN: "(max-width: 1024px) and (orientation: landscape)",
} as const;

// Common responsive utilities
export const getResponsiveClasses = {
  hideOnSmallPhone: "max-[350px]:hidden",
  hideOnMobile: "max-md:hidden",
  showOnMobile: "md:hidden",
  mobileFullWidth: "max-md:w-full",
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
