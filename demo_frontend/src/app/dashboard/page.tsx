import type { Metadata } from "next";
import HomeClient from "@/components/pageComponents/HomeClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Main dashboard of the application",
};

export default function HomePage() {
  return <HomeClient />;
}
