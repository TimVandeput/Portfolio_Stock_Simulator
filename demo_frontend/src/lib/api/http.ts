/**
 * @fileoverview HTTP client with authentication and error handling for Stock Simulator API.
 *
 * This module provides a robust HTTP client built on Axios with comprehensive authentication
 * handling, automatic token refresh, request/response interceptors, and standardized error
 * management for all API communications.
 *
 * The client provides:
 * - Automatic Bearer token authentication
 * - Token refresh on 401/403 responses
 * - Comprehensive error handling and reporting
 * - Request/response interceptors
 * - Timeout management and retry logic
 * - Type-safe API responses
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import axios, { AxiosInstance, AxiosResponse } from "axios";
import type { RefreshRequest, AuthResponse } from "@/types";
import type { ErrorResponse, HttpClientOptions } from "@/types/api";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  loadTokensFromStorage,
} from "@/lib/auth/tokenStorage";

/**
 * Custom error class for API-related errors with enhanced error information.
 *
 * Extends the native Error class to provide additional context about API failures
 * including HTTP status codes and structured error response bodies.
 *
 * @example
 * ```typescript
 * try {
 *   await client.get('/api/data');
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.log(`API Error ${error.status}: ${error.message}`);
 *     console.log('Error details:', error.body);
 *   }
 * }
 * ```
 */
export class ApiError extends Error {
  /** HTTP status code of the failed request */
  status: number;
  /** Structured error response body from the server */
  body?: ErrorResponse;

  constructor(status: number, message: string, body?: ErrorResponse) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

/**
 * HTTP client class providing authenticated API communication with automatic token management.
 *
 * This class wraps Axios to provide a consistent interface for all API communications
 * with built-in authentication, token refresh, error handling, and type safety.
 *
 * @remarks
 * Key features:
 * - Automatic Bearer token authentication via request interceptors
 * - Token refresh on 401/403 responses with retry logic
 * - Comprehensive error handling with structured ApiError responses
 * - Type-safe HTTP methods (GET, POST, PUT, DELETE)
 * - Timeout management and request/response logging
 * - Cross-tab token synchronization
 *
 * @example
 * ```typescript
 * const client = new HttpClient();
 *
 * // GET request
 * const users = await client.get<User[]>('/api/users');
 *
 * // POST request
 * const newUser = await client.post<User>('/api/users', userData);
 *
 * // Error handling
 * try {
 *   await client.get('/api/protected');
 * } catch (error) {
 *   if (error instanceof ApiError && error.status === 401) {
 *     // Handle authentication error
 *   }
 * }
 * ```
 */
export class HttpClient {
  private client: AxiosInstance;

  constructor(opts?: HttpClientOptions) {
    const baseUrl = opts?.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    if (typeof window !== "undefined") {
      loadTokensFromStorage();
    }
  }

  private async handleRequest<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    retried = false
  ): Promise<T> {
    try {
      const response = await requestFn();
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status || 500;
        const body = (err.response?.data as ErrorResponse) || {};

        const hasRefresh = !!getRefreshToken();
        if (!retried && (status === 401 || (status === 403 && hasRefresh))) {
          const refreshed = await this.tryRefresh();
          if (refreshed) {
            return this.handleRequest(requestFn, true);
          }
        }

        let message = body?.message || body?.error;

        if (!message && body && typeof body === "object") {
          const fieldErrors = Object.entries(body)
            .filter(
              ([key, value]) =>
                key !== "message" &&
                key !== "error" &&
                typeof value === "string" &&
                value.trim().length > 0
            )
            .map(([, value]) => value as string);

          if (fieldErrors.length > 0) {
            message = fieldErrors[0];
          }
        }

        if (!message) {
          message = err.message || "Request failed";
        }

        throw new ApiError(status, message, body);
      }
      throw err;
    }
  }

  private async tryRefresh(): Promise<boolean> {
    const existing = getRefreshToken();
    if (!existing) {
      return false;
    }

    try {
      const response = await axios.post<AuthResponse>(
        `${this.client.defaults.baseURL}/api/auth/refresh`,
        { refreshToken: existing } as RefreshRequest,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        }
      );

      const data = response.data;

      let userIdFromToken = null;
      try {
        const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
        userIdFromToken = payload.userId || payload.id || payload.sub || null;
      } catch (tokenError) {
        console.error(
          "Failed to extract userId from refresh token:",
          tokenError
        );
      }

      setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        authenticatedAs: data.authenticatedAs,
        userId: userIdFromToken,
      });
      return true;
    } catch (err) {
      console.error("[HttpClient] tryRefresh error:", err);
      console.log("🔄 Session refresh failed. Clearing tokens...");
      clearTokens();

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("authChanged"));
      }
      return false;
    }
  }

  /**
   * Performs a GET request to the specified path.
   *
   * @template T The expected response type
   * @param path The API endpoint path
   * @returns Promise resolving to the typed response data
   * @throws ApiError on HTTP errors or authentication failures
   */
  async get<T>(path: string): Promise<T> {
    return this.handleRequest(() => this.client.get<T>(path));
  }

  /**
   * Performs a POST request to the specified path with optional body data.
   *
   * @template T The expected response type
   * @param path The API endpoint path
   * @param body Optional request body data
   * @returns Promise resolving to the typed response data
   * @throws ApiError on HTTP errors or authentication failures
   */
  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.handleRequest(() => this.client.post<T>(path, body));
  }

  /**
   * Performs a PUT request to the specified path with optional body data.
   *
   * @template T The expected response type
   * @param path The API endpoint path
   * @param body Optional request body data
   * @returns Promise resolving to the typed response data
   * @throws ApiError on HTTP errors or authentication failures
   */
  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.handleRequest(() => this.client.put<T>(path, body));
  }

  /**
   * Performs a DELETE request to the specified path.
   *
   * @template T The expected response type (defaults to void)
   * @param path The API endpoint path
   * @returns Promise resolving to the typed response data
   * @throws ApiError on HTTP errors or authentication failures
   */
  async delete<T = void>(path: string): Promise<T> {
    return this.handleRequest(() => this.client.delete<T>(path));
  }
}
