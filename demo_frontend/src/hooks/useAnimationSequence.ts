"use client";

import { useState, useEffect, useRef } from "react";

interface UseAnimationSequenceOptions {
  itemCount: number;
  initialDelay?: number;
  stagger?: number;
  duration?: number;
}

export function useAnimationSequence({
  itemCount,
  initialDelay = 500,
  stagger = 350,
  duration = 1900,
}: UseAnimationSequenceOptions) {
  const [animateFromLogin] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("fromLogin") === "true";
  });

  const [buttonAnimations, setButtonAnimations] = useState<boolean[]>(
    new Array(itemCount).fill(animateFromLogin ? false : true)
  );
  const [showText, setShowText] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState<boolean[]>(
    new Array(itemCount).fill(animateFromLogin ? false : true)
  );
  const hasAnimated = useRef(false);

  useEffect(() => {
    setButtonAnimations(
      new Array(itemCount).fill(animateFromLogin ? false : true)
    );
    setAnimationComplete(
      new Array(itemCount).fill(animateFromLogin ? false : true)
    );
    setAnimationStarted(false);
  }, [itemCount, animateFromLogin]);

  useEffect(() => {
    if (!animateFromLogin) {
      setShowText(new Array(itemCount).fill(true));
    }
  }, [animateFromLogin, itemCount]);

  useEffect(() => {
    if (hasAnimated.current) return;

    const fromLoginStorage = sessionStorage.getItem("fromLogin") === "true";

    if (!fromLoginStorage || itemCount === 0) return;

    hasAnimated.current = true;
    sessionStorage.removeItem("fromLogin");

    setTimeout(() => {
      setAnimationStarted(true);
    }, initialDelay);
  }, [itemCount, initialDelay]);

  useEffect(() => {
    if (!animateFromLogin || !animationStarted) return;

    const timers: number[] = [];
    for (let i = 0; i < itemCount; i++) {
      // Show text timer
      const textTimer = window.setTimeout(() => {
        setShowText((prev) => {
          if (prev[i]) return prev;
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * stagger + duration);
      timers.push(textTimer);

      // Animation complete timer (when item reaches final position)
      const completeTimer = window.setTimeout(() => {
        setAnimationComplete((prev) => {
          if (prev[i]) return prev;
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * stagger + duration);
      timers.push(completeTimer);
    }

    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, [animateFromLogin, animationStarted, itemCount, stagger, duration]);

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

  const getItemStyle = (index: number) => ({
    transform:
      animateFromLogin && !animationStarted
        ? getRandomStartPosition(index)
        : "translate(0, 0)",
    transition: `transform 1900ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
    transitionDelay: animationStarted ? `${index * stagger}ms` : "0ms",
    opacity: animateFromLogin && !animationStarted ? 0.7 : 1,
  });

  const getTextStyle = (index: number) => ({
    opacity: showText[index] ? 1 : 0,
  });

  const getShadowStyle = (index: number) => ({
    boxShadow: animationComplete[index]
      ? "var(--shadow-neu), 0 4px 15px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
      : "none",
  });

  return {
    animateFromLogin,
    animationStarted,
    getItemStyle,
    getTextStyle,
    getShadowStyle,
    stagger,
  };
}
