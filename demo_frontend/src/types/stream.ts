/**
 * @fileoverview Real-Time Price Streaming Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * Price event types for WebSocket streaming messages.
 *
 * Categorizes different types of messages received through the
 * price streaming WebSocket connection, enabling appropriate
 * handling for price updates versus connection health checks.
 *
 * @typedef {("price" | "heartbeat")} PriceEventType
 */
export type PriceEventType = "price" | "heartbeat";

/**
 * Price streaming event structure for WebSocket messages.
 *
 * Represents individual price update events received through the
 * WebSocket connection, containing price data and metadata for
 * real-time market data processing and UI updates.
 *
 * @interface PriceEvent
 * @property {PriceEventType} type - Type of event ("price" or "heartbeat")
 * @property {string} symbol - Stock symbol for the price update
 * @property {number} price - Current stock price value
 * @property {number} [percentChange] - Percentage change from previous price
 * @property {number} [timestamp] - Unix timestamp of the price update
 *
 * @example
 * ```typescript
 * // Price update event
 * const priceUpdate: PriceEvent = {
 *   type: "price",
 *   symbol: "AAPL",
 *   price: 150.25,
 *   percentChange: 2.34,
 *   timestamp: Date.now()
 * };
 *
 * // Heartbeat event
 * const heartbeat: PriceEvent = {
 *   type: "heartbeat",
 *   symbol: "SYSTEM",
 *   price: 0,
 *   timestamp: Date.now()
 * };
 * ```
 */
export interface PriceEvent {
  type: PriceEventType;
  symbol: string;
  price: number;
  percentChange?: number;
  timestamp?: number;
}

/**
 * WebSocket event handlers for price streaming connection.
 *
 * Defines callback functions for handling different WebSocket events
 * during price streaming, including price updates, connection events,
 * and error handling for robust real-time data management.
 *
 * @interface StreamHandlers
 * @property {(event: PriceEvent) => void} [onPrice] - Handler for price update events
 * @property {(event: PriceEvent) => void} [onHeartbeat] - Handler for heartbeat/keepalive events
 * @property {(ev: Event) => void} [onOpen] - Handler for WebSocket connection open
 * @property {(ev: Event) => void} [onError] - Handler for WebSocket errors
 * @property {() => void} [onClose] - Handler for WebSocket connection close
 *
 * @example
 * ```typescript
 * // Stream handlers configuration
 * const streamHandlers: StreamHandlers = {
 *   onPrice: (event) => {
 *     console.log(`Price update: ${event.symbol} = $${event.price}`);
 *     updatePriceInUI(event.symbol, event.price, event.percentChange);
 *   },
 *   onHeartbeat: (event) => {
 *     console.log('Connection heartbeat received');
 *     updateConnectionStatus('connected');
 *   },
 *   onOpen: () => {
 *     console.log('Price stream connected');
 *     setConnectionStatus('connected');
 *   },
 *   onError: (error) => {
 *     console.error('Stream error:', error);
 *     setConnectionStatus('error');
 *   },
 *   onClose: () => {
 *     console.log('Price stream disconnected');
 *     setConnectionStatus('disconnected');
 *   }
 * };
 * ```
 */
export interface StreamHandlers {
  onPrice?: (event: PriceEvent) => void;
  onHeartbeat?: (event: PriceEvent) => void;
  onOpen?: (ev: Event) => void;
  onError?: (ev: Event) => void;
  onClose?: () => void;
}

/**
 * WebSocket stream controller interface for connection management.
 *
 * Provides control methods for managing the WebSocket price streaming
 * connection, including closing the connection and checking connection
 * status for connection health monitoring and cleanup.
 *
 * @interface StreamController
 * @property {() => void} close - Function to close the WebSocket connection
 * @property {() => number} readyState - Function to get current WebSocket ready state
 *
 * @example
 * ```typescript
 * // Stream connection management
 * function usePriceStream(symbols: string[]): StreamController | null {
 *   const [controller, setController] = useState<StreamController | null>(null);
 *
 *   const connect = () => {
 *     const ws = new WebSocket('wss://api.example.com/prices');
 *
 *     const streamController: StreamController = {
 *       close: () => ws.close(),
 *       readyState: () => ws.readyState
 *     };
 *
 *     ws.onopen = () => {
 *       console.log('Connected to price stream');
 *       // Subscribe to symbols
 *       ws.send(JSON.stringify({ action: 'subscribe', symbols }));
 *     };
 *
 *     setController(streamController);
 *   };
 *
 *   const disconnect = () => {
 *     if (controller) {
 *       controller.close();
 *       setController(null);
 *     }
 *   };
 *
 *   return controller;
 * }
 * ```
 */
export interface StreamController {
  close: () => void;
  readyState: () => number;
}
