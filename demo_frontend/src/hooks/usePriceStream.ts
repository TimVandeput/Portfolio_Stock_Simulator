/**
 * @fileoverview Real-time price streaming hook for WebSocket-based market data.
 *
 * This hook manages WebSocket connections to receive real-time stock price updates from
 * financial data providers. It handles connection lifecycle, authentication, error recovery,
 * and provides a clean interface for consuming live market data.
 *
 * The hook provides:
 * - WebSocket connection management for real-time prices
 * - Authentication-aware streaming with automatic reconnection
 * - Symbol subscription management
 * - Connection state tracking and error handling
 * - Automatic cleanup and resource management
 * - Integration with price animation systems
 *
 * @author Stock Simulator Team
 * @version 1.0.0
 * @since 2024
 */

"use client";

import { useRef, useCallback } from "react";
import { listSymbols } from "@/lib/api/symbols";
import { openPriceStream } from "@/lib/api/stream";
import { getAccessToken } from "@/lib/auth/tokenStorage";
import type { PriceEvent, StreamController } from "@/types";
import type { Prices } from "@/types/prices";

/**
 * Configuration options for the price streaming hook.
 *
 * @interface UsePriceStreamOptions
 */
interface UsePriceStreamOptions {
  /** Callback function triggered when price updates are received */
  onPriceUpdate: (
    symbol: string,
    price: number,
    percentChange?: number
  ) => void;
  /** Flag indicating whether initial price data has been loaded */
  hasInitialPrices: boolean;
}

/**
 * Hook for managing real-time stock price streaming via WebSocket connections.
 *
 * Provides a complete solution for receiving live market data updates with automatic
 * connection management, authentication handling, and error recovery.
 *
 * @param options - Configuration options for the price stream
 * @param options.onPriceUpdate - Callback for handling incoming price updates
 * @param options.hasInitialPrices - Whether initial prices have been loaded
 *
 * @returns Object containing stream control functions and state
 *
 * @remarks
 * This hook manages the complete lifecycle of real-time price streaming:
 * - Establishes WebSocket connections to financial data providers
 * - Subscribes to price updates for available symbols
 * - Handles authentication and connection errors gracefully
 * - Provides connection state tracking
 * - Automatically cleans up resources when unmounted
 * - Integrates with symbol management system
 *
 * The hook only starts streaming after initial prices are loaded and user is authenticated.
 * It automatically fetches the list of symbols to subscribe to and manages the WebSocket lifecycle.
 *
 * @example
 * ```tsx
 * function PriceProvider() {
 *   const [prices, setPrices] = useState({});
 *   const [hasInitialPrices, setHasInitialPrices] = useState(false);
 *
 *   const handlePriceUpdate = useCallback((symbol, price, percentChange) => {
 *     setPrices(prev => ({
 *       ...prev,
 *       [symbol]: { last: price, percentChange, lastUpdate: Date.now() }
 *     }));
 *   }, []);
 *
 *   const { startPriceStream, closeStream, isStreamActive } = usePriceStream({
 *     onPriceUpdate: handlePriceUpdate,
 *     hasInitialPrices
 *   });
 *
 *   useEffect(() => {
 *     if (hasInitialPrices) {
 *       startPriceStream();
 *     }
 *     return () => closeStream();
 *   }, [hasInitialPrices, startPriceStream, closeStream]);
 *
 *   return (
 *     <div>
 *       <div>Stream Status: {isStreamActive() ? 'Active' : 'Inactive'}</div>
 *       {Object.entries(prices).map(([symbol, price]) => (
 *         <div key={symbol}>{symbol}: ${price.last}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Integration with price context
 * function usePriceContext() {
 *   const [prices, setPrices] = useState({});
 *   const [hasInitialPrices, setHasInitialPrices] = useState(false);
 *
 *   const handlePriceUpdate = useCallback((symbol, price, percentChange) => {
 *     console.log(`Price update: ${symbol} = $${price} (${percentChange}%)`);
 *     setPrices(prev => ({
 *       ...prev,
 *       [symbol]: {
 *         last: price,
 *         percentChange,
 *         lastUpdate: Date.now()
 *       }
 *     }));
 *   }, []);
 *
 *   const stream = usePriceStream({
 *     onPriceUpdate: handlePriceUpdate,
 *     hasInitialPrices
 *   });
 *
 *   return { prices, stream };
 * }
 * ```
 */
export function usePriceStream({
  onPriceUpdate,
  hasInitialPrices,
}: UsePriceStreamOptions) {
  const streamRef = useRef<StreamController | null>(null);

  const isAuthenticated = () => !!getAccessToken();

  const startPriceStream = useCallback(async () => {
    if (!hasInitialPrices || !isAuthenticated()) return;

    console.log("🔗 Starting Finnhub price stream...");

    try {
      const symbolsPage = await listSymbols({ size: 50 });
      const symbols = symbolsPage.content.map((s) => s.symbol);

      if (symbols.length === 0) return;

      const stream = openPriceStream(symbols, {
        onPrice: (priceEvent: PriceEvent) => {
          const { symbol, price, percentChange } = priceEvent;
          onPriceUpdate(symbol, price, percentChange);
        },
        onOpen: () => {
          console.log("✅ Price stream connected");
        },
        onError: () => {
          console.error("❌ Price stream error - possibly auth related");
        },
        onClose: () => {
          console.log("🔌 Price stream closed");
        },
      });

      streamRef.current = stream;
    } catch (e) {
      console.error("Failed to start price stream:", e);
    }
  }, [hasInitialPrices, onPriceUpdate]);

  const closeStream = useCallback(() => {
    if (streamRef.current) {
      console.log("🔌 Closing price stream...");
      streamRef.current.close();
      streamRef.current = null;
    }
  }, []);

  const isStreamActive = useCallback(() => {
    return !!streamRef.current;
  }, []);

  return {
    startPriceStream,
    closeStream,
    isStreamActive,
  };
}
