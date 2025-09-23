"use client";

import { useRouter } from "next/navigation";
import { filterNavItemsByRole } from "@/components/general/Header";
import { navItems } from "@/lib/constants/navItems";
import type { NavItem } from "@/types";
import { useAccessControl } from "@/hooks/useAuth";
import { useAnimationSequence } from "@/hooks/useAnimationSequence";
import { useResponsiveGrid } from "@/hooks/useResponsiveGrid";
import DynamicIcon from "@/components/ui/DynamicIcon";
import Loader from "@/components/ui/Loader";

export default function HomeClient() {
  const router = useRouter();

  const { isLoading, hasAccess, accessError, role } = useAccessControl({
    requireAuth: true,
  });

  const roleFilteredItems = role ? filterNavItemsByRole(navItems, role) : [];
  const dashboardItems = roleFilteredItems.filter(
    (item) => !item.hideOnDashboard
  );

  const { gridStyle } = useResponsiveGrid(dashboardItems.length);
  const { animateFromLogin, getItemStyle, getTextStyle } = useAnimationSequence(
    {
      itemCount: dashboardItems.length,
    }
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading || !role || dashboardItems.length === 0 ? (
        <Loader />
      ) : (
        <div className="dashboard-container flex flex-col items-center justify-center w-full px-4 py-8 pt-12 sm:py-12 sm:pt-16 md:pt-20 pb-16 min-h-full">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto flex flex-col items-center justify-center">
            <div
              className="dashboard-grid w-full grid gap-4 sm:gap-6 my-auto"
              style={gridStyle}
            >
              {dashboardItems.map((item: NavItem, index: number) => (
                <div
                  key={item.href}
                  className="flex flex-col items-center gap-1"
                  style={getItemStyle(index)}
                >
                  <button
                    className="neu-button neumorphic-button flex items-center justify-center aspect-square w-full rounded-xl transition-all duration-150 hover:bg-[var(--btn-hover)] hover:shadow-[var(--shadow-neu-hover)] max-w-20 sm:max-w-24 md:max-w-28 lg:max-w-32"
                    style={{
                      color: "var(--btn-text)",
                      fontWeight: "bold",
                    }}
                    onClick={() => router.push(item.href)}
                  >
                    {item.icon && (
                      <DynamicIcon
                        iconName={item.icon}
                        className="w-[80%] h-[80%] text-primary"
                      />
                    )}
                  </button>
                  <span
                    className={`text-primary text-sm sm:text-base text-center font-bold mt-2 ${
                      animateFromLogin ? "transition-opacity duration-400" : ""
                    }`}
                    style={getTextStyle(index)}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
