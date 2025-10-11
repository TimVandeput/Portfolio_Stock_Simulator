import type { Metadata } from "next";
import HelpClient from "./Client";

export const metadata: Metadata = {
  title: "Help",
  description: "Help and support",
};

export default function HelpPage() {
  return <HelpClient />;
}
