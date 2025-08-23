"use client";

import { useRouter } from "next/navigation";
import { navItems } from "@/components/general/Header";
import type { NavItem } from "@/types";
import * as LucideIcons from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  // Calculate grid dimensions for closest-to-square layout
  const itemCount = navItems.length;
  const columns = Math.ceil(Math.sqrt(itemCount));
  const rows = Math.ceil(itemCount / columns);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] w-full px-4 py-8"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
        <div
          className="grid gap-6 w-full"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(100px, 1fr))`,
            aspectRatio: "1",
          }}
        >
          {navItems.map((item: NavItem) => (
            <div key={item.href} className="flex flex-col items-center gap-3">
              <button
                className="neu-button neumorphic-button flex items-center justify-center aspect-square w-full rounded-xl transition-all duration-150 hover:bg-[var(--btn-hover)] hover:shadow-[var(--shadow-neu-hover)]"
                style={{ color: "var(--btn-text)", fontWeight: "bold" }}
                onClick={() => router.push(item.href)}
              >
                {item.icon &&
                  (() => {
                    // Convert kebab-case to PascalCase (e.g., "gamepad-2" -> "Gamepad2")
                    const iconName = item.icon
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join("");

                    const IconComponent = (LucideIcons as any)[iconName];
                    return IconComponent ? (
                      <IconComponent
                        size={96}
                        style={{ color: "var(--text-primary)" }}
                      />
                    ) : null;
                  })()}
              </button>
              <span
                className="text-base text-center font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
