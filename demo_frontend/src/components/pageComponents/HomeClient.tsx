"use client";

import { useRouter } from "next/navigation";
import { navItems, filterNavItemsByRole } from "@/components/general/Header";
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
        <div className="dashboard-container h-full flex flex-col items-center justify-center w-full px-4 py-4">
          <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto flex flex-col items-center justify-center">
            <div
              className="dashboard-grid w-full"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(60px, 1fr))`,
                gridTemplateRows: `repeat(${Math.ceil(
                  dashboardItems.length / columns
                )}, minmax(60px, auto))`,
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
                    className="neu-button neumorphic-button flex items-center justify-center aspect-square w-full rounded-xl transition-all duration-150 hover:bg-[var(--btn-hover)] hover:shadow-[var(--shadow-neu-hover)]"
                    style={{
                      color: "var(--btn-text)",
                      fontWeight: "bold",
                      maxWidth: "min(35vw, 30vh, 192px)",
                      maxHeight: "min(35vw, 30vh, 192px)",
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
