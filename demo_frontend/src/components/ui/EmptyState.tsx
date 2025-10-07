"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  iconSize?: number;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  iconSize = 48,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="neu-card p-8 rounded-2xl max-w-md mx-auto">
        <DynamicIcon
          iconName={icon}
          size={iconSize}
          className="mx-auto mb-4 text-[var(--text-secondary)]"
        />
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
          {title}
        </h3>
        <p className="text-[var(--text-secondary)]">{description}</p>
      </div>
    </div>
  );
}
