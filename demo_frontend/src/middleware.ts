import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/home" ||
    request.nextUrl.search.includes("logout=1")
  ) {
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");
    response.headers.set("CDN-Cache-Control", "no-store");
  }

  if (request.nextUrl.search.includes("logout=1")) {
    const authCookieNames = [
      "token",
      "refreshToken",
      "accessToken",
      "auth.token",
      "authToken",
      "jwt",
      "bearerToken",
      "auth.refresh",
      "auth.access",
      "auth.as",
      "auth.userId",
    ];

    authCookieNames.forEach((name) => {
      response.cookies.delete(name);
    });
  }

  return response;
}

export const config = {
  matcher: ["/", "/home", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
