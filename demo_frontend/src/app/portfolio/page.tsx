import type { Metadata } from "next";
import PortfolioClient from "@/components/pageComponents/PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Your investment portfolio",
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}
