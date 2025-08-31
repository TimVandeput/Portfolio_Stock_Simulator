import type { Metadata } from "next";
import SymbolsClient from "@/components/pageComponents/SymbolsClient";

export const metadata: Metadata = {
  title: "Symbols",
  description: "Symbol management",
};

export default function SymbolsPage() {
  return <SymbolsClient />;
}
