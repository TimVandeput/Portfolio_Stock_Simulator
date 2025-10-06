"use client";

import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  className?: string;
}

export default function Tabs({
  tabs,
  defaultActiveTab,
  className = "",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  return (
    <div className={`w-full ${className}`}>
      {/* Mobile: Dropdown-style selector */}
      <div className="sm:hidden mb-6">
        <div className="neu-card rounded-xl p-1 relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full bg-transparent text-[var(--text-primary)] font-medium p-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] appearance-none cursor-pointer"
            style={{ background: "var(--bg-primary)" }}
          >
            {tabs.map((tab) => (
              <option
                key={tab.id}
                value={tab.id}
                className="bg-[var(--bg-primary)] text-[var(--text-primary)]"
              >
                {tab.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-[var(--text-secondary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop: Traditional tabs */}
      <div className="hidden sm:flex gap-2 mb-6 border-b border-[var(--border-subtle)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-base rounded-t-lg font-medium transition-all duration-200 text-center ${
              activeTab === tab.id
                ? "bg-[var(--bg-secondary)] text-[var(--text-primary)] border-b-2 border-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
