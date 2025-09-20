import type { Metadata } from "next";
import SellSymbolClient from "@/components/pageComponents/SellSymbolClient";

interface Props {
  params: Promise<{ symbol: string }>;
}

export const metadata: Metadata = {
  title: "Sell Stock",
  description: "Sell shares from your portfolio",
};

export default async function SellSymbolPage({ params }: Props) {
  const { symbol } = await params;
  const symbolUpper = symbol.toUpperCase();

  return <SellSymbolClient symbol={symbolUpper} />;
}
