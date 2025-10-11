import type { Metadata } from "next";
import HomeClient from "./Client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Main dashboard of the application",
};

export default function HomePage() {
  return <HomeClient />;
}
