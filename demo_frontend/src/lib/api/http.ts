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
  private baseUrl: string;

  constructor(opts?: HttpClientOptions) {
    this.baseUrl = opts?.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
    if (typeof window !== "undefined") {
      loadTokensFromStorage();
    }
  }

  private authHeader(): Record<string, string> {
    const access = getAccessToken();
    return access ? { Authorization: `Bearer ${access}` } : {};
  }

  private async handle<T>(
    res: Response,
    retried = false,
    original: () => Promise<T>
  ): Promise<T> {
    if (res.ok) {
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        return (await res.json()) as T;
      }
      return undefined as T;
    }

    let body: ErrorResponse = {};
    try {
      body = await res.json();
    } catch {
      /* ignore */
    }

    const hasRefresh = !!getRefreshToken();
    if (
      !retried &&
      (res.status === 401 || (res.status === 403 && hasRefresh))
    ) {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        return original();
      }
    }

    const message =
      body?.message || body?.error || res.statusText || "Request failed";
    throw new ApiError(res.status, message, body);
  }

  private async tryRefresh(): Promise<boolean> {
    const existing = getRefreshToken();
    if (!existing) {
      return false;
    }

    try {
      const res = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: existing } as RefreshRequest),
      });

      const text = await res.text();
      let parsed: any = null;
      try {
        parsed = text ? JSON.parse(text) : null;
      } catch (e) {
        parsed = text;
      }

      if (!res.ok) {
        console.log("🔄 Session expired. Clearing tokens...");
        clearTokens();

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("authChanged"));
        }
        return false;
      }

      const data = (
        typeof parsed === "object" ? parsed : JSON.parse(text)
      ) as AuthResponse;

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
    const doFetch = () => {
      return fetch(`${this.baseUrl}${path}`, {
        headers: { ...this.authHeader() },
      }).then((res) => {
        return this.handle<T>(res, false, () => this.get<T>(path));
      });
    };
    return doFetch();
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const doFetch = () => {
      return fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.authHeader() },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      }).then((res) => {
        return this.handle<T>(res, false, () => this.post<T>(path, body));
      });
    };
    return doFetch();
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const doFetch = () => {
      return fetch(`${this.baseUrl}${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...this.authHeader() },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      }).then((res) => {
        return this.handle<T>(res, false, () => this.put<T>(path, body));
      });
    };
    return doFetch();
  }

  async delete<T = void>(path: string): Promise<T> {
    const doFetch = () => {
      return fetch(`${this.baseUrl}${path}`, {
        method: "DELETE",
        headers: { ...this.authHeader() },
      }).then((res) => {
        return this.handle<T>(res, false, () => this.delete<T>(path));
      });
    };
    return doFetch();
  }
}
