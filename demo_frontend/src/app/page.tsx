import type { Metadata } from "next";
import LoginClient from "@/components/pageComponents/LoginClient";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
};

export default function Home() {
  return <LoginClient />;
}
