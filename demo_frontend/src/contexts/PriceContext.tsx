"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { getAllCurrentPrices } from "@/lib/api/prices";
import { getAccessToken } from "@/lib/auth/tokenStorage";
import { usePriceStream } from "@/hooks/usePriceStream";
import { usePriceAnimation } from "@/hooks/usePriceAnimation";
import type { Price, Prices, PriceContextType } from "@/types/prices";

const PriceContext = createContext<PriceContextType>({
  prices: {},
  pulsatingSymbols: new Set(),
  isInitialLoading: false,
  hasInitialPrices: false,
  error: null,
  refreshPrices: async () => {},
});

export function PriceProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<Prices>({});
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [hasInitialPrices, setHasInitialPrices] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializationRef = useRef(false);

  const { pulsatingSymbols, triggerPulse, clearAllPulses, clearPulseTimeouts } =
    usePriceAnimation();

  const isAuthenticated = () => !!getAccessToken();

  const handlePriceUpdate = useCallback(
    (symbol: string, price: number, percentChange?: number) => {
      setPrices((prev) => {
        const currentPrice = prev[symbol]?.last;

        if (currentPrice !== price) {
          console.log(`💥 Price update: ${symbol} ${currentPrice} → ${price}`);

          triggerPulse(symbol);

          return {
            ...prev,
            [symbol]: {
              last: price,
              percentChange,
              lastUpdate: Date.now(),
            },
          };
        }
        return prev;
      });
    },
    [triggerPulse]
  );

  const { startPriceStream, closeStream, isStreamActive } = usePriceStream({
    onPriceUpdate: handlePriceUpdate,
    hasInitialPrices,
  });

  const loadInitialPrices = useCallback(async () => {
    if (isInitialLoading || hasInitialPrices || !isAuthenticated()) return;

    try {
      setIsInitialLoading(true);
      setError(null);
      console.log("🔄 Loading initial prices via Yahoo batch...");

      const allPrices = await getAllCurrentPrices();

      console.log(
        "✅ Got initial prices for",
        Object.keys(allPrices).length,
        "symbols"
      );

      setPrices((prev) => {
        const newPrices: Prices = { ...prev };
        let updatedCount = 0;

        Object.entries(allPrices).forEach(([symbol, priceData]) => {
          if (priceData && priceData.price !== null) {
            newPrices[symbol] = {
              last: priceData.price,
              percentChange: priceData.changePercent ?? undefined,
              lastUpdate: Date.now(),
            };
            updatedCount++;
          }
        });

        console.log(`💰 Loaded initial prices for ${updatedCount} symbols`);
        return newPrices;
      });

      setHasInitialPrices(true);
      setError(null);
    } catch (priceError) {
      console.error("❌ Failed to load initial prices:", priceError);
      setError("Failed to load initial prices");
    } finally {
      setIsInitialLoading(false);
    }
  }, [isInitialLoading, hasInitialPrices]);

  useEffect(() => {
    const handleAuthChange = () => {
      if (isAuthenticated() && !hasInitialPrices && !isInitialLoading) {
        console.log("🔄 Auth detected, loading initial prices...");
        loadInitialPrices();
      } else if (!isAuthenticated()) {
        // User logged out, clean up
        console.log("🚫 No auth, cleaning up price data...");
        closeStream();
        setPrices({});
        setHasInitialPrices(false);
        setError(null);
        clearAllPulses();
      }
    };

    if (!initializationRef.current) {
      initializationRef.current = true;
      handleAuthChange();
    }

    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, [
    loadInitialPrices,
    hasInitialPrices,
    isInitialLoading,
    closeStream,
    clearAllPulses,
  ]);

  useEffect(() => {
    if (hasInitialPrices && !isStreamActive()) {
      startPriceStream();
    }

    return () => {
      closeStream();
      clearPulseTimeouts();
    };
  }, [
    hasInitialPrices,
    startPriceStream,
    closeStream,
    isStreamActive,
    clearPulseTimeouts,
  ]);

  const refreshPrices = useCallback(async () => {
    setHasInitialPrices(false);
    await loadInitialPrices();
  }, [loadInitialPrices]);

  const contextValue: PriceContextType = {
    prices,
    pulsatingSymbols,
    isInitialLoading,
    hasInitialPrices,
    error,
    refreshPrices,
  };

  return (
    <PriceContext.Provider value={contextValue}>
      {children}
    </PriceContext.Provider>
  );
}

export function usePrices() {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error("usePrices must be used within a PriceProvider");
  }
  return context;
}

export function usePrice(symbol: string): Price {
  const { prices } = usePrices();
  return prices[symbol] ?? {};
}
