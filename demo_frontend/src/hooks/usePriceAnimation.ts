"use client";

import { useState, useRef, useCallback } from "react";

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
