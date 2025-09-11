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
import { listSymbols } from "@/lib/api/symbols";
import { openPriceStream, type StreamController } from "@/lib/api/stream";
import { getAccessToken } from "@/lib/auth/tokenStorage";
import type { PriceEvent } from "@/types";

export type Price = {
  last?: number;
  percentChange?: number;
  lastUpdate?: number;
};

export type Prices = Record<string, Price>;

interface PriceContextType {
  prices: Prices;
  pulsatingSymbols: Set<string>;
  isInitialLoading: boolean;
  hasInitialPrices: boolean;
  error: string | null;
  refreshPrices: () => Promise<void>;
}

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
  const [pulsatingSymbols, setPulsatingSymbols] = useState<Set<string>>(
    new Set()
  );
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [hasInitialPrices, setHasInitialPrices] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<StreamController | null>(null);
  const pulseTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const initializationRef = useRef(false);

  // Check if user is authenticated
  const isAuthenticated = () => !!getAccessToken();

  // Load initial prices from Yahoo API
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

  // Start real-time price streaming
  const startPriceStream = useCallback(async () => {
    if (!hasInitialPrices || !isAuthenticated()) return;

    console.log("🔗 Starting Finnhub price stream...");

    try {
      // Get symbols for streaming (limited to 50 for free tier)
      const symbolsPage = await listSymbols({ size: 50 });
      const symbols = symbolsPage.content.map((s) => s.symbol);

      if (symbols.length === 0) return;

      const stream = openPriceStream(symbols, {
        onPrice: (priceEvent: PriceEvent) => {
          const { symbol, price, percentChange } = priceEvent;

          setPrices((prev) => {
            const currentPrice = prev[symbol]?.last;

            if (currentPrice !== price) {
              console.log(
                `💥 Price update: ${symbol} ${currentPrice} → ${price}`
              );

              // Trigger pulsing animation
              setPulsatingSymbols((prevPulsing) => {
                const newPulsing = new Set(prevPulsing);
                newPulsing.add(symbol);
                return newPulsing;
              });

              // Clear existing timeout for this symbol
              if (pulseTimeoutRef.current[symbol]) {
                clearTimeout(pulseTimeoutRef.current[symbol]);
              }

              // Set timeout to stop pulsing
              pulseTimeoutRef.current[symbol] = setTimeout(() => {
                setPulsatingSymbols((prevPulsing) => {
                  const newPulsing = new Set(prevPulsing);
                  newPulsing.delete(symbol);
                  return newPulsing;
                });
                delete pulseTimeoutRef.current[symbol];
              }, 1500);

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
        onOpen: () => {
          console.log("✅ Price stream connected");
        },
        onError: () => {
          console.error("❌ Price stream error - possibly auth related");
          // Stream error might be due to token expiry
          // The stream will attempt to reconnect automatically
        },
        onClose: () => {
          console.log("🔌 Price stream closed");
        },
      });

      streamRef.current = stream;
    } catch (e) {
      console.error("Failed to start price stream:", e);
      // If listSymbols fails due to auth, it will be handled by HttpClient
      // and user will be redirected via useAccessControl
    }
  }, [hasInitialPrices]);

  // Initialize prices on mount and listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      if (isAuthenticated() && !hasInitialPrices && !isInitialLoading) {
        console.log("🔄 Auth detected, loading initial prices...");
        loadInitialPrices();
      } else if (!isAuthenticated()) {
        // User logged out, clean up
        console.log("🚫 No auth, cleaning up price data...");
        if (streamRef.current) {
          streamRef.current.close();
          streamRef.current = null;
        }
        setPrices({});
        setHasInitialPrices(false);
        setError(null);
        // Clear all pulse timeouts
        Object.values(pulseTimeoutRef.current).forEach((timeout) => {
          clearTimeout(timeout);
        });
        pulseTimeoutRef.current = {};
        setPulsatingSymbols(new Set());
      }
    };

    // Initial check
    if (!initializationRef.current) {
      initializationRef.current = true;
      handleAuthChange();
    }

    // Listen for auth changes
    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, [loadInitialPrices, hasInitialPrices, isInitialLoading]);

  // Start streaming once initial prices are loaded
  useEffect(() => {
    if (hasInitialPrices && !streamRef.current) {
      startPriceStream();
    }

    // Cleanup function
    return () => {
      if (streamRef.current) {
        console.log("🔌 Closing price stream...");
        streamRef.current.close();
        streamRef.current = null;
      }

      // Clear all pulse timeouts
      Object.values(pulseTimeoutRef.current).forEach((timeout) => {
        clearTimeout(timeout);
      });
      pulseTimeoutRef.current = {};
    };
  }, [hasInitialPrices, startPriceStream]);

  // Refresh function for manual reload
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
