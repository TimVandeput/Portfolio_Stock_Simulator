import { memo } from "react";
import { Home, Activity, Info } from "lucide-react";

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
