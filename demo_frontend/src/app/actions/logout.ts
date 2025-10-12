"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function serverLogout() {
  const cookieStore = await cookies();
  
  // Clear all authentication cookies server-side
  const authCookies = [
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
    "auth.userId"
  ];

  authCookies.forEach(cookieName => {
    cookieStore.delete(cookieName);
  });

  // Redirect to login page
  redirect("/");
}