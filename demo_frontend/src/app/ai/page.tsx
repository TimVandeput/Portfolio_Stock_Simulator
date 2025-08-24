import type { Metadata } from "next";
import AIClient from "@/components/pageComponents/AIClient";

export const metadata: Metadata = {
  title: "A.I.",
  description: "AI section of the application",
};

export default function AIPage() {
  return <AIClient />;
}
