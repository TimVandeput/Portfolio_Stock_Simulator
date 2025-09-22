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
  Download,
  TrendingUp,
  TrendingDown,
  MinusCircle,
  PlusCircle,
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
  dollarsign: DollarSign,
  "dollar-sign": DollarSign,
  alertcircle: AlertCircle,
  chevrondown: ChevronDown,
  chevronup: ChevronUp,
  calendar: Calendar,
  download: Download,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "minus-circle": MinusCircle,
  "plus-circle": PlusCircle,
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
