import type { Metadata } from "next";
import MarketClient from "@/components/pageComponents/MarketClient";

export const metadata: Metadata = {
  title: "Markets",
  description: "Market data and trading interface",
};

export default function MarketPage() {
  return <MarketClient />;
}
