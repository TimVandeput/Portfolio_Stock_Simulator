"use client";

import { useRouter } from "next/navigation";
import { navItems, filterNavItemsByRole } from "@/components/general/Header";
import type { NavItem } from "@/types";
import * as LucideIcons from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAccessControl } from "@/hooks/useAuth";
import NoAccessModal from "@/components/ui/NoAccessModal";

export default function HomeClient() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { isLoading, hasAccess, accessError, role } = useAccessControl({
    requireAuth: true,
  });

  const fromLogin =
    typeof window !== "undefined" &&
    sessionStorage.getItem("fromLogin") === "true";

  const roleFilteredItems = filterNavItemsByRole(navItems, role);
  const dashboardItems = roleFilteredItems.filter(
    (item) => !item.hideOnDashboard
  );

  const [animateFromLogin] = useState(fromLogin);
  const [buttonAnimations, setButtonAnimations] = useState<boolean[]>(
    fromLogin
      ? new Array(dashboardItems.length).fill(false)
      : new Array(dashboardItems.length).fill(true)
  );
  const [showText, setShowText] = useState<boolean[]>(
    fromLogin
      ? new Array(dashboardItems.length).fill(false)
      : new Array(dashboardItems.length).fill(true)
  );
  const hasAnimated = useRef(false);

  const itemCount = dashboardItems.length;
  const columns = Math.ceil(Math.sqrt(itemCount));

  useEffect(() => {
    if (!isLoading && !hasAccess && accessError) {
      setShowModal(true);
    }
  }, [isLoading, hasAccess, accessError]);

  useEffect(() => {
    if (hasAnimated.current) return;

    const fromLoginStorage = sessionStorage.getItem("fromLogin") === "true";

    if (fromLoginStorage) {
      hasAnimated.current = true;
      sessionStorage.removeItem("fromLogin");

      setTimeout(() => {
        dashboardItems.forEach((_, index) => {
          setTimeout(() => {
            setButtonAnimations((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });

            setTimeout(() => {
              setShowText((prev) => {
                const newState = [...prev];
                newState[index] = true;
                return newState;
              });
            }, 1500);
          }, index * 800);
        });
      }, 500);
    }
  }, [dashboardItems]);

  const getRandomStartPosition = (index: number) => {
    const directions = [
      "translate(-100vw, -100vh)",
      "translate(0, -100vh)",
      "translate(100vw, -100vh)",
      "translate(-100vw, 0)",
      "translate(100vw, 0)",
      "translate(-100vw, 100vh)",
      "translate(0, 100vh)",
      "translate(100vw, 100vh)",
    ];
    return directions[index % directions.length];
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {showModal ? (
        <NoAccessModal
          isOpen={showModal}
          accessType={accessError?.reason}
          message={accessError?.message || "Access denied"}
          onClose={() => setShowModal(false)}
        />
      ) : (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center w-full px-4 overflow-hidden"
          style={{ background: "var(--bg-primary)" }}
        >
          <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto flex flex-col items-center justify-center">
            <div
              className="grid gap-2 sm:gap-3 lg:gap-4 w-full"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(80px, 1fr))`,
                aspectRatio: "1",
              }}
            >
              {dashboardItems.map((item: NavItem, index: number) => (
                <div
                  key={item.href}
                  className="flex flex-col items-center gap-2 sm:gap-3"
                  style={{
                    transform:
                      animateFromLogin && !buttonAnimations[index]
                        ? getRandomStartPosition(index)
                        : "translate(0, 0)",
                    transition:
                      "transform 3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    opacity:
                      animateFromLogin && !buttonAnimations[index] ? 0.7 : 1,
                  }}
                >
                  <button
                    className="neu-button neumorphic-button flex items-center justify-center aspect-square w-full max-w-48 rounded-xl transition-all duration-150 hover:bg-[var(--btn-hover)] hover:shadow-[var(--shadow-neu-hover)]"
                    style={{ color: "var(--btn-text)", fontWeight: "bold" }}
                    onClick={() => router.push(item.href)}
                  >
                    {item.icon &&
                      (() => {
                        const iconName = item.icon
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join("");

                        const IconComponent = (
                          LucideIcons as unknown as Record<
                            string,
                            React.ComponentType<{
                              className?: string;
                              style?: React.CSSProperties;
                            }>
                          >
                        )[iconName] as React.ComponentType<{
                          className?: string;
                          style?: React.CSSProperties;
                        }>;
                        return IconComponent ? (
                          <IconComponent
                            className="w-[80%] h-[80%]"
                            style={{ color: "var(--text-primary)" }}
                          />
                        ) : null;
                      })()}
                  </button>
                  <span
                    className="text-sm sm:text-base text-center font-bold transition-opacity duration-300"
                    style={{
                      color: "var(--text-primary)",
                      opacity: animateFromLogin ? (showText[index] ? 1 : 0) : 1,
                    }}
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
