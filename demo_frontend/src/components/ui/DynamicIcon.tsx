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
} from "lucide-react";

interface DynamicIconProps {
  iconName: string;
  className?: string;
  style?: React.CSSProperties;
}

const iconMap: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
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
};

const DynamicIcon = memo(({ iconName, className, style }: DynamicIconProps) => {
  const IconComponent = iconMap[iconName.toLowerCase()];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} style={style} />;
});

DynamicIcon.displayName = "DynamicIcon";

export default DynamicIcon;
