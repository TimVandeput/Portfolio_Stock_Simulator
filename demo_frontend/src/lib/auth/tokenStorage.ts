import { Role } from "@/types";
import { getCookie, setCookie, removeCookie } from "@/lib/utils/cookies";

let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _authenticatedAs: Role | null = null;
let _userId: number | null = null;

const ACCESS_KEY = "auth.access";
const REFRESH_KEY = "auth.refresh";
const AS_KEY = "auth.as";
const USER_ID_KEY = "auth.userId";

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
  _userId = getCookie(USER_ID_KEY) ? parseInt(getCookie(USER_ID_KEY)!) : null;
}

export function setTokens(tokens: {
  accessToken: string;
  refreshToken: string;
  authenticatedAs?: Role;
  userId?: number;
}) {
  _accessToken = tokens.accessToken;
  _refreshToken = tokens.refreshToken;
  if (tokens.authenticatedAs) _authenticatedAs = tokens.authenticatedAs;
  if (tokens.userId !== undefined) _userId = tokens.userId;
  if (isBrowser()) {
    setCookie(ACCESS_KEY, _accessToken ?? "");
    setCookie(REFRESH_KEY, _refreshToken ?? "");
    if (_authenticatedAs) setCookie(AS_KEY, _authenticatedAs);
    if (_userId !== null && _userId !== undefined) {
      setCookie(USER_ID_KEY, _userId.toString());
    }
  }
  emitAuthChange();
}

export function clearTokens() {
  _accessToken = null;
  _refreshToken = null;
  _authenticatedAs = null;
  _userId = null;
  if (isBrowser()) {
    removeCookie(ACCESS_KEY);
    removeCookie(REFRESH_KEY);
    removeCookie(AS_KEY);
    removeCookie(USER_ID_KEY);
  }
  emitAuthChange();
}

export function getAccessToken() {
  if (!_accessToken && isBrowser()) {
    _accessToken = getCookie(ACCESS_KEY);
  }
  return _accessToken;
}

export function getRefreshToken() {
  if (!_refreshToken && isBrowser()) {
    _refreshToken = getCookie(REFRESH_KEY);
  }
  return _refreshToken;
}

export function getAuthenticatedAs() {
  if (!_authenticatedAs && isBrowser()) {
    _authenticatedAs = (getCookie(AS_KEY) as Role | null) ?? null;
  }
  return _authenticatedAs;
}

export function getUserId() {
  if (!_userId && isBrowser()) {
    _userId = getCookie(USER_ID_KEY) ? parseInt(getCookie(USER_ID_KEY)!) : null;
  }
  return _userId;
}

export function getUserIdFromToken(): number | null {
  try {
    const token = getAccessToken();
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    return payload.userId || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
