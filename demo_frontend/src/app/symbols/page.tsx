import type { Metadata } from "next";
import SymbolsClient from "@/components/pageComponents/SymbolsClient";

export const metadata: Metadata = {
  title: "Symbols",
  description: "Admin: manage tradable symbols",
};

export default function SymbolsPage() {
  return <SymbolsClient />;
}
