/**
 * @fileoverview Real-time price context provider for the Stock Simulator application.
 *
 * This context manages the global price state, including real-time price updates via WebSocket streams,
 * initial price loading, authentication-aware price management, and price animation triggers.
 *
 * The context provides:
 * - Real-time price updates with WebSocket streaming
 * - Initial price loading via Yahoo Finance API
 * - Authentication-aware state management
 * - Price change animations and visual feedback
 * - Centralized error handling for price operations
 * - Automatic cleanup on authentication changes
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

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

/**
 * React context for managing real-time stock prices throughout the application.
 *
 * Provides centralized price state management with real-time updates, authentication-aware
 * loading, and visual animation triggers for price changes.
 *
 * @remarks
 * This context automatically handles:
 * - Initial price loading when user authenticates
 * - Real-time price streaming via WebSocket
 * - Price change animations and visual feedback
 * - Cleanup when user logs out
 * - Error handling and retry logic
 *
 * @example
 * ```tsx
 * // Using the context directly
 * const { prices, isInitialLoading, error } = usePrices();
 *
 * // Getting price for specific symbol
 * const applePrice = usePrice('AAPL');
 * console.log(applePrice.last); // Current price
 * console.log(applePrice.percentChange); // Percent change
 * ```
 */
const PriceContext = createContext<PriceContextType>({
  prices: {},
  pulsatingSymbols: new Set(),
  isInitialLoading: false,
  hasInitialPrices: false,
  error: null,
  refreshPrices: async () => {},
});

/**
 * Provider component that manages real-time price data and makes it available to child components.
 *
 * This component handles the entire price management lifecycle including initial data loading,
 * real-time streaming, authentication state changes, and cleanup operations.
 *
 * @param props - The provider props
 * @param props.children - Child components that will have access to the price context
 *
 * @returns The provider component wrapping children with price context
 *
 * @remarks
 * The provider automatically:
 * - Loads initial prices when user authenticates
 * - Starts real-time price streaming after initial load
 * - Cleans up all data when user logs out
 * - Handles errors and provides retry functionality
 * - Manages price change animations
 *
 * @example
 * ```tsx
 * // Wrap your app with the provider
 * function App() {
 *   return (
 *     <PriceProvider>
 *       <Dashboard />
 *       <Portfolio />
 *     </PriceProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Provider handles authentication changes automatically
 * function MyApp() {
 *   return (
 *     <AuthProvider>
 *       <PriceProvider>
 *         <StockList />
 *       </PriceProvider>
 *     </AuthProvider>
 *   );
 * }
 * ```
 */
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

/**
 * Hook to access the complete price context data and functionality.
 *
 * Provides access to all prices, loading states, error information, and price management functions.
 * Must be used within a PriceProvider component tree.
 *
 * @returns The complete price context value
 * @throws Error if used outside of PriceProvider
 *
 * @remarks
 * This hook provides:
 * - `prices`: Object containing all current stock prices
 * - `pulsatingSymbols`: Set of symbols currently showing price change animations
 * - `isInitialLoading`: Boolean indicating if initial prices are being loaded
 * - `hasInitialPrices`: Boolean indicating if initial prices have been loaded
 * - `error`: String containing any error message, or null
 * - `refreshPrices`: Function to manually refresh all price data
 *
 * @example
 * ```tsx
 * function StockDashboard() {
 *   const {
 *     prices,
 *     isInitialLoading,
 *     error,
 *     refreshPrices
 *   } = usePrices();
 *
 *   if (isInitialLoading) return <LoadingSpinner />;
 *   if (error) return <ErrorMessage error={error} onRetry={refreshPrices} />;
 *
 *   return (
 *     <div>
 *       {Object.entries(prices).map(([symbol, price]) => (
 *         <PriceCard key={symbol} symbol={symbol} price={price} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Check for price animations
 * function AnimatedPrice({ symbol }) {
 *   const { prices, pulsatingSymbols } = usePrices();
 *   const price = prices[symbol];
 *   const isPulsating = pulsatingSymbols.has(symbol);
 *
 *   return (
 *     <span className={isPulsating ? 'animate-pulse' : ''}>
 *       ${price?.last?.toFixed(2)}
 *     </span>
 *   );
 * }
 * ```
 */
export function usePrices() {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error("usePrices must be used within a PriceProvider");
  }
  return context;
}

/**
 * Hook to get price data for a specific stock symbol.
 *
 * This is a convenience hook that extracts price data for a single symbol from the global
 * price context, returning an empty object if the symbol is not found.
 *
 * @param symbol - The stock symbol to get price data for (e.g., 'AAPL', 'GOOGL')
 * @returns Price object containing last price, percent change, and last update timestamp
 *
 * @remarks
 * The returned Price object contains:
 * - `last`: The most recent price value
 * - `percentChange`: Percentage change from previous close (optional)
 * - `lastUpdate`: Timestamp of when this price was last updated
 *
 * If the symbol is not found, returns an empty object `{}`.
 *
 * @example
 * ```tsx
 * function StockPrice({ symbol }) {
 *   const price = usePrice(symbol);
 *
 *   if (!price.last) {
 *     return <span>Loading...</span>;
 *   }
 *
 *   return (
 *     <div>
 *       <span>${price.last.toFixed(2)}</span>
 *       {price.percentChange && (
 *         <span className={price.percentChange >= 0 ? 'text-green' : 'text-red'}>
 *           {price.percentChange > 0 ? '+' : ''}
 *           {price.percentChange.toFixed(2)}%
 *         </span>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Use in a trading component
 * function TradingWidget({ symbol }) {
 *   const price = usePrice(symbol);
 *   const [quantity, setQuantity] = useState(1);
 *
 *   const totalValue = price.last ? price.last * quantity : 0;
 *
 *   return (
 *     <div>
 *       <h3>{symbol}</h3>
 *       <p>Current Price: ${price.last?.toFixed(2) || 'N/A'}</p>
 *       <input
 *         type="number"
 *         value={quantity}
 *         onChange={(e) => setQuantity(parseInt(e.target.value))}
 *       />
 *       <p>Total: ${totalValue.toFixed(2)}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePrice(symbol: string): Price {
  const { prices } = usePrices();
  return prices[symbol] ?? {};
}
