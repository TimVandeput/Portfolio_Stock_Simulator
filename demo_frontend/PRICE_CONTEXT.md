# Global Price Context Documentation

## Overview

The global price context provides real-time stock price data throughout the entire frontend application. It follows a two-phase approach:

1. **Initial Load**: Fetches comprehensive price data from Yahoo Finance API
2. **Real-time Updates**: Uses Finnhub WebSocket streaming to keep prices current (limited to 50 symbols for free tier)

## Setup

The `PriceProvider` is already configured in the main layout (`ClientLayout.tsx`), so price data is available globally.

## Usage

### Basic Usage

```tsx
import { usePrices, usePrice } from "@/contexts/PriceContext";

function MyComponent() {
  // Get all prices and state
  const {
    prices,
    pulsatingSymbols,
    isInitialLoading,
    hasInitialPrices,
    error,
  } = usePrices();

  // Get price for a specific symbol
  const applePrice = usePrice("AAPL");

  if (isInitialLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>AAPL: ${applePrice.last?.toFixed(2) ?? "—"}</p>
      <p>Change: {applePrice.percentChange?.toFixed(2)}%</p>
    </div>
  );
}
```

### Price Data Structure

```typescript
type Price = {
  last?: number;
  percentChange?: number;
  lastUpdate?: number;
};

type Prices = Record<string, Price>;
```

### Context API

```typescript
interface PriceContextType {
  prices: Prices;
  pulsatingSymbols: Set<string>;
  isInitialLoading: boolean;
  hasInitialPrices: boolean;
  error: string | null;
  refreshPrices: () => Promise<void>;
}
```

### Hooks

#### `usePrices()`

Returns the complete context with all price data and state.

#### `usePrice(symbol: string)`

Returns the price data for a specific symbol. More efficient than accessing `prices[symbol]` directly.

## Features

### Real-time Updates

- Prices update automatically via WebSocket stream
- Visual feedback with pulsating animations for recently updated symbols
- Automatic reconnection on connection loss

### Performance

- Initial bulk load reduces API calls
- Streaming updates only for changed prices
- Optimized re-renders using React context

### Error Handling

- Graceful fallback when streaming fails
- Error states exposed to UI
- Manual refresh capability

## Visual Feedback

Use `pulsatingSymbols` to provide visual feedback for price updates:

```tsx
function PriceDisplay({ symbol }: { symbol: string }) {
  const { pulsatingSymbols } = usePrices();
  const price = usePrice(symbol);

  return (
    <span
      className={`${
        pulsatingSymbols.has(symbol) ? "animate-pulse text-amber-500" : ""
      }`}
    >
      ${price.last?.toFixed(2) ?? "—"}
    </span>
  );
}
```

## Color Coding

Standard color scheme for percentage changes:

```tsx
const getChangeColor = (percentChange?: number) => {
  if (!percentChange) return "opacity-60";
  const rounded = parseFloat(percentChange.toFixed(2));
  return rounded > 0
    ? "text-green-500"
    : rounded < 0
    ? "text-red-500"
    : "opacity-60";
};
```

## Integration Examples

### Market Tables

The `SymbolsTableDesktop` and `SymbolsListMobile` components already use the global context.

### Custom Components

See `components/examples/PriceExample.tsx` for a complete usage example.

### Other Pages

Any component in the app can access price data by importing the hooks:

```tsx
import { usePrice } from "@/contexts/PriceContext";

function PortfolioValue() {
  const holdings = [
    { symbol: "AAPL", shares: 10 },
    { symbol: "TSLA", shares: 5 },
  ];

  const totalValue = holdings.reduce((sum, holding) => {
    const price = usePrice(holding.symbol);
    return sum + (price.last ?? 0) * holding.shares;
  }, 0);

  return <div>Portfolio Value: ${totalValue.toFixed(2)}</div>;
}
```

## Limitations

- Finnhub free tier limits streaming to 50 symbols
- Yahoo Finance provides initial data but may have rate limits
- WebSocket connection requires active internet connection

## Benefits

- ✅ Centralized price management
- ✅ Real-time updates across entire app
- ✅ Efficient data sharing between components
- ✅ Automatic reconnection and error handling
- ✅ Visual feedback for price changes
- ✅ Type-safe price data access
