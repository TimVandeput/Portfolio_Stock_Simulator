import type { Metadata } from "next";
import GameClient from "@/components/pageComponents/GameClient";

export const metadata: Metadata = {
  title: "Game",
  description: "Game section of the application",
};

export default function GamePage() {
  return <GameClient />;
}
