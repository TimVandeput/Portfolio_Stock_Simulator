function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/`;
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

import { Role } from "@/types";

let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _authenticatedAs: Role | null = null;

const ACCESS_KEY = "auth.access";
const REFRESH_KEY = "auth.refresh";
const AS_KEY = "auth.as";

const isBrowser = () => typeof window !== "undefined";

const emitAuthChange = () => {
  if (isBrowser()) {
    window.dispatchEvent(new Event("authChanged"));
  }
};

export function loadTokensFromStorage() {
  if (!isBrowser()) return;
  _accessToken = getCookie(ACCESS_KEY);
  _refreshToken = getCookie(REFRESH_KEY);
  _authenticatedAs = (getCookie(AS_KEY) as Role | null) ?? null;
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
    setCookie(ACCESS_KEY, _accessToken ?? "");
    setCookie(REFRESH_KEY, _refreshToken ?? "");
    if (_authenticatedAs) setCookie(AS_KEY, _authenticatedAs);

    sessionStorage.removeItem("sessionExpired");
  }
  emitAuthChange();
}

export function clearTokens() {
  _accessToken = null;
  _refreshToken = null;
  _authenticatedAs = null;
  if (isBrowser()) {
    removeCookie(ACCESS_KEY);
    removeCookie(REFRESH_KEY);
    removeCookie(AS_KEY);

    sessionStorage.removeItem("sessionExpired");
  }
  emitAuthChange();
}

export function getAccessToken() {
  if (isBrowser()) {
    const cookieToken = getCookie(ACCESS_KEY);
    if (cookieToken !== _accessToken) {
      _accessToken = cookieToken;
      emitAuthChange();
    }
  }
  return _accessToken;
}
export function getRefreshToken() {
  if (isBrowser()) {
    const cookieToken = getCookie(REFRESH_KEY);
    if (cookieToken !== _refreshToken) {
      _refreshToken = cookieToken;
      emitAuthChange();
    }
  }
  return _refreshToken;
}
export function getAuthenticatedAs() {
  if (isBrowser()) {
    const cookieRole = getCookie(AS_KEY) as Role | null;
    if (cookieRole !== _authenticatedAs) {
      _authenticatedAs = cookieRole;
      emitAuthChange();
    }
  }
  return _authenticatedAs;
}
