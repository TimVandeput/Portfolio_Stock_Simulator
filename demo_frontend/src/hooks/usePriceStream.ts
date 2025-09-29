"use client";

import { useRef, useCallback } from "react";
import { listSymbols } from "@/lib/api/symbols";
import { openPriceStream } from "@/lib/api/stream";
import { getAccessToken } from "@/lib/auth/tokenStorage";
import type { PriceEvent, StreamController } from "@/types";
import type { Prices } from "@/types/prices";

interface UsePriceStreamOptions {
  onPriceUpdate: (
    symbol: string,
    price: number,
    percentChange?: number
  ) => void;
  hasInitialPrices: boolean;
}

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
