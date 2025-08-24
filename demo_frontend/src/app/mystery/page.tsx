import type { Metadata } from "next";
import MysteryClient from "@/components/pageComponents/MysteryClient";

export const metadata: Metadata = {
  title: "Mystery",
  description: "A mysterious page",
};

export default function MysteryPage() {
  return <MysteryClient />;
}
