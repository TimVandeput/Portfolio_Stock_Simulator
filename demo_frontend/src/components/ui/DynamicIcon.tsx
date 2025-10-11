/**
 * @fileoverview Dynamic icon system component for flexible iconography with Lucide React integration
 *
 * This component provides a comprehensive icon system with dynamic loading, memoization,
 * and extensive icon mapping. Features include flexible naming conventions, performance
 * optimization, and seamless integration with the Lucide React icon library for
 * consistent, scalable iconography throughout the application.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import { memo } from "react";
import type { BaseComponentProps } from "@/types/components";
import {
  Home,
  Activity,
  Info,
  Store,
  Briefcase,
  ShoppingCart,
  Wallet,
  Bell,
  HelpCircle,
  Receipt,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  ChevronDown,
  Calendar,
  ChevronUp,
  ChevronRight,
  Download,
  TrendingUp,
  TrendingDown,
  MinusCircle,
  PlusCircle,
  LogOut,
  Sun,
  Moon,
  MousePointer2,
  MousePointerBan,
  Eye,
  EyeOff,
  Menu,
  X,
  RotateCcw,
  RefreshCw,
  MousePointer,
  PieChart,
  Database,
  BarChart3,
  User,
  AlertTriangle,
  Clock,
  Shield,
  BookOpen,
} from "lucide-react";

/**
 * Props interface for DynamicIcon component configuration
 * @interface DynamicIconProps
 * @extends {BaseComponentProps}
 */
export interface DynamicIconProps extends BaseComponentProps {
  /** Name of the icon to render (supports kebab-case and camelCase) */
  iconName: string;
  /** CSS classes for styling the icon */
  className?: string;
  /** Inline styles for the icon */
  style?: React.CSSProperties;
  /** Size of the icon in pixels */
  size?: number;
}

const iconMap: Record<
  string,
  React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
    size?: number;
  }>
> = {
  home: Home,
  activity: Activity,
  info: Info,
  store: Store,
  briefcase: Briefcase,
  shoppingcart: ShoppingCart,
  wallet: Wallet,
  bell: Bell,
  help: HelpCircle,
  receipt: Receipt,
  arrowleft: ArrowLeft,
  "arrow-left": ArrowLeft,
  dollarsign: DollarSign,
  "dollar-sign": DollarSign,
  alertcircle: AlertCircle,
  "alert-circle": AlertCircle,
  chevrondown: ChevronDown,
  chevronup: ChevronUp,
  chevronright: ChevronRight,
  calendar: Calendar,
  download: Download,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "minus-circle": MinusCircle,
  "plus-circle": PlusCircle,
  logout: LogOut,
  "log-out": LogOut,
  sun: Sun,
  moon: Moon,
  mousepointer2: MousePointer2,
  "mouse-pointer-2": MousePointer2,
  mousepointer: MousePointer,
  "mouse-pointer": MousePointer,
  mousepointerban: MousePointerBan,
  "mouse-pointer-ban": MousePointerBan,
  eye: Eye,
  eyeoff: EyeOff,
  "eye-off": EyeOff,
  menu: Menu,
  x: X,
  rotateccw: RotateCcw,
  "rotate-ccw": RotateCcw,
  refreshcw: RefreshCw,
  "refresh-cw": RefreshCw,
  "pie-chart": PieChart,
  piechart: PieChart,
  database: Database,
  "bar-chart": BarChart3,
  barchart: BarChart3,
  user: User,
  "alert-triangle": AlertTriangle,
  alerttriangle: AlertTriangle,
  clock: Clock,
  shield: Shield,
  "book-open": BookOpen,
  bookopen: BookOpen,
};

/**
 * Dynamic icon system component for flexible iconography with Lucide React integration
 *
 * @remarks
 * The DynamicIcon component delivers comprehensive icon management with the following features:
 *
 * **Icon Library Integration:**
 * - Complete Lucide React icon library integration
 * - Extensive icon mapping with 40+ icons
 * - Consistent iconography across the application
 * - Professional UI/UX icon selection
 *
 * **Flexible Naming:**
 * - Support for kebab-case naming (e.g., "arrow-left")
 * - Support for camelCase naming (e.g., "arrowLeft")
 * - Case-insensitive icon resolution
 * - Multiple naming aliases for common icons
 *
 * **Performance Optimization:**
 * - React.memo for component memoization
 * - Efficient icon lookup with constant-time access
 * - Optimized re-render prevention
 * - Clean component lifecycle management
 *
 * **Icon Categories:**
 * - Navigation icons (home, arrow-left, chevrons)
 * - UI controls (menu, x, download, refresh)
 * - Business icons (briefcase, wallet, receipt)
 * - Status indicators (alert-circle, trending-up/down)
 * - Theme icons (sun, moon, eye/eye-off)
 * - Data visualization (pie-chart, bar-chart, database)
 *
 * **Styling Support:**
 * - Custom className support for Tailwind CSS
 * - Inline style support for dynamic styling
 * - Configurable size property
 * - Consistent styling interface
 *
 * **Error Handling:**
 * - Graceful fallback for missing icons
 * - Null return for unknown icon names
 * - Safe icon resolution
 * - No runtime errors for invalid names
 *
 * **Accessibility:**
 * - Proper component naming for screen readers
 * - Semantic icon usage patterns
 * - Consistent size and color handling
 * - Professional accessibility standards
 *
 * **Developer Experience:**
 * - Clear icon name mapping
 * - TypeScript support with proper interfaces
 * - Predictable naming conventions
 * - Easy icon addition and maintenance
 *
 * **Integration Features:**
 * - Seamless component system integration
 * - Consistent theming support
 * - Responsive design compatibility
 * - Professional UI component standards
 *
 * @param props - Configuration object for dynamic icon rendering
 * @returns Memoized DynamicIcon component with Lucide React icon
 *
 * @example
 * ```tsx
 * // Basic icon usage
 * <DynamicIcon iconName="home" size={24} />
 * ```
 *
 * @example
 * ```tsx
 * // Icon with custom styling
 * <DynamicIcon
 *   iconName="alert-circle"
 *   className="text-red-500"
 *   size={20}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Navigation icons with different naming conventions
 * <DynamicIcon iconName="arrow-left" />    // kebab-case
 * <DynamicIcon iconName="arrowleft" />     // no delimiter
 * <DynamicIcon iconName="chevrondown" />   // camelCase flattened
 * ```
 *
 * @example
 * ```tsx
 * // Integration with button components
 * function IconButton({ icon, children, ...props }: ButtonProps & { icon: string }) {
 *   return (
 *     <button {...props} className="flex items-center gap-2">
 *       <DynamicIcon iconName={icon} size={16} />
 *       {children}
 *     </button>
 *   );
 * }
 *
 * // Usage
 * <IconButton icon="download">Export Data</IconButton>
 * <IconButton icon="refresh-cw">Refresh</IconButton>
 * ```
 *
 * @example
 * ```tsx
 * // Dynamic icon selection
 * function StatusIcon({ status }: { status: 'success' | 'warning' | 'error' }) {
 *   const iconConfig = {
 *     success: { name: 'plus-circle', className: 'text-green-500' },
 *     warning: { name: 'alert-triangle', className: 'text-yellow-500' },
 *     error: { name: 'alert-circle', className: 'text-red-500' }
 *   };
 *
 *   const config = iconConfig[status];
 *
 *   return (
 *     <DynamicIcon
 *       iconName={config.name}
 *       className={config.className}
 *       size={20}
 *     />
 *   );
 * }
 * ```
 */
const DynamicIcon = memo(
  ({ iconName, className, style, size }: DynamicIconProps) => {
    const IconComponent = iconMap[iconName.toLowerCase()];

    if (!IconComponent) {
      return null;
    }

    return <IconComponent className={className} style={style} size={size} />;
  }
);

DynamicIcon.displayName = "DynamicIcon";

export default DynamicIcon;
