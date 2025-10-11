/**
 * @fileoverview API client modules export for Stock Simulator application
 *
 * Central export point for all API client modules providing access to backend services.
 * Includes authentication, trading, portfolio management, market data, and user services.
 *
 * @module lib/api
 * @author Tim Vandeput
 * @since 1.0.0
 */

// Authentication API
export * from "./auth";

// Stock chart and graph data API
export * from "./graphs";

// HTTP client and error handling
export * from "./http";

// User notifications API
export * from "./notifications";

// Portfolio management API
export * from "./portfolio";

// Real-time price data API
export * from "./prices";

// WebSocket streaming API
export * from "./stream";

// Stock symbols management API
export * from "./symbols";

// Trading operations API
export * from "./trading";

// User wallet management API
export * from "./wallet";
