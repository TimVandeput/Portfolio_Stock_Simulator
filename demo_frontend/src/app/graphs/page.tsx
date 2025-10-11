import type { Metadata } from "next";
import GraphClient from "./Client";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Live market analytics and charts",
};

export default function GraphPage() {
  return <GraphClient />;
}
