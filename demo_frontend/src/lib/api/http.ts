import type { RefreshRequest, AuthResponse } from "@/types";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  getRefreshLock,
  setRefreshLock,
  loadTokensFromStorage,
} from "@/lib/auth/tokenStorage";

export interface ApiErrorShape {
  status: number;
  path?: string;
  message: string;
  error?: string;
  timestamp?: string;
}

export class ApiError extends Error {
  status: number;
  body?: any;
  constructor(status: number, message: string, body?: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export interface HttpClientOptions {
  baseUrl?: string;
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

    if (res.status === 401 && !retried) {
      const refreshed = await this.tryRefresh();
      if (refreshed) {
        return original();
      }
    }

    let body: any = undefined;
    try {
      body = await res.json();
    } catch {
      /* ignore */
    }
    const message =
      body?.message || body?.error || res.statusText || "Request failed";
    throw new ApiError(res.status, message, body);
  }

  private async tryRefresh(): Promise<boolean> {
    const existing = getRefreshToken();
    if (!existing) return false;

    const lock = getRefreshLock();
    if (lock) {
      try {
        await lock;
        return true;
      } catch {
        return false;
      }
    }

    const task = (async () => {
      try {
        const res = await fetch(`${this.baseUrl}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: existing } as RefreshRequest),
        });
        if (!res.ok) throw new Error("Refresh failed");
        const data = (await res.json()) as AuthResponse;
        setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          authenticatedAs: data.authenticatedAs,
        });
        return data.accessToken;
      } finally {
        setRefreshLock(null);
      }
    })();

    setRefreshLock(task);
    try {
      await task;
      return true;
    } catch {
      clearTokens();
      return false;
    }
  }

  async get<T>(path: string): Promise<T> {
    const doFetch = () =>
      fetch(`${this.baseUrl}${path}`, {
        headers: { ...this.authHeader() },
      }).then((res) => this.handle<T>(res, true, () => this.get<T>(path)));
    return doFetch();
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const doFetch = () =>
      fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...this.authHeader() },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      }).then((res) =>
        this.handle<T>(res, true, () => this.post<T>(path, body))
      );
    return doFetch();
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const doFetch = () =>
      fetch(`${this.baseUrl}${path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...this.authHeader() },
        body: body !== undefined ? JSON.stringify(body) : undefined,
      }).then((res) =>
        this.handle<T>(res, true, () => this.put<T>(path, body))
      );
    return doFetch();
  }

  async delete<T = void>(path: string): Promise<T> {
    const doFetch = () =>
      fetch(`${this.baseUrl}${path}`, {
        method: "DELETE",
        headers: { ...this.authHeader() },
      }).then((res) => this.handle<T>(res, true, () => this.delete<T>(path)));
    return doFetch();
  }
}
