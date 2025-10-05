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

export class ApiError extends Error {
  status: number;
  body?: ErrorResponse;
  constructor(status: number, message: string, body?: ErrorResponse) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

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

  async get<T>(path: string): Promise<T> {
    return this.handleRequest(() => this.client.get<T>(path));
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.handleRequest(() => this.client.post<T>(path, body));
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.handleRequest(() => this.client.put<T>(path, body));
  }

  async delete<T = void>(path: string): Promise<T> {
    return this.handleRequest(() => this.client.delete<T>(path));
  }
}
