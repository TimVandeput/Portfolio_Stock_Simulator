import { Role } from "@/types";

let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _authenticatedAs: Role | null = null;

const ACCESS_KEY = "auth.access";
const REFRESH_KEY = "auth.refresh";
const AS_KEY = "auth.as";

const isBrowser = () => typeof window !== "undefined";

export function loadTokensFromStorage() {
  if (!isBrowser()) return;
  _accessToken = window.localStorage.getItem(ACCESS_KEY);
  _refreshToken = window.localStorage.getItem(REFRESH_KEY);
  _authenticatedAs =
    (window.localStorage.getItem(AS_KEY) as Role | null) ?? null;
}

export function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
  authenticatedAs?: Role;
}) {
  _accessToken = tokens.accessToken;
  _refreshToken = tokens.refreshToken;
  if (tokens.authenticatedAs) _authenticatedAs = tokens.authenticatedAs;
  if (isBrowser()) {
    window.localStorage.setItem(ACCESS_KEY, _accessToken ?? "");
    window.localStorage.setItem(REFRESH_KEY, _refreshToken ?? "");
    if (_authenticatedAs) window.localStorage.setItem(AS_KEY, _authenticatedAs);
  }
}

export function clearTokens() {
  _accessToken = null;
  _refreshToken = null;
  _authenticatedAs = null;
  if (isBrowser()) {
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
    window.localStorage.removeItem(AS_KEY);
  }
}

export function getAccessToken() {
  return _accessToken;
}
export function getRefreshToken() {
  return _refreshToken;
}
export function getAuthenticatedAs() {
  return _authenticatedAs;
}

let refreshPromise: Promise<string> | null = null;
export function getRefreshLock() {
  return refreshPromise;
}
export function setRefreshLock(p: Promise<string> | null) {
  refreshPromise = p;
}
