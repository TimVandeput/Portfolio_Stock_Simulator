"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";

interface InfoCardProps {
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

export default function InfoCard({
  icon,
  iconColor,
  title,
  description,
}: InfoCardProps) {
  return (
    <div className="neu-card p-4 rounded-xl">
      <h4 className="font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2">
        <DynamicIcon iconName={icon} size={16} className={iconColor} />
        {title}
      </h4>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-justify">
        {description}
      </p>
    </div>
  );
}
