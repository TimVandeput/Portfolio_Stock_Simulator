import { memo } from "react";
import * as LucideIcons from "lucide-react";

interface DynamicIconProps {
  iconName: string;
  className?: string;
  style?: React.CSSProperties;
}

function formatIconName(iconName: string): string {
  return iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

const DynamicIcon = memo(({ iconName, className, style }: DynamicIconProps) => {
  const formattedName = formatIconName(iconName);

  const IconComponent = (
    LucideIcons as unknown as Record<
      string,
      React.ComponentType<{
        className?: string;
        style?: React.CSSProperties;
      }>
    >
  )[formattedName] as React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} style={style} />;
});

DynamicIcon.displayName = "DynamicIcon";

export default DynamicIcon;
