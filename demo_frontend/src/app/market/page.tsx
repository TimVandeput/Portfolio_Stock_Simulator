import type { Metadata } from "next";
import MarketClient from "./Client";

export const metadata: Metadata = {
  title: "Markets",
  description: "Market data and trading interface",
};

export default function MarketPage() {
  return <MarketClient />;
}
