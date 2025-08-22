import type { Metadata } from "next";
import AboutClient from "@/components/pageComponents/AboutClient";

export const metadata: Metadata = {
  title: "About",
  description: "About this application",
};

export default function AboutPage() {
  return <AboutClient />;
}
