"use client";

import { useRouter } from "next/navigation";
import { filterNavItemsByRole } from "@/components/general/Header";
import { navItems } from "@/lib/constants/navItems";
import type { NavItem } from "@/types";
import { useEffect, useState, useRef } from "react";
import { useAccessControl } from "@/hooks/useAuth";
import NoAccessModal from "@/components/ui/NoAccessModal";
import DynamicIcon from "@/components/ui/DynamicIcon";
import Loader from "@/components/ui/Loader";

export default function HomeClient() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const { isLoading, hasAccess, accessError, role } = useAccessControl({
    requireAuth: true,
  });

  const fromLogin =
    typeof window !== "undefined" &&
    sessionStorage.getItem("fromLogin") === "true";

  const roleFilteredItems = role ? filterNavItemsByRole(navItems, role) : [];
  const dashboardItems = roleFilteredItems.filter(
    (item) => !item.hideOnDashboard
  );

  const [animateFromLogin] = useState(fromLogin);
  const [buttonAnimations, setButtonAnimations] = useState<boolean[]>(
    new Array(dashboardItems.length).fill(fromLogin ? false : true)
  );
  const [showText, setShowText] = useState<boolean[]>(
    new Array(dashboardItems.length).fill(fromLogin ? false : true)
  );

  const [animationStarted, setAnimationStarted] = useState(false);

  const initialDelay = 500;
  const stagger = 350;
  const textOffset = 450;

  useEffect(() => {
    setButtonAnimations(
      new Array(dashboardItems.length).fill(fromLogin ? false : true)
    );
    setShowText(
      new Array(dashboardItems.length).fill(fromLogin ? false : true)
    );
    setAnimationStarted(false);
  }, [dashboardItems.length, fromLogin]);
  const hasAnimated = useRef(false);

  const getResponsiveColumns = () => {
    const itemCount = dashboardItems.length;
    if (itemCount <= 1) return 1;
    if (itemCount <= 4) return 2;
    if (itemCount <= 9) return 3;
    return 4;
  };

  const columns = getResponsiveColumns();

  useEffect(() => {
    if (!isLoading && !hasAccess && accessError) {
      setShowModal(true);
    }
  }, [isLoading, hasAccess, accessError]);

  useEffect(() => {
    if (hasAnimated.current) return;

    const fromLoginStorage = sessionStorage.getItem("fromLogin") === "true";

    if (!fromLoginStorage || dashboardItems.length === 0) return;

    hasAnimated.current = true;
    sessionStorage.removeItem("fromLogin");

    setTimeout(() => {
      setAnimationStarted(true);
    }, initialDelay);
  }, [dashboardItems.length]);

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
      ) : isLoading || !role || dashboardItems.length === 0 ? (
        <Loader />
      ) : (
        <div className="dashboard-container flex flex-col items-center justify-center w-full px-4 py-8 pt-12 sm:py-12 sm:pt-16 md:pt-20 pb-16 min-h-full">
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto flex flex-col items-center justify-center">
            <div
              className="dashboard-grid w-full grid gap-4 sm:gap-6 my-auto"
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                maxHeight: "min(80vh, 600px)",
              }}
            >
              {dashboardItems.map((item: NavItem, index: number) => (
                <div
                  key={item.href}
                  className="flex flex-col items-center gap-1"
                  style={{
                    transform:
                      animateFromLogin && !animationStarted
                        ? getRandomStartPosition(index)
                        : "translate(0, 0)",
                    transition: `transform 1900ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                    transitionDelay: animationStarted
                      ? `${index * stagger}ms`
                      : "0ms",
                    opacity: animateFromLogin && !animationStarted ? 0.7 : 1,
                  }}
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
                    className="text-primary text-sm sm:text-base text-center font-bold transition-opacity duration-500 mt-2"
                    style={{
                      opacity: animateFromLogin
                        ? animationStarted
                          ? 1
                          : 0
                        : 1,
                      transitionDelay: animationStarted
                        ? `${index * stagger + textOffset}ms`
                        : "0ms",
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
