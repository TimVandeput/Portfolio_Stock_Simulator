import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import LoginClient from "./Client";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
};

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth.access")?.value;
  if (token) {
    redirect("/home");
  }

  return <LoginClient />;
}
