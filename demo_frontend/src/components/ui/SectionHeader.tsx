"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";

interface SectionHeaderProps {
  icon: string;
  title: string;
  iconColor?: string;
}

export default function SectionHeader({
  icon,
  title,
  iconColor = "var(--accent)",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
        <DynamicIcon iconName={icon} size={24} style={{ color: iconColor }} />
      </div>
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
    </div>
  );
}
