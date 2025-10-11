import type { Metadata } from "next";
import BuySymbolClient from "./Client";

interface Props {
  params: Promise<{ symbol: string }>;
}

export const metadata: Metadata = {
  title: "Buy Stock",
  description: "Purchase shares in your portfolio",
};

export default async function BuySymbolPage({ params }: Props) {
  const { symbol } = await params;
  const symbolUpper = symbol.toUpperCase();

  return <BuySymbolClient symbol={symbolUpper} />;
}
