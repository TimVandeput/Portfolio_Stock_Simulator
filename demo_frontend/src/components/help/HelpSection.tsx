"use client";

import DynamicIcon from "@/components/ui/DynamicIcon";

interface HelpSectionProps {
  icon: string;
  iconColor: string;
  title: string;
  purpose: string;
  children: React.ReactNode;
}

export default function HelpSection({
  icon,
  iconColor,
  title,
  purpose,
  children,
}: HelpSectionProps) {
  return (
    <div
      className="neu-card p-6 rounded-xl border-l-4"
      style={{ borderLeftColor: iconColor }}
    >
      <div className="flex items-center gap-3 mb-4">
        <DynamicIcon iconName={icon} size={20} style={{ color: iconColor }} />
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </h3>
      </div>
      <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed text-justify">
        <p>
          <strong>Purpose:</strong> {purpose}
        </p>
        {children}
      </div>
    </div>
  );
}
