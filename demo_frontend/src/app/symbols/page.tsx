import type { Metadata } from "next";
import SymbolsClient from "./Client";

export const metadata: Metadata = {
  title: "Symbols",
  description: "Admin: manage tradable symbols",
};

export default function SymbolsPage() {
  return <SymbolsClient />;
}
