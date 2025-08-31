import type { Metadata } from "next";
import LiveClient from "@/components/pageComponents/LiveClient";

export const metadata: Metadata = {
  title: "Live",
  description: "Live market data",
};

export default function LivePage() {
  return <LiveClient />;
}
