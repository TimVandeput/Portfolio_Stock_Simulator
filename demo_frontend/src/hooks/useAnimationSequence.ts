/**
 * @fileoverview Advanced animation sequence hook for sophisticated UI transitions.
 *
 * This hook provides comprehensive animation orchestration for complex UI sequences,
 * particularly designed for post-login animations and staggered element entrances.
 * It manages timing, positioning, and visual effects for multiple animated elements.
 *
 * The hook provides:
 * - Staggered animation sequences with precise timing control
 * - Random start positions for dynamic entrance effects
 * - Session-based animation triggering (e.g., after login)
 * - Individual element animation state tracking
 * - Smooth transitions with custom easing curves
 * - Visual effects integration (shadows, opacity, transforms)
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Configuration options for animation sequence behavior.
 *
 * @interface UseAnimationSequenceOptions
 */
interface UseAnimationSequenceOptions {
  /** Number of items to animate in the sequence */
  itemCount: number;
  /** Initial delay before starting animations (ms) */
  initialDelay?: number;
  /** Delay between each item's animation start (ms) */
  stagger?: number;
  /** Duration of each individual animation (ms) */
  duration?: number;
}

/**
 * Hook for creating sophisticated staggered animation sequences.
 *
 * Manages complex animation orchestration with multiple elements animating in sequence
 * from random starting positions to their final positions. Particularly effective for
 * post-login animations and dashboard element reveals.
 *
 * @param options - Animation configuration options
 * @param options.itemCount - Number of items to animate
 * @param options.initialDelay - Delay before starting sequence (default: 500ms)
 * @param options.stagger - Delay between each item (default: 350ms)
 * @param options.duration - Animation duration per item (default: 1900ms)
 *
 * @returns Animation control object with style generators and state
 *
 * @remarks
 * This hook provides sophisticated animation capabilities:
 * - Detects login-triggered animations via sessionStorage
 * - Generates random start positions for dynamic effects
 * - Manages individual element timing and states
 * - Provides style generators for transforms, opacity, and shadows
 * - Handles animation lifecycle with proper cleanup
 * - Supports custom easing curves and transitions
 *
 * The animation sequence consists of:
 * 1. Elements start from random off-screen positions
 * 2. Each element animates to its final position with staggered timing
 * 3. Text content fades in after element positioning
 * 4. Shadow effects are applied after animation completion
 *
 * @example
 * ```tsx
 * function AnimatedDashboard() {
 *   const cards = ['Portfolio', 'Market', 'Orders', 'Settings'];
 *
 *   const {
 *     animateFromLogin,
 *     getItemStyle,
 *     getTextStyle,
 *     getShadowStyle
 *   } = useAnimationSequence({
 *     itemCount: cards.length,
 *     initialDelay: 300,
 *     stagger: 200,
 *     duration: 1500
 *   });
 *
 *   return (
 *     <div className="dashboard-grid">
 *       {cards.map((card, index) => (
 *         <div
 *           key={card}
 *           style={{
 *             ...getItemStyle(index),
 *             ...getShadowStyle(index)
 *           }}
 *           className="dashboard-card"
 *         >
 *           <span style={getTextStyle(index)}>
 *             {card}
 *           </span>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Post-login animation sequence
 * function PostLoginAnimation() {
 *   const menuItems = ['Home', 'Portfolio', 'Market', 'Help'];
 *
 *   const animation = useAnimationSequence({
 *     itemCount: menuItems.length,
 *     initialDelay: 500,
 *     stagger: 300
 *   });
 *
 *   useEffect(() => {
 *     // Set session flag for animation trigger
 *     if (userJustLoggedIn) {
 *       sessionStorage.setItem('fromLogin', 'true');
 *     }
 *   }, [userJustLoggedIn]);
 *
 *   return (
 *     <nav className="animated-nav">
 *       {menuItems.map((item, i) => (
 *         <button
 *           key={item}
 *           style={animation.getItemStyle(i)}
 *           className="nav-button"
 *         >
 *           <span style={animation.getTextStyle(i)}>
 *             {item}
 *           </span>
 *         </button>
 *       ))}
 *     </nav>
 *   );
 * }
 * ```
 */
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
