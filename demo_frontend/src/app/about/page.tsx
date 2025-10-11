import type { Metadata } from "next";
import AboutClient from "./Client";

export const metadata: Metadata = {
  title: "About",
  description: "About this application",
};

export default function AboutPage() {
  return <AboutClient />;
}
