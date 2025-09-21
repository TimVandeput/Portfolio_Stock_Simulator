import type { Metadata } from "next";
import GraphClient from "@/components/pageComponents/GraphClient";

export const metadata: Metadata = {
  title: "Graph",
  description: "Live market graphs and charts",
};

export default function GraphPage() {
  return <GraphClient />;
}
