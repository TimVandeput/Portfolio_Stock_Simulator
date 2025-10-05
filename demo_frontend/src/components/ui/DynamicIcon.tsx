import { memo } from "react";
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
  Users,
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
} from "lucide-react";

interface DynamicIconProps {
  iconName: string;
  className?: string;
  style?: React.CSSProperties;
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
  users: Users,
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
};

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
