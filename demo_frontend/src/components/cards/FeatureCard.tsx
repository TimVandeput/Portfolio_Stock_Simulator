"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";

interface FeatureCardProps {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  iconColor,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="neu-card p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <DynamicIcon iconName={icon} size={16} className={iconColor} />
        <h3 className="font-medium text-[var(--text-primary)]">{title}</h3>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
