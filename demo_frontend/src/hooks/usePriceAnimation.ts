/**
 * @fileoverview Price change animation hook for visual feedback on market data updates.
 *
 * This hook provides sophisticated animation management for stock price changes,
 * creating visual feedback when prices update. It manages pulsing animations,
 * timeout cleanup, and provides utilities for triggering and clearing animations.
 *
 * The hook provides:
 * - Price change animation triggers with automatic cleanup
 * - Symbol-specific animation state tracking
 * - Timeout management for animation duration control
 * - Bulk animation clearing for performance optimization
 * - Memory leak prevention with proper cleanup
 * - Integration with real-time price updates
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import { useState, useRef, useCallback } from "react";

/**
 * Hook for managing price change animations and visual feedback.
 *
 * Provides comprehensive animation control for stock price changes, including
 * pulsing effects, timeout management, and cleanup utilities.
 *
 * @returns Animation control object with state and management functions
 *
 * @remarks
 * This hook manages visual feedback for price changes:
 * - Maintains a set of symbols currently showing animations
 * - Triggers pulsing animations when prices change
 * - Automatically clears animations after a set duration
 * - Prevents memory leaks with proper timeout cleanup
 * - Supports bulk clearing for performance optimization
 * - Integrates seamlessly with real-time price streaming
 *
 * The animation system uses timeouts to control duration and automatically
 * removes symbols from the animation set when animations complete.
 *
 * @example
 * ```tsx
 * function PriceDisplay({ symbol, price }) {
 *   const { pulsatingSymbols, triggerPulse } = usePriceAnimation();
 *   const isPulsating = pulsatingSymbols.has(symbol);
 *
 *   useEffect(() => {
 *     // Trigger animation when price changes
 *     if (price !== previousPrice) {
 *       triggerPulse(symbol);
 *     }
 *   }, [price, previousPrice, symbol, triggerPulse]);
 *
 *   return (
 *     <div className={`price ${isPulsating ? 'animate-pulse' : ''}`}>
 *       ${price.toFixed(2)}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Integration with price context
 * function PriceProvider() {
 *   const [prices, setPrices] = useState({});
 *   const { pulsatingSymbols, triggerPulse, clearAllPulses } = usePriceAnimation();
 *
 *   const handlePriceUpdate = useCallback((symbol, newPrice) => {
 *     setPrices(prev => {
 *       const oldPrice = prev[symbol]?.last;
 *       if (oldPrice !== newPrice) {
 *         triggerPulse(symbol); // Animate price change
 *       }
 *       return {
 *         ...prev,
 *         [symbol]: { last: newPrice, lastUpdate: Date.now() }
 *       };
 *     });
 *   }, [triggerPulse]);
 *
 *   // Clear animations on logout
 *   useEffect(() => {
 *     if (!isAuthenticated) {
 *       clearAllPulses();
 *     }
 *   }, [isAuthenticated, clearAllPulses]);
 *
 *   return (
 *     <PriceContext.Provider value={{ prices, pulsatingSymbols }}>
 *       {children}
 *     </PriceContext.Provider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom animation duration and styling
 * function AnimatedPriceCard({ symbol, price, change }) {
 *   const { pulsatingSymbols, triggerPulse } = usePriceAnimation();
 *   const isAnimating = pulsatingSymbols.has(symbol);
 *
 *   const animationClass = useMemo(() => {
 *     if (!isAnimating) return '';
 *     return change > 0 ? 'pulse-green' : 'pulse-red';
 *   }, [isAnimating, change]);
 *
 *   return (
 *     <div className={`price-card ${animationClass}`}>
 *       <span className="symbol">{symbol}</span>
 *       <span className="price">${price.toFixed(2)}</span>
 *       <span className={`change ${change >= 0 ? 'positive' : 'negative'}`}>
 *         {change > 0 ? '+' : ''}{change.toFixed(2)}%
 *       </span>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePriceAnimation() {
  const [pulsatingSymbols, setPulsatingSymbols] = useState<Set<string>>(
    new Set()
  );
  const pulseTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const triggerPulse = useCallback((symbol: string) => {
    setPulsatingSymbols((prevPulsing) => {
      const newPulsing = new Set(prevPulsing);
      newPulsing.add(symbol);
      return newPulsing;
    });

    if (pulseTimeoutRef.current[symbol]) {
      clearTimeout(pulseTimeoutRef.current[symbol]);
    }

    pulseTimeoutRef.current[symbol] = setTimeout(() => {
      setPulsatingSymbols((prevPulsing) => {
        const newPulsing = new Set(prevPulsing);
        newPulsing.delete(symbol);
        return newPulsing;
      });
      delete pulseTimeoutRef.current[symbol];
    }, 1500);
  }, []);

  const clearAllPulses = useCallback(() => {
    Object.values(pulseTimeoutRef.current).forEach((timeout) => {
      clearTimeout(timeout);
    });
    pulseTimeoutRef.current = {};
    setPulsatingSymbols(new Set());
  }, []);

  const clearPulseTimeouts = useCallback(() => {
    Object.values(pulseTimeoutRef.current).forEach((timeout) => {
      clearTimeout(timeout);
    });
    pulseTimeoutRef.current = {};
  }, []);

  return {
    pulsatingSymbols,
    triggerPulse,
    clearAllPulses,
    clearPulseTimeouts,
  };
}
