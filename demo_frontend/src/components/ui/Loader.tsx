/**
 * @fileoverview Professional loading component with multiple coverage modes and theme integration
 *
 * This component provides comprehensive loading states with flexible positioning,
 * professional animations, and consistent theming. Features include page, content,
 * and main area coverage modes with smooth spinner animations and customizable
 * styling for seamless integration across different loading scenarios.
 */

"use client";

import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for Loader component configuration
 * @interface LoaderProps
 * @extends {BaseComponentProps}
 */
export interface LoaderProps extends BaseComponentProps {
  /** Coverage mode determining positioning and z-index */
  cover?: "page" | "content" | "main";
  /** Additional CSS classes for customization */
  className?: string;
}

/**
 * Professional loading component with multiple coverage modes and theme integration
 *
 * @remarks
 * The Loader component delivers comprehensive loading states with the following features:
 *
 * **Coverage Modes:**
 * - Page mode: Fixed full-screen overlay with highest z-index
 * - Content mode: Absolute positioned overlay for content areas
 * - Main mode: Flexible container for main content areas
 * - Strategic positioning for different loading contexts
 *
 * **Visual Design:**
 * - Professional spinning animation with 4px border
 * - Rounded spinner with transparent top border
 * - Clean typography with semibold weight and tracking
 * - Centered layout with consistent gap spacing
 *
 * **Animation System:**
 * - CSS animate-spin class for smooth rotation
 * - Performance-optimized transform animations
 * - Consistent timing and easing
 * - Professional loading indicator patterns
 *
 * **Theme Integration:**
 * - CSS custom properties for dynamic theming
 * - Loader-specific spinner color variables
 * - Background color synchronization with theme
 * - Primary text color integration
 *
 * **Layout Flexibility:**
 * - Grid place-items-center for perfect centering
 * - Flexbox content alignment
 * - Responsive design compatibility
 * - Custom className support for extensions
 *
 * **Z-Index Management:**
 * - Page mode: z-[9999] for full-screen coverage
 * - Content mode: z-[5] for content area overlay
 * - Main mode: Natural stacking context
 * - Strategic layering for proper visibility
 *
 * **Positioning System:**
 * - Fixed positioning for page-level loading
 * - Absolute positioning for content overlays
 * - Flexible positioning for main content
 * - Responsive inset and sizing
 *
 * **Accessibility:**
 * - Clear loading message for screen readers
 * - Semantic HTML structure
 * - Appropriate contrast ratios
 * - Professional loading patterns
 *
 * **Performance:**
 * - Lightweight component structure
 * - CSS-based animations for optimal performance
 * - Minimal DOM footprint
 * - Efficient rendering patterns
 *
 * **Use Cases:**
 * - Full-page loading states
 * - Content area loading overlays
 * - Component-level loading indicators
 * - Data fetching feedback
 *
 * @param props - Configuration object for loader display and positioning
 * @returns Loader component with animated loading indicator
 *
 * @example
 * ```tsx
 * // Full-page loading overlay
 * <Loader cover="page" />
 * ```
 *
 * @example
 * ```tsx
 * // Content area loading overlay
 * <div className="relative">
 *   <ContentComponent />
 *   {isLoading && <Loader cover="content" />}
 * </div>
 * ```
 *
 * @example
 * ```tsx
 * // Main content area loading
 * function Dashboard() {
 *   const { data, isLoading } = useDashboardData();
 *
 *   if (isLoading) {
 *     return <Loader cover="main" />;
 *   }
 *
 *   return <DashboardContent data={data} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom styled loader
 * <Loader
 *   cover="content"
 *   className="bg-white/80 backdrop-blur-sm"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Conditional loading with multiple states
 * function DataView() {
 *   const [loading, setLoading] = useState(true);
 *   const [data, setData] = useState(null);
 *
 *   useEffect(() => {
 *     fetchData()
 *       .then(setData)
 *       .finally(() => setLoading(false));
 *   }, []);
 *
 *   return (
 *     <div className="data-container">
 *       {loading ? (
 *         <Loader cover="main" />
 *       ) : data ? (
 *         <DataTable data={data} />
 *       ) : (
 *         <EmptyState
 *           icon="database"
 *           title="No Data"
 *           description="No data available to display."
 *         />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export default function Loader({ cover = "main", className }: LoaderProps) {
  const overlayClasses = `grid place-items-center ${className ?? ""}`;
  const styleOverlay = { backgroundColor: "var(--bg-primary)" } as const;
  const styleSpinner = {
    borderColor: "var(--loader-spinner)",
    borderTopColor: "transparent",
  } as const;

  const content = (
    <div className="flex flex-col items-center gap-3">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4"
        style={styleSpinner}
      />
      <span
        className="font-semibold tracking-wide"
        style={{ color: "var(--text-primary)" }}
      >
        Loading...
      </span>
    </div>
  );

  if (cover === "content") {
    return (
      <div
        className={`absolute inset-0 z-[5] ${overlayClasses}`}
        style={styleOverlay}
      >
        {content}
      </div>
    );
  }

  if (cover === "main") {
    return (
      <div
        className={`flex-1 flex items-center justify-center ${className ?? ""}`}
        style={styleOverlay}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[9999] ${overlayClasses}`}
      style={styleOverlay}
    >
      {content}
    </div>
  );
}
